import React, { useState, useEffect } from 'react'
import {
   View,
   Text,
   StyleSheet,
   ScrollView,
   TouchableOpacity,
   TextInput,
   Alert,
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Branch } from '../../../lib/api/types'
import { DraftOrderStorage } from '../../../lib/storage/draft-storage'
import { CartItem } from './menu'

export default function POSCheckoutScreen() {
   const params = useLocalSearchParams()
   
   // Parse cart data from params
   const cartItems: CartItem[] = params.cartData ? JSON.parse(params.cartData as string) : []
   const branches: Branch[] = params.branches ? JSON.parse(params.branches as string) : []
   const userPrimaryBranch: Branch | null = params.userPrimaryBranch ? JSON.parse(params.userPrimaryBranch as string) : null

   // Form states
   const [customerName, setCustomerName] = useState('')
   const [customerPhone, setCustomerPhone] = useState('')
   const [selectedBranch, setSelectedBranch] = useState<Branch | null>(userPrimaryBranch)
   const [deskNumber, setDeskNumber] = useState('')
   const [showBranchSelector, setShowBranchSelector] = useState(false)

   // Calculate total
   const total = cartItems.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)

   const formatPrice = (price: number) => {
      return new Intl.NumberFormat('id-ID', {
         style: 'currency',
         currency: 'IDR',
         minimumFractionDigits: 0,
      }).format(price)
   }

   const handleSaveDraft = async () => {
      if (!selectedBranch || cartItems.length === 0) {
         Alert.alert('Error', 'Please select a branch and add items to cart')
         return
      }

      try {
         await DraftOrderStorage.saveDraftOrder({
            customerName: customerName.trim() || undefined,
            customerPhone: customerPhone.trim() || undefined,
            branchId: selectedBranch.id,
            branchName: selectedBranch.name,
            deskNumber: deskNumber.trim() || undefined,
            items: cartItems,
            totalAmount: total,
         })
         
         Alert.alert('Success', 'Draft order saved successfully!', [
            {
               text: 'OK',
               onPress: () => router.back()
            }
         ])
      } catch (err) {
         console.error('Failed to save draft:', err)
         Alert.alert('Error', 'Failed to save draft order')
      }
   }

   const handleProceedToPayment = () => {
      if (!customerName.trim()) {
         Alert.alert('Error', 'Please enter customer name')
         return
      }

      if (!selectedBranch) {
         Alert.alert('Error', 'Please select a branch')
         return
      }

      if (cartItems.length === 0) {
         Alert.alert('Error', 'Cart is empty')
         return
      }

      // Navigate to payment screen
      router.push({
         pathname: '/(app)/pos/payment',
         params: {
            customerName: customerName.trim(),
            customerPhone: customerPhone.trim() || undefined,
            branchId: selectedBranch.id,
            branchName: selectedBranch.name,
            deskNumber: deskNumber.trim() || undefined,
            cartData: JSON.stringify(cartItems),
            totalAmount: total.toString(),
         }
      })
   }

   return (
      <View style={styles.container}>
         <View style={styles.header}>
            <TouchableOpacity
               style={styles.backButton}
               onPress={() => router.back()}
            >
               <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Checkout</Text>
            <View style={styles.headerRight} />
         </View>

         <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Customer Information */}
            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Customer Information</Text>
               
               <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Customer Name *</Text>
                  <TextInput
                     style={styles.input}
                     value={customerName}
                     onChangeText={setCustomerName}
                     placeholder="Enter customer name"
                     placeholderTextColor="#999"
                  />
               </View>

               <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Phone Number (Optional)</Text>
                  <TextInput
                     style={styles.input}
                     value={customerPhone}
                     onChangeText={setCustomerPhone}
                     placeholder="Enter phone number"
                     placeholderTextColor="#999"
                     keyboardType="phone-pad"
                  />
               </View>
            </View>

            {/* Branch Selection */}
            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Branch & Table</Text>
               
               <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Branch *</Text>
                  <TouchableOpacity
                     style={styles.branchSelector}
                     onPress={() => setShowBranchSelector(true)}
                  >
                     <Text style={[styles.branchSelectorText, !selectedBranch && styles.placeholder]}>
                        {selectedBranch ? selectedBranch.name : 'Select Branch'}
                     </Text>
                     <Ionicons name="chevron-down" size={20} color="#666" />
                  </TouchableOpacity>
               </View>

               <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Table/Desk Number (Optional)</Text>
                  <TextInput
                     style={styles.input}
                     value={deskNumber}
                     onChangeText={setDeskNumber}
                     placeholder="Enter table number"
                     placeholderTextColor="#999"
                  />
               </View>
            </View>

            {/* Order Summary */}
            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Order Summary</Text>
               
               {cartItems.map((item, index) => (
                  <View key={index} style={styles.summaryItem}>
                     <View style={styles.summaryItemInfo}>
                        <Text style={styles.summaryItemName}>
                           {item.quantity}x {item.menuItem.name}
                        </Text>
                        {item.notes && (
                           <Text style={styles.summaryItemNotes}>
                              Note: {item.notes}
                           </Text>
                        )}
                     </View>
                     <Text style={styles.summaryItemPrice}>
                        {formatPrice(item.menuItem.price * item.quantity)}
                     </Text>
                  </View>
               ))}
               
               <View style={styles.summaryTotal}>
                  <Text style={styles.summaryTotalLabel}>Total:</Text>
                  <Text style={styles.summaryTotalAmount}>{formatPrice(total)}</Text>
               </View>
            </View>
         </ScrollView>

         {/* Footer Actions */}
         <View style={styles.footer}>
            <TouchableOpacity
               style={styles.draftButton}
               onPress={handleSaveDraft}
               disabled={!selectedBranch || cartItems.length === 0}
            >
               <Ionicons name="save" size={16} color="#666" />
               <Text style={styles.draftButtonText}>Save Draft</Text>
            </TouchableOpacity>

            <TouchableOpacity
               style={[
                  styles.proceedButton,
                  {
                     opacity: (!customerName.trim() || !selectedBranch || cartItems.length === 0) ? 0.5 : 1
                  }
               ]}
               onPress={handleProceedToPayment}
               disabled={!customerName.trim() || !selectedBranch || cartItems.length === 0}
            >
               <Text style={styles.proceedButtonText}>
                  Proceed to Payment - {formatPrice(total)}
               </Text>
               <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
         </View>

         {/* Branch Selection Modal */}
         {showBranchSelector && (
            <View style={styles.modalOverlay}>
               <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                     <Text style={styles.modalTitle}>Select Branch</Text>
                     <TouchableOpacity
                        onPress={() => setShowBranchSelector(false)}
                     >
                        <Ionicons name="close" size={24} color="#333" />
                     </TouchableOpacity>
                  </View>
                  
                  <ScrollView style={styles.branchList}>
                     {branches.map((branch) => (
                        <TouchableOpacity
                           key={branch.id}
                           style={[
                              styles.branchItem,
                              selectedBranch?.id === branch.id && styles.selectedBranchItem
                           ]}
                           onPress={() => {
                              setSelectedBranch(branch)
                              setShowBranchSelector(false)
                           }}
                        >
                           <View style={styles.branchInfo}>
                              <Text style={styles.branchName}>{branch.name}</Text>
                              <Text style={styles.branchAddress}>{branch.address}</Text>
                           </View>
                           <View style={[
                              styles.branchStatus,
                              { backgroundColor: branch.isActive ? '#4CAF50' : '#FF5722' }
                           ]}>
                              <Text style={styles.branchStatusText}>
                                 {branch.isActive ? 'Active' : 'Inactive'}
                              </Text>
                           </View>
                        </TouchableOpacity>
                     ))}
                  </ScrollView>
               </View>
            </View>
         )}
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#f8f9fa',
   },
   header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
   },
   backButton: {
      padding: 5,
   },
   headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#333',
   },
   headerRight: {
      width: 34, // Same width as back button for centering
   },
   content: {
      flex: 1,
   },
   section: {
      backgroundColor: '#fff',
      marginVertical: 8,
      paddingHorizontal: 20,
      paddingVertical: 16,
   },
   sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      marginBottom: 16,
   },
   inputGroup: {
      marginBottom: 16,
   },
   inputLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: '#333',
      marginBottom: 8,
   },
   input: {
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: '#fff',
   },
   branchSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderRadius: 8,
      padding: 12,
      backgroundColor: '#fff',
   },
   branchSelectorText: {
      fontSize: 16,
      color: '#333',
   },
   placeholder: {
      color: '#999',
   },
   summaryItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
   },
   summaryItemInfo: {
      flex: 1,
      marginRight: 12,
   },
   summaryItemName: {
      fontSize: 14,
      fontWeight: '500',
      color: '#333',
   },
   summaryItemNotes: {
      fontSize: 12,
      color: '#666',
      marginTop: 2,
      fontStyle: 'italic',
   },
   summaryItemPrice: {
      fontSize: 14,
      fontWeight: '600',
      color: '#333',
   },
   summaryTotal: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 12,
      marginTop: 8,
      borderTopWidth: 2,
      borderTopColor: '#e0e0e0',
   },
   summaryTotalLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
   },
   summaryTotalAmount: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#007AFF',
   },
   footer: {
      flexDirection: 'row',
      padding: 20,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#e0e0e0',
      gap: 10,
   },
   draftButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      gap: 6,
      flex: 1,
      justifyContent: 'center',
   },
   draftButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#666',
   },
   proceedButton: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#007AFF',
      borderRadius: 8,
      paddingVertical: 15,
      gap: 10,
      flex: 2,
   },
   proceedButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
   },
   modalOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
   },
   modalContent: {
      backgroundColor: '#fff',
      borderRadius: 12,
      width: '90%',
      maxHeight: '70%',
   },
   modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
   },
   modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#333',
   },
   branchList: {
      maxHeight: 300,
   },
   branchItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
   },
   selectedBranchItem: {
      backgroundColor: '#f0f8ff',
   },
   branchInfo: {
      flex: 1,
   },
   branchName: {
      fontSize: 16,
      fontWeight: '500',
      color: '#333',
   },
   branchAddress: {
      fontSize: 14,
      color: '#666',
      marginTop: 2,
   },
   branchStatus: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
   },
   branchStatusText: {
      fontSize: 12,
      fontWeight: '500',
      color: '#fff',
   },
})
