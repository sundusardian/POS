import React, { useState } from 'react'
import {
   View,
   Text,
   Modal,
   TouchableOpacity,
   TextInput,
   StyleSheet,
   Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface PaymentModalProps {
   visible: boolean
   total: number
   onClose: () => void
   onPaymentComplete: (paymentData: {
      method: 'cash' | 'cashless'
      receivedAmount?: number
      changeAmount?: number
   }) => void
   formatPrice: (amount: number) => string
}

export default function PaymentModal({
   visible,
   total,
   onClose,
   onPaymentComplete,
   formatPrice,
}: PaymentModalProps) {
   const [paymentMethod, setPaymentMethod] = useState<'cash' | 'cashless' | null>(null)
   const [receivedAmount, setReceivedAmount] = useState('')
   const [showCashlessModal, setShowCashlessModal] = useState(false)

   const handleCashPayment = () => {
      const received = parseFloat(receivedAmount)
      if (isNaN(received) || received < total) {
         Alert.alert('Error', 'Received amount must be greater than or equal to total')
         return
      }

      const change = received - total
      onPaymentComplete({
         method: 'cash',
         receivedAmount: received,
         changeAmount: change,
      })
      resetModal()
   }

   const handleCashlessPayment = () => {
      setShowCashlessModal(true)
   }

   const completeCashlessPayment = () => {
      onPaymentComplete({
         method: 'cashless',
      })
      setShowCashlessModal(false)
      resetModal()
   }

   const resetModal = () => {
      setPaymentMethod(null)
      setReceivedAmount('')
      setShowCashlessModal(false)
   }

   const handleClose = () => {
      resetModal()
      onClose()
   }

   return (
      <>
         <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.overlay}>
               <View style={styles.modal}>
                  <View style={styles.header}>
                     <Text style={styles.title}>Payment</Text>
                     <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="#333" />
                     </TouchableOpacity>
                  </View>

                  <View style={styles.content}>
                     <View style={styles.totalSection}>
                        <Text style={styles.totalLabel}>Total Amount:</Text>
                        <Text style={styles.totalAmount}>{formatPrice(total)}</Text>
                     </View>

                     {!paymentMethod && (
                        <View style={styles.methodSelection}>
                           <Text style={styles.sectionTitle}>Select Payment Method</Text>
                           
                           <TouchableOpacity
                              style={styles.methodButton}
                              onPress={() => setPaymentMethod('cash')}
                           >
                              <Ionicons name="cash" size={24} color="#4CAF50" />
                              <Text style={styles.methodText}>Cash</Text>
                              <Ionicons name="chevron-forward" size={20} color="#666" />
                           </TouchableOpacity>

                           <TouchableOpacity
                              style={styles.methodButton}
                              onPress={() => setPaymentMethod('cashless')}
                           >
                              <Ionicons name="card" size={24} color="#2196F3" />
                              <Text style={styles.methodText}>Cashless (Card/Digital)</Text>
                              <Ionicons name="chevron-forward" size={20} color="#666" />
                           </TouchableOpacity>
                        </View>
                     )}

                     {paymentMethod === 'cash' && (
                        <View style={styles.cashPayment}>
                           <TouchableOpacity
                              style={styles.backButton}
                              onPress={() => setPaymentMethod(null)}
                           >
                              <Ionicons name="arrow-back" size={20} color="#666" />
                              <Text style={styles.backText}>Back to methods</Text>
                           </TouchableOpacity>

                           <Text style={styles.sectionTitle}>Cash Payment</Text>
                           
                           <View style={styles.inputSection}>
                              <Text style={styles.inputLabel}>Received Amount:</Text>
                              <TextInput
                                 style={styles.amountInput}
                                 placeholder="0"
                                 value={receivedAmount}
                                 onChangeText={setReceivedAmount}
                                 keyboardType="numeric"
                                 autoFocus
                              />
                           </View>

                           {receivedAmount && !isNaN(parseFloat(receivedAmount)) && (
                              <View style={styles.changeSection}>
                                 <Text style={styles.changeLabel}>Change:</Text>
                                 <Text style={[
                                    styles.changeAmount,
                                    { color: parseFloat(receivedAmount) >= total ? '#4CAF50' : '#FF5722' }
                                 ]}>
                                    {formatPrice(Math.max(0, parseFloat(receivedAmount) - total))}
                                 </Text>
                              </View>
                           )}

                           <TouchableOpacity
                              style={[
                                 styles.completeButton,
                                 {
                                    opacity: (!receivedAmount || parseFloat(receivedAmount) < total) ? 0.5 : 1
                                 }
                              ]}
                              onPress={handleCashPayment}
                              disabled={!receivedAmount || parseFloat(receivedAmount) < total}
                           >
                              <Text style={styles.completeButtonText}>Complete Payment</Text>
                           </TouchableOpacity>
                        </View>
                     )}

                     {paymentMethod === 'cashless' && (
                        <View style={styles.cashlessPayment}>
                           <TouchableOpacity
                              style={styles.backButton}
                              onPress={() => setPaymentMethod(null)}
                           >
                              <Ionicons name="arrow-back" size={20} color="#666" />
                              <Text style={styles.backText}>Back to methods</Text>
                           </TouchableOpacity>

                           <Text style={styles.sectionTitle}>Cashless Payment</Text>
                           <Text style={styles.cashlessInfo}>
                              Process payment through card reader or digital payment system
                           </Text>

                           <TouchableOpacity
                              style={styles.completeButton}
                              onPress={handleCashlessPayment}
                           >
                              <Text style={styles.completeButtonText}>Process Cashless Payment</Text>
                           </TouchableOpacity>
                        </View>
                     )}
                  </View>
               </View>
            </View>
         </Modal>

         {/* Cashless Payment Processing Modal */}
         <Modal visible={showCashlessModal} animationType="fade" transparent={true}>
            <View style={styles.overlay}>
               <View style={styles.cashlessModal}>
                  <Ionicons name="card" size={48} color="#2196F3" />
                  <Text style={styles.cashlessTitle}>Processing Payment</Text>
                  <Text style={styles.cashlessSubtitle}>
                     Please complete the payment on the card reader or digital payment device
                  </Text>
                  <Text style={styles.cashlessAmount}>{formatPrice(total)}</Text>
                  
                  <View style={styles.cashlessButtons}>
                     <TouchableOpacity
                        style={styles.cancelCashlessButton}
                        onPress={() => setShowCashlessModal(false)}
                     >
                        <Text style={styles.cancelCashlessText}>Cancel</Text>
                     </TouchableOpacity>
                     
                     <TouchableOpacity
                        style={styles.confirmCashlessButton}
                        onPress={completeCashlessPayment}
                     >
                        <Text style={styles.confirmCashlessText}>Payment Completed</Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </View>
         </Modal>
      </>
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
      maxWidth: 400,
      maxHeight: '80%',
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
      padding: 20,
   },
   totalSection: {
      alignItems: 'center',
      marginBottom: 30,
      padding: 20,
      backgroundColor: '#f8f9fa',
      borderRadius: 10,
   },
   totalLabel: {
      fontSize: 16,
      color: '#666',
      marginBottom: 5,
   },
   totalAmount: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#007AFF',
   },
   methodSelection: {
      marginBottom: 20,
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#333',
      marginBottom: 15,
   },
   methodButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      backgroundColor: '#f8f9fa',
      borderRadius: 10,
      marginBottom: 10,
   },
   methodText: {
      flex: 1,
      fontSize: 16,
      color: '#333',
      marginLeft: 15,
   },
   backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
   },
   backText: {
      marginLeft: 5,
      fontSize: 16,
      color: '#666',
   },
   cashPayment: {
      marginBottom: 20,
   },
   inputSection: {
      marginBottom: 20,
   },
   inputLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: '#333',
      marginBottom: 10,
   },
   amountInput: {
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderRadius: 8,
      padding: 15,
      fontSize: 18,
      textAlign: 'center',
   },
   changeSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15,
      backgroundColor: '#f8f9fa',
      borderRadius: 8,
      marginBottom: 20,
   },
   changeLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: '#333',
   },
   changeAmount: {
      fontSize: 18,
      fontWeight: 'bold',
   },
   cashlessPayment: {
      alignItems: 'center',
      marginBottom: 20,
   },
   cashlessInfo: {
      fontSize: 14,
      color: '#666',
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 20,
   },
   completeButton: {
      backgroundColor: '#007AFF',
      borderRadius: 8,
      paddingVertical: 15,
      alignItems: 'center',
      width: '100%',
   },
   completeButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
   },
   cashlessModal: {
      backgroundColor: '#fff',
      borderRadius: 15,
      padding: 30,
      alignItems: 'center',
      width: '90%',
      maxWidth: 350,
   },
   cashlessTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
      marginTop: 15,
      marginBottom: 10,
   },
   cashlessSubtitle: {
      fontSize: 14,
      color: '#666',
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 20,
   },
   cashlessAmount: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#2196F3',
      marginBottom: 30,
   },
   cashlessButtons: {
      flexDirection: 'row',
      gap: 15,
   },
   cancelCashlessButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderRadius: 8,
      alignItems: 'center',
   },
   cancelCashlessText: {
      fontSize: 16,
      color: '#666',
   },
   confirmCashlessButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 20,
      backgroundColor: '#4CAF50',
      borderRadius: 8,
      alignItems: 'center',
   },
   confirmCashlessText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
   },
})
