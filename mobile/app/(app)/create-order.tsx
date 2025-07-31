import React, { useState, useEffect } from 'react'
import {
   View,
   Text,
   StyleSheet,
   ActivityIndicator,
   Alert,
} from 'react-native'
import { router } from 'expo-router'
import { apiClient } from '../../lib/api'
import { Branch, Category, MenuItem } from '../../lib/api/types'
import { CreateOrderDto, CreateOrderItemDto } from '../../lib/api/order-client'
import { useAuthStore } from '../../lib/auth/store'
import POSHeader from '../../components/pos/POSHeader'
import MenuSection from '../../components/pos/MenuSection'
import CartSection from '../../components/pos/CartSection'
import ItemModal from '../../components/pos/ItemModal'
import CheckoutModal from '../../components/pos/CheckoutModal'

export interface CartItem {
   menuItem: MenuItem
   quantity: number
   notes?: string
}

export default function POSCreateOrderScreen() {
   // Get user data from auth store
   const { user } = useAuthStore()
   
   // Data states
   const [branches, setBranches] = useState<Branch[]>([])
   const [categories, setCategories] = useState<Category[]>([])
   const [menuItems, setMenuItems] = useState<MenuItem[]>([])
   const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItem[]>([])
   const [cartItems, setCartItems] = useState<CartItem[]>([])
   const [userPrimaryBranch, setUserPrimaryBranch] = useState<Branch | null>(null)
   
   // UI states
   const [isLoading, setIsLoading] = useState(true)
   const [isSubmitting, setIsSubmitting] = useState(false)
   const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
   const [searchQuery, setSearchQuery] = useState('')
   
   // Modal states
   const [showItemModal, setShowItemModal] = useState(false)
   const [showCheckout, setShowCheckout] = useState(false)
   const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null)
   

   
   const loadInitialData = async () => {
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
      } catch (error) {
         console.error('Failed to load data:', error)
         Alert.alert('Error', 'Failed to load data. Please try again.')
      } finally {
         setIsLoading(false)
      }
   }

   // Load initial data
   useEffect(() => {
      loadInitialData()
   }, [user])

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

   const formatPrice = (amount: number) => {
      return new Intl.NumberFormat('id-ID', {
         style: 'currency',
         currency: 'IDR',
         minimumFractionDigits: 0,
      }).format(amount)
   }

   const calculateTotal = () => {
      return cartItems.reduce(
         (total, item) => total + item.menuItem.price * item.quantity,
         0
      )
   }

   const handleItemPress = (item: MenuItem) => {
      setSelectedMenuItem(item)
      setShowItemModal(true)
   }

   const addToCart = (item: CartItem) => {
      const existingItemIndex = cartItems.findIndex(
         (cartItem) => cartItem.menuItem.id === item.menuItem.id
      )

      if (existingItemIndex >= 0) {
         const updatedItems = [...cartItems]
         updatedItems[existingItemIndex].quantity += item.quantity
         if (item.notes?.trim()) {
            updatedItems[existingItemIndex].notes = item.notes.trim()
         }
         setCartItems(updatedItems)
      } else {
         setCartItems([...cartItems, item])
      }
      setShowItemModal(false)
   }

   const updateCartItemQuantity = (index: number, newQuantity: number) => {
      if (newQuantity <= 0) {
         removeCartItem(index)
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

   const handleCheckout = async (orderData: {
      customerName: string
      customerPhone?: string
      branchId: string
      deskNumber?: string
   }) => {
      try {
         setIsSubmitting(true)

         const createOrderDto: CreateOrderDto = {
            customerName: orderData.customerName.trim(),
            customerPhone: orderData.customerPhone?.trim() || undefined,
            branchId: orderData.branchId,
            deskId: orderData.deskNumber?.trim() || undefined,
            items: cartItems.map(
               (item): CreateOrderItemDto => ({
                  menuItemId: item.menuItem.id,
                  quantity: item.quantity,
                  notes: item.notes,
               })
            ),
         }

         await apiClient.orders.createOrder(createOrderDto)

         Alert.alert('Success', 'Order created successfully!', [
            {
               text: 'OK',
               onPress: () => {
                  setShowCheckout(false)
                  router.back()
               },
            },
         ])
      } catch (error) {
         console.error('Failed to create order:', error)
         Alert.alert('Error', 'Failed to create order. Please try again.')
      } finally {
         setIsSubmitting(false)
      }
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
            onBack={() => router.back()}
            cartItemCount={cartItems.length}
            onCartPress={() => setShowCheckout(true)}
         />

         <View style={styles.mainContent}>
            <MenuSection
               categories={categories}
               menuItems={filteredMenuItems}
               selectedCategory={selectedCategory}
               searchQuery={searchQuery}
               onCategorySelect={setSelectedCategory}
               onSearchChange={setSearchQuery}
               onItemPress={handleItemPress}
               formatPrice={formatPrice}
            />

            <CartSection
               cartItems={cartItems}
               onUpdateQuantity={updateCartItemQuantity}
               onRemoveItem={removeCartItem}
               onCheckout={() => setShowCheckout(true)}
               formatPrice={formatPrice}
               total={calculateTotal()}
            />
         </View>

         <ItemModal
            visible={showItemModal}
            menuItem={selectedMenuItem}
            onClose={() => setShowItemModal(false)}
            onAddToCart={addToCart}
            formatPrice={formatPrice}
         />

         <CheckoutModal
            visible={showCheckout}
            cartItems={cartItems}
            branches={branches}
            defaultBranch={userPrimaryBranch}
            total={calculateTotal()}
            isSubmitting={isSubmitting}
            onClose={() => setShowCheckout(false)}
            onSubmit={handleCheckout}
            formatPrice={formatPrice}
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