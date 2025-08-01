import React, { useState, useEffect, useCallback } from 'react'
import {
   View,
   Text,
   StyleSheet,
   ActivityIndicator,
   Alert,
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { apiClient } from '../../../lib/api'
import { Branch, Category, MenuItem } from '../../../lib/api/types'
import { useAuthStore } from '../../../lib/auth/store'
import { DraftOrderStorage } from '../../../lib/storage/draft-storage'
import POSHeader from '../../../components/pos/POSHeader'
import MenuSection from '../../../components/pos/MenuSection'
import CartSection from '../../../components/pos/CartSection'
import ItemModal from '../../../components/pos/ItemModal'

export interface CartItem {
   menuItem: MenuItem
   quantity: number
   notes?: string
}

export default function POSMenuScreen() {
   // Get user data from auth store
   const { user } = useAuthStore()
   
   // Get search params for draft restoration
   const params = useLocalSearchParams()
   const restoreDraftId = params.restoreDraftId as string | undefined
   
   // Data states
   const [branches, setBranches] = useState<Branch[]>([])
   const [categories, setCategories] = useState<Category[]>([])
   const [menuItems, setMenuItems] = useState<MenuItem[]>([])
   const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItem[]>([])
   const [cartItems, setCartItems] = useState<CartItem[]>([])
   const [userPrimaryBranch, setUserPrimaryBranch] = useState<Branch | null>(null)
   
   // UI states
   const [isLoading, setIsLoading] = useState(true)
   const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
   const [searchQuery, setSearchQuery] = useState('')
   
   // Modal states
   const [showItemModal, setShowItemModal] = useState(false)
   const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null)
   
   // Restore draft order function
   const restoreDraftOrder = async (draftId: string) => {
      try {
         const draftOrders = await DraftOrderStorage.getDraftOrders()
         const draftOrder = draftOrders.find(draft => draft.id === draftId)
         
         if (draftOrder) {
            // Restore cart items
            setCartItems(draftOrder.items)
            
            // Show success message
            Alert.alert(
               'Draft Restored',
               `Draft order with ${draftOrder.items.length} items has been restored.`,
               [
                  {
                     text: 'OK',
                  }
               ]
            )
         } else {
            Alert.alert('Error', 'Draft order not found')
         }
      } catch (error) {
         console.error('Failed to restore draft:', error)
         Alert.alert('Error', 'Failed to restore draft order')
      }
   }

   const loadInitialData = useCallback(async () => {
      try {
         setIsLoading(true)
         const [branchesResponse, menuItemsResponse, categoriesResponse] = await Promise.all([
            apiClient.branches.getBranches(),
            apiClient.menu.getMenuItems(),
            apiClient.menu.getCategories(),
         ])
         setBranches(branchesResponse)
         setMenuItems(menuItemsResponse)
         setCategories(categoriesResponse)
         
         // Set user's primary branch if available
         if (user?.primaryBranchId && branchesResponse.length > 0) {
            const primaryBranch = branchesResponse.find(branch => branch.id === user.primaryBranchId)
            if (primaryBranch) {
               setUserPrimaryBranch(primaryBranch)
            }
         }

         // Restore draft order if requested
         if (restoreDraftId) {
            await restoreDraftOrder(restoreDraftId)
         }
      } catch (error) {
         console.error('Failed to load data:', error)
         Alert.alert('Error', 'Failed to load data. Please try again.')
      } finally {
         setIsLoading(false)
      }
   }, [user?.primaryBranchId, restoreDraftId])

   // Load initial data
   useEffect(() => {
      loadInitialData()
   }, [loadInitialData, user])

   // Filter menu items
   useEffect(() => {
      let filtered = menuItems

      if (selectedCategory) {
         filtered = filtered.filter(item => item.categoryId === selectedCategory)
      }

      if (searchQuery.trim()) {
         const query = searchQuery.toLowerCase()
         filtered = filtered.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query)
         )
      }

      setFilteredMenuItems(filtered)
   }, [menuItems, selectedCategory, searchQuery])

   const addToCart = (item: MenuItem, quantity: number, notes?: string) => {
      const existingIndex = cartItems.findIndex(cartItem => cartItem.menuItem.id === item.id)
      
      if (existingIndex >= 0) {
         const updatedItems = [...cartItems]
         updatedItems[existingIndex].quantity += quantity
         if (notes) {
            updatedItems[existingIndex].notes = notes
         }
         setCartItems(updatedItems)
      } else {
         setCartItems([...cartItems, { menuItem: item, quantity, notes }])
      }
   }

   const updateCartItemQuantity = (index: number, newQuantity: number) => {
      if (newQuantity <= 0) {
         return
      }

      const updatedItems = [...cartItems]
      updatedItems[index].quantity = newQuantity
      setCartItems(updatedItems)
   }

   const removeCartItem = (index: number) => {
      Alert.alert(
         'Remove Item',
         'Are you sure you want to remove this item?',
         [
            { text: 'Cancel', style: 'cancel' },
            {
               text: 'Remove',
               style: 'destructive',
               onPress: () => {
                  const updatedItems = cartItems.filter((_, i) => i !== index)
                  setCartItems(updatedItems)
               },
            },
         ]
      )
   }

   const formatPrice = (price: number) => {
      return new Intl.NumberFormat('id-ID', {
         style: 'currency',
         currency: 'IDR',
         minimumFractionDigits: 0,
      }).format(price)
   }

   const total = cartItems.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)

   const handleCheckout = () => {
      if (cartItems.length === 0) {
         Alert.alert('Empty Cart', 'Please add items to your cart before checkout.')
         return
      }

      // Navigate to checkout screen with cart data
      router.push({
         pathname: '/(app)/pos/checkout',
         params: {
            cartData: JSON.stringify(cartItems),
            branches: JSON.stringify(branches),
            userPrimaryBranch: userPrimaryBranch ? JSON.stringify(userPrimaryBranch) : undefined
         }
      })
   }

   if (isLoading) {
      return (
         <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading...</Text>
         </View>
      )
   }

   return (
      <View style={styles.container}>
         <POSHeader
            onBack={() => {
               if (router.canGoBack()) {
                  router.back()
               } else {
                  router.replace('/')
               }
            }}
            cartItemCount={cartItems.length}
            onCartPress={handleCheckout}
            onDraftOrdersPress={() => router.push('/(app)/draft-orders')}
         />

         <View style={styles.mainContent}>
            <MenuSection
               categories={categories}
               menuItems={filteredMenuItems}
               selectedCategory={selectedCategory}
               onCategorySelect={setSelectedCategory}
               searchQuery={searchQuery}
               onSearchChange={setSearchQuery}
               onItemPress={(item) => {
                  setSelectedMenuItem(item)
                  setShowItemModal(true)
               }}
               formatPrice={formatPrice}
            />

            <CartSection
               cartItems={cartItems}
               onUpdateQuantity={updateCartItemQuantity}
               onRemoveItem={removeCartItem}
               onCheckout={handleCheckout}
               formatPrice={formatPrice}
               total={total}
            />
         </View>

         <ItemModal
            visible={showItemModal}
            item={selectedMenuItem}
            onClose={() => {
               setShowItemModal(false)
               setSelectedMenuItem(null)
            }}
            onAddToCart={addToCart}
         />
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#f8f9fa',
   },
   loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
   },
   loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: '#666',
   },
   mainContent: {
      flex: 1,
      flexDirection: 'row',
   },
})
