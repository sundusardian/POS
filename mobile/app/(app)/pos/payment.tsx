import React, { useState } from 'react'
import {
   View,
   Text,
   StyleSheet,
   ScrollView,
   TouchableOpacity,
   TextInput,
   Alert,
   ActivityIndicator,
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { apiClient } from '../../../lib/api'
import { CreateOrderDto, CreateOrderItemDto } from '../../../lib/api/order-client'
import { CartItem } from './menu'

export default function POSPaymentScreen() {
   const params = useLocalSearchParams()
   
   // Parse order data from params
   const customerName = params.customerName as string
   const customerPhone = params.customerPhone as string | undefined
   const branchId = params.branchId as string
   const branchName = params.branchName as string
   const deskNumber = params.deskNumber as string | undefined
   const cartItems: CartItem[] = params.cartData ? JSON.parse(params.cartData as string) : []
   const totalAmount = parseFloat(params.totalAmount as string)

   // Payment states
   const [paymentMethod, setPaymentMethod] = useState<'cash' | 'cashless' | null>(null)
   const [receivedAmount, setReceivedAmount] = useState('')
   const [isProcessing, setIsProcessing] = useState(false)
   const [showCashlessModal, setShowCashlessModal] = useState(false)

   const formatPrice = (price: number) => {
      return new Intl.NumberFormat('id-ID', {
         style: 'currency',
         currency: 'IDR',
         minimumFractionDigits: 0,
      }).format(price)
   }

   const calculateChange = () => {
      const received = parseFloat(receivedAmount) || 0
      return Math.max(0, received - totalAmount)
   }

   const handleCashPayment = async () => {
      const received = parseFloat(receivedAmount) || 0
      
      if (received < totalAmount) {
         Alert.alert('Error', 'Received amount must be greater than or equal to total amount')
         return
      }

      await processOrder('cash', received, calculateChange())
   }

   const handleCashlessPayment = () => {
      setShowCashlessModal(true)
   }

   const processCashlessPayment = async () => {
      setShowCashlessModal(false)
      
      // Simulate cashless payment processing
      setIsProcessing(true)
      
      setTimeout(async () => {
         setIsProcessing(false)
         await processOrder('cashless')
      }, 2000)
   }

   const processOrder = async (method: 'cash' | 'cashless', received?: number, change?: number) => {
      try {
         setIsProcessing(true)

         const createOrderDto: CreateOrderDto = {
            customerName: customerName.trim(),
            customerPhone: customerPhone?.trim() || undefined,
            branchId: branchId,
            deskId: deskNumber?.trim() || undefined,
            items: cartItems.map(
               (item): CreateOrderItemDto => ({
                  menuItemId: item.menuItem.id,
                  quantity: item.quantity,
                  notes: item.notes,
               })
            ),
         }

         const order = await apiClient.orders.createOrder(createOrderDto)

         // Print receipt with payment data
         try {
            await apiClient.orders.printReceipt(order.id, {
               paymentMethod: method,
               receivedAmount: received,
               changeAmount: change,
            })
         } catch (printError) {
            console.warn('Failed to print receipt:', printError)
            // Don't fail the order creation if printing fails
         }

         // Create success message with queue number
         let successMessage = `Order #${order.orderNumber} has been created successfully.`
         
         if (order.queueNumber) {
            successMessage += `\n\nQueue Number: ${order.queueNumber}`
         }
         
         if (method === 'cash' && change) {
            successMessage += `\n\nChange: ${formatPrice(change)}`
         }

         Alert.alert(
            'Order Successful!', 
            successMessage,
            [
               {
                  text: 'OK',
                  onPress: () => {
                     // Navigate back to menu screen and clear cart
                     router.dismissAll()
                     router.replace('/(app)/pos/menu')
                  }
               }
            ]
         )
      } catch (error) {
         console.error('Failed to create order:', error)
         Alert.alert('Error', 'Failed to create order. Please try again.')
      } finally {
         setIsProcessing(false)
      }
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
            <Text style={styles.headerTitle}>Payment</Text>
            <View style={styles.headerRight} />
         </View>

         <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Order Summary */}
            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Order Summary</Text>
               
               <View style={styles.orderInfo}>
                  <View style={styles.orderRow}>
                     <Text style={styles.orderLabel}>Customer:</Text>
                     <Text style={styles.orderValue}>{customerName}</Text>
                  </View>
                  
                  <View style={styles.orderRow}>
                     <Text style={styles.orderLabel}>Branch:</Text>
                     <Text style={styles.orderValue}>{branchName}</Text>
                  </View>
                  
                  {deskNumber && (
                     <View style={styles.orderRow}>
                        <Text style={styles.orderLabel}>Table:</Text>
                        <Text style={styles.orderValue}>{deskNumber}</Text>
                     </View>
                  )}
                  
                  <View style={styles.orderRow}>
                     <Text style={styles.orderLabel}>Items:</Text>
                     <Text style={styles.orderValue}>{cartItems.length} items</Text>
                  </View>
               </View>

               <View style={styles.totalSection}>
                  <Text style={styles.totalLabel}>Total Amount:</Text>
                  <Text style={styles.totalAmount}>{formatPrice(totalAmount)}</Text>
               </View>
            </View>

            {/* Payment Method Selection */}
            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Payment Method</Text>
               
               <View style={styles.paymentMethods}>
                  <TouchableOpacity
                     style={[
                        styles.paymentMethodButton,
                        paymentMethod === 'cash' && styles.selectedPaymentMethod
                     ]}
                     onPress={() => setPaymentMethod('cash')}
                  >
                     <Ionicons 
                        name="cash" 
                        size={24} 
                        color={paymentMethod === 'cash' ? '#007AFF' : '#666'} 
                     />
                     <Text style={[
                        styles.paymentMethodText,
                        paymentMethod === 'cash' && styles.selectedPaymentMethodText
                     ]}>
                        Cash
                     </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                     style={[
                        styles.paymentMethodButton,
                        paymentMethod === 'cashless' && styles.selectedPaymentMethod
                     ]}
                     onPress={() => setPaymentMethod('cashless')}
                  >
                     <Ionicons 
                        name="card" 
                        size={24} 
                        color={paymentMethod === 'cashless' ? '#007AFF' : '#666'} 
                     />
                     <Text style={[
                        styles.paymentMethodText,
                        paymentMethod === 'cashless' && styles.selectedPaymentMethodText
                     ]}>
                        Cashless
                     </Text>
                  </TouchableOpacity>
               </View>
            </View>

            {/* Cash Payment Details */}
            {paymentMethod === 'cash' && (
               <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Cash Payment</Text>
                  
                  <View style={styles.inputGroup}>
                     <Text style={styles.inputLabel}>Amount Received</Text>
                     <TextInput
                        style={styles.input}
                        value={receivedAmount}
                        onChangeText={setReceivedAmount}
                        placeholder="Enter received amount"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                     />
                  </View>

                  {receivedAmount && (
                     <View style={styles.changeSection}>
                        <View style={styles.changeRow}>
                           <Text style={styles.changeLabel}>Total:</Text>
                           <Text style={styles.changeValue}>{formatPrice(totalAmount)}</Text>
                        </View>
                        <View style={styles.changeRow}>
                           <Text style={styles.changeLabel}>Received:</Text>
                           <Text style={styles.changeValue}>{formatPrice(parseFloat(receivedAmount) || 0)}</Text>
                        </View>
                        <View style={[styles.changeRow, styles.changeFinal]}>
                           <Text style={styles.changeFinalLabel}>Change:</Text>
                           <Text style={styles.changeFinalValue}>{formatPrice(calculateChange())}</Text>
                        </View>
                     </View>
                  )}
               </View>
            )}
         </ScrollView>

         {/* Payment Action */}
         <View style={styles.footer}>
            {paymentMethod === 'cash' ? (
               <TouchableOpacity
                  style={[
                     styles.payButton,
                     { opacity: (!receivedAmount || parseFloat(receivedAmount) < totalAmount) ? 0.5 : 1 }
                  ]}
                  onPress={handleCashPayment}
                  disabled={!receivedAmount || parseFloat(receivedAmount) < totalAmount || isProcessing}
               >
                  {isProcessing ? (
                     <ActivityIndicator color="white" />
                  ) : (
                     <>
                        <Text style={styles.payButtonText}>Complete Cash Payment</Text>
                        <Ionicons name="checkmark" size={20} color="#fff" />
                     </>
                  )}
               </TouchableOpacity>
            ) : paymentMethod === 'cashless' ? (
               <TouchableOpacity
                  style={styles.payButton}
                  onPress={handleCashlessPayment}
                  disabled={isProcessing}
               >
                  {isProcessing ? (
                     <ActivityIndicator color="white" />
                  ) : (
                     <>
                        <Text style={styles.payButtonText}>Process Cashless Payment</Text>
                        <Ionicons name="card" size={20} color="#fff" />
                     </>
                  )}
               </TouchableOpacity>
            ) : (
               <View style={styles.selectPaymentHint}>
                  <Text style={styles.selectPaymentText}>Please select a payment method</Text>
               </View>
            )}
         </View>

         {/* Cashless Payment Modal */}
         {showCashlessModal && (
            <View style={styles.modalOverlay}>
               <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                     <Text style={styles.modalTitle}>Cashless Payment</Text>
                  </View>
                  
                  <View style={styles.modalBody}>
                     <Ionicons name="card" size={64} color="#007AFF" />
                     <Text style={styles.modalText}>
                        Please process the cashless payment using your card reader or mobile payment terminal.
                     </Text>
                     <Text style={styles.modalAmount}>{formatPrice(totalAmount)}</Text>
                  </View>

                  <View style={styles.modalActions}>
                     <TouchableOpacity
                        style={styles.modalCancelButton}
                        onPress={() => setShowCashlessModal(false)}
                     >
                        <Text style={styles.modalCancelText}>Cancel</Text>
                     </TouchableOpacity>
                     
                     <TouchableOpacity
                        style={styles.modalConfirmButton}
                        onPress={processCashlessPayment}
                     >
                        <Text style={styles.modalConfirmText}>Payment Completed</Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </View>
         )}

         {/* Processing Overlay */}
         {isProcessing && (
            <View style={styles.processingOverlay}>
               <View style={styles.processingContent}>
                  <ActivityIndicator size="large" color="#007AFF" />
                  <Text style={styles.processingText}>Processing order...</Text>
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
      width: 34,
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
   orderInfo: {
      marginBottom: 16,
   },
   orderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 4,
   },
   orderLabel: {
      fontSize: 14,
      color: '#666',
   },
   orderValue: {
      fontSize: 14,
      fontWeight: '500',
      color: '#333',
   },
   totalSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: '#e0e0e0',
   },
   totalLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
   },
   totalAmount: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#007AFF',
   },
   paymentMethods: {
      flexDirection: 'row',
      gap: 12,
   },
   paymentMethodButton: {
      flex: 1,
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#e0e0e0',
      backgroundColor: '#f8f9fa',
   },
   selectedPaymentMethod: {
      borderColor: '#007AFF',
      backgroundColor: '#f0f8ff',
   },
   paymentMethodText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#666',
      marginTop: 8,
   },
   selectedPaymentMethodText: {
      color: '#007AFF',
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
   changeSection: {
      backgroundColor: '#f8f9fa',
      borderRadius: 8,
      padding: 16,
   },
   changeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 4,
   },
   changeFinal: {
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: '#e0e0e0',
      marginTop: 8,
   },
   changeLabel: {
      fontSize: 14,
      color: '#666',
   },
   changeValue: {
      fontSize: 14,
      fontWeight: '500',
      color: '#333',
   },
   changeFinalLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
   },
   changeFinalValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#4CAF50',
   },
   footer: {
      padding: 20,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#e0e0e0',
   },
   payButton: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#007AFF',
      borderRadius: 8,
      paddingVertical: 15,
      gap: 10,
   },
   payButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
   },
   selectPaymentHint: {
      alignItems: 'center',
      paddingVertical: 15,
   },
   selectPaymentText: {
      fontSize: 16,
      color: '#666',
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
      maxWidth: 400,
   },
   modalHeader: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
   },
   modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#333',
      textAlign: 'center',
   },
   modalBody: {
      alignItems: 'center',
      padding: 30,
   },
   modalText: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginTop: 16,
      marginBottom: 20,
      lineHeight: 24,
   },
   modalAmount: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#007AFF',
   },
   modalActions: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: '#e0e0e0',
   },
   modalCancelButton: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 16,
      borderRightWidth: 1,
      borderRightColor: '#e0e0e0',
   },
   modalCancelText: {
      fontSize: 16,
      color: '#666',
   },
   modalConfirmButton: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 16,
   },
   modalConfirmText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#007AFF',
   },
   processingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
   },
   processingContent: {
      alignItems: 'center',
   },
   processingText: {
      fontSize: 16,
      color: '#fff',
      marginTop: 16,
   },
})
