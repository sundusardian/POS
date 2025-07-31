import React, { useState, useEffect } from 'react'
import {
   View,
   Text,
   Modal,
   TouchableOpacity,
   TextInput,
   StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { MenuItem } from '../../lib/api/types'
import { CartItem } from '../../app/(app)/create-order'

interface ItemModalProps {
   visible: boolean
   menuItem: MenuItem | null
   onClose: () => void
   onAddToCart: (item: CartItem) => void
   formatPrice: (amount: number) => string
}

export default function ItemModal({
   visible,
   menuItem,
   onClose,
   onAddToCart,
   formatPrice,
}: ItemModalProps) {
   const [quantity, setQuantity] = useState(1)
   const [notes, setNotes] = useState('')

   useEffect(() => {
      if (visible) {
         setQuantity(1)
         setNotes('')
      }
   }, [visible])

   const handleAddToCart = () => {
      if (!menuItem) return

      const cartItem: CartItem = {
         menuItem,
         quantity,
         notes: notes.trim() || undefined,
      }

      onAddToCart(cartItem)
      onClose()
   }

   if (!menuItem) return null

   return (
      <Modal visible={visible} animationType="slide" transparent={true}>
         <View style={styles.overlay}>
            <View style={styles.modal}>
               <View style={styles.header}>
                  <Text style={styles.title}>{menuItem.name}</Text>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                     <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
               </View>

               <View style={styles.content}>
                  <Text style={styles.description}>{menuItem.description}</Text>
                  <Text style={styles.price}>{formatPrice(menuItem.price)}</Text>

                  <View style={styles.quantitySection}>
                     <Text style={styles.sectionLabel}>Quantity:</Text>
                     <View style={styles.quantityControls}>
                        <TouchableOpacity
                           style={styles.quantityButton}
                           onPress={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                           <Ionicons name="remove" size={20} color="#666" />
                        </TouchableOpacity>
                        
                        <Text style={styles.quantityValue}>{quantity}</Text>
                        
                        <TouchableOpacity
                           style={styles.quantityButton}
                           onPress={() => setQuantity(quantity + 1)}
                        >
                           <Ionicons name="add" size={20} color="#666" />
                        </TouchableOpacity>
                     </View>
                  </View>

                  <View style={styles.notesSection}>
                     <Text style={styles.sectionLabel}>Special Notes:</Text>
                     <TextInput
                        style={styles.notesInput}
                        placeholder="Add special instructions..."
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                        numberOfLines={3}
                        placeholderTextColor="#999"
                     />
                  </View>
               </View>

               <View style={styles.footer}>
                  <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
                     <Text style={styles.addButtonText}>
                        Add to Cart - {formatPrice(menuItem.price * quantity)}
                     </Text>
                  </TouchableOpacity>
               </View>
            </View>
         </View>
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
      flex: 1,
   },
   closeButton: {
      padding: 5,
   },
   content: {
      padding: 20,
   },
   description: {
      fontSize: 16,
      color: '#666',
      lineHeight: 22,
      marginBottom: 15,
   },
   price: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#007AFF',
      marginBottom: 25,
   },
   quantitySection: {
      marginBottom: 20,
   },
   sectionLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      marginBottom: 10,
   },
   quantityControls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      borderRadius: 25,
      paddingHorizontal: 20,
      paddingVertical: 10,
   },
   quantityButton: {
      padding: 10,
   },
   quantityValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginHorizontal: 20,
      minWidth: 30,
      textAlign: 'center',
   },
   notesSection: {
      marginBottom: 10,
   },
   notesInput: {
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: '#333',
      textAlignVertical: 'top',
      minHeight: 80,
   },
   footer: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: '#f0f0f0',
   },
   addButton: {
      backgroundColor: '#007AFF',
      borderRadius: 8,
      paddingVertical: 15,
      alignItems: 'center',
   },
   addButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
   },
})
