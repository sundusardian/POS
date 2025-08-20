import React, { useState, useEffect } from 'react'
import {
   View,
   Text,
   Modal,
   TouchableOpacity,
   TextInput,
   ScrollView,
   ActivityIndicator,
   Alert,
   StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Branch } from '../../lib/api/types'
import { CartItem } from '../../app/(app)/create-order'
import { DraftOrderStorage } from '../../lib/storage/draft-storage'
import PaymentModal from './PaymentModal'
import BranchModal from './BranchModal'

interface CheckoutModalProps {
   visible: boolean
   cartItems: CartItem[]
   branches: Branch[]
   defaultBranch?: Branch | null
   total: number
   isSubmitting: boolean
   onClose: () => void
   onSubmit: (orderData: {
      customerName: string
      customerPhone?: string
      branchId: string
      deskNumber?: string
      paymentMethod?: 'cash' | 'cashless'
      receivedAmount?: number
      changeAmount?: number
   }) => void
   formatPrice: (amount: number) => string
}

export default function CheckoutModal({
   visible,
   cartItems,
   branches,
   defaultBranch,
   total,
   isSubmitting,
   onClose,
   onSubmit,
   formatPrice,
}: CheckoutModalProps) {
   const [customerName, setCustomerName] = useState('')
   const [customerPhone, setCustomerPhone] = useState('')
   const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
   const [deskNumber, setDeskNumber] = useState('')
   const [showPaymentModal, setShowPaymentModal] = useState(false)
   const [showBranchModal, setShowBranchModal] = useState(false)

   useEffect(() => {
      if (visible) {
         setCustomerName('')
         setCustomerPhone('')
         // Set user's primary branch as default, or null if not available
         setSelectedBranch(defaultBranch || null)
         setDeskNumber('')
      }
   }, [visible, defaultBranch])

   const handleSubmit = () => {
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

      // Show payment modal instead of directly submitting
      setShowPaymentModal(true)
   }

   const handlePaymentComplete = (paymentData: {
      method: 'cash' | 'cashless'
      receivedAmount?: number
      changeAmount?: number
   }) => {
      onSubmit({
         customerName: customerName.trim(),
         customerPhone: customerPhone.trim() || undefined,
         branchId: selectedBranch!.id,
         deskNumber: deskNumber.trim() || undefined,
         paymentMethod: paymentData.method,
         receivedAmount: paymentData.receivedAmount,
         changeAmount: paymentData.changeAmount,
      })
      setShowPaymentModal(false)
   }

   const handleSaveDraft = async () => {
      if (!selectedBranch) {
         Alert.alert('Error', 'Please select a branch')
         return
      }
      if (cartItems.length === 0) {
         Alert.alert('Error', 'Cart is empty')
         return
      }

      try {
         await DraftOrderStorage.saveDraftOrder({
            customerName: customerName.trim() || 'Draft Order',
            customerPhone: customerPhone.trim() || undefined,
            branchId: selectedBranch.id,
            branchName: selectedBranch.name,
            deskNumber: deskNumber.trim() || undefined,
            items: cartItems,
            totalAmount: total,
         })
         
         Alert.alert('Success', 'Draft order saved successfully!')
         onClose()
      } catch (err) {
         console.error('Failed to save draft:', err)
         Alert.alert('Error', 'Failed to save draft order')
      }
   }

   const showBranchSelector = () => {
      setShowBranchModal(true)
   }

   return (
      <Modal visible={visible} animationType="slide" transparent={true}>
         <View style={styles.overlay}>
            <View style={styles.modal}>
               <View style={styles.header}>
                  <Text style={styles.title}>Checkout</Text>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                     <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
               </View>

               <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                  {/* Customer Information */}
                  <View style={styles.section}>
                     <Text style={styles.sectionTitle}>Customer Information</Text>
                     <TextInput
                        style={styles.input}
                        placeholder="Customer Name *"
                        value={customerName}
                        onChangeText={setCustomerName}
                        placeholderTextColor="#999"
                     />
                     <TextInput
                        style={styles.input}
                        placeholder="Phone Number (optional)"
                        value={customerPhone}
                        onChangeText={setCustomerPhone}
                        keyboardType="phone-pad"
                        placeholderTextColor="#999"
                     />
                  </View>

                  {/* Location */}
                  <View style={styles.section}>
                     <Text style={styles.sectionTitle}>Location</Text>
                     <TouchableOpacity
                        style={styles.branchSelector}
                        onPress={showBranchSelector}
                     >
                        <Text style={selectedBranch ? styles.branchSelected : styles.branchPlaceholder}>
                           {selectedBranch ? selectedBranch.name : 'Select Branch *'}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color="#666" />
                     </TouchableOpacity>
                     <TextInput
                        style={styles.input}
                        placeholder="Table/Desk Number (optional)"
                        value={deskNumber}
                        onChangeText={setDeskNumber}
                        placeholderTextColor="#999"
                     />
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

               <View style={styles.footer}>
                  <View style={styles.footerButtons}>
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
                           styles.submitButton,
                           {
                              opacity: (!customerName.trim() || !selectedBranch || cartItems.length === 0 || isSubmitting) ? 0.5 : 1
                           }
                        ]}
                        onPress={handleSubmit}
                        disabled={!customerName.trim() || !selectedBranch || cartItems.length === 0 || isSubmitting}
                     >
                        {isSubmitting ? (
                           <ActivityIndicator color="white" />
                        ) : (
                           <>
                              <Text style={styles.submitButtonText}>
                                 Place Order - {formatPrice(total)}
                              </Text>
                              <Ionicons name="checkmark" size={20} color="#fff" />
                           </>
                        )}
                     </TouchableOpacity>
                  </View>
               </View>
            </View>
         </View>

         <PaymentModal
            visible={showPaymentModal}
            total={total}
            onClose={() => setShowPaymentModal(false)}
            onPaymentComplete={handlePaymentComplete}
            formatPrice={formatPrice}
         />

         <BranchModal
            visible={showBranchModal}
            branches={branches}
            selectedBranch={selectedBranch}
            onClose={() => setShowBranchModal(false)}
            onSelectBranch={setSelectedBranch}
         />
      </Modal>
   )
}

const styles = StyleSheet.create({
   overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
   },
   modal: {
      backgroundColor: '#fff',
      borderRadius: 15,
      width: '100%',
      maxWidth: 500,
      maxHeight: '90%',
   },
   header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
   },
   title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
   },
   closeButton: {
      padding: 5,
   },
   content: {
      maxHeight: 400,
   },
   section: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#f5f5f5',
   },
   sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      marginBottom: 15,
   },
   input: {
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: '#333',
      marginBottom: 10,
   },
   branchSelector: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderRadius: 8,
      padding: 12,
      marginBottom: 10,
   },
   branchSelected: {
      fontSize: 16,
      color: '#333',
   },
   branchPlaceholder: {
      fontSize: 16,
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
      marginRight: 10,
   },
   summaryItemName: {
      fontSize: 14,
      fontWeight: '500',
      color: '#333',
   },
   summaryItemNotes: {
      fontSize: 12,
      color: '#666',
      fontStyle: 'italic',
      marginTop: 2,
   },
   summaryItemPrice: {
      fontSize: 14,
      fontWeight: '600',
      color: '#007AFF',
   },
   summaryTotal: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 15,
      marginTop: 10,
      borderTopWidth: 2,
      borderTopColor: '#007AFF',
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
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: '#f0f0f0',
   },
   footerButtons: {
      flexDirection: 'row',
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
   submitButton: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#007AFF',
      borderRadius: 8,
      paddingVertical: 15,
      gap: 10,
      flex: 2,
   },
   submitButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
   },
})
