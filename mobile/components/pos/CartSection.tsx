import React from 'react'
import {
   View,
   Text,
   TouchableOpacity,
   ScrollView,
   StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { CartItem } from '../../app/(app)/create-order'

interface CartSectionProps {
   cartItems: CartItem[]
   onUpdateQuantity: (index: number, quantity: number) => void
   onRemoveItem: (index: number) => void
   onCheckout: () => void
   formatPrice: (amount: number) => string
   total: number
}

export default function CartSection({
   cartItems,
   onUpdateQuantity,
   onRemoveItem,
   onCheckout,
   formatPrice,
   total,
}: CartSectionProps) {
   return (
      <View style={styles.container}>
         <Text style={styles.title}>Cart ({cartItems.length})</Text>
         
         <ScrollView style={styles.cartItems} showsVerticalScrollIndicator={false}>
            {cartItems.map((item, index) => (
               <View key={index} style={styles.cartItem}>
                  <View style={styles.cartItemInfo}>
                     <Text style={styles.cartItemName} numberOfLines={1}>
                        {item.menuItem.name}
                     </Text>
                     <Text style={styles.cartItemPrice}>{formatPrice(item.menuItem.price)}</Text>
                     {item.notes && (
                        <Text style={styles.cartItemNotes} numberOfLines={1}>
                           Note: {item.notes}
                        </Text>
                     )}
                  </View>
                  
                  <View style={styles.cartItemActions}>
                     <View style={styles.quantityControls}>
                        <TouchableOpacity
                           style={styles.quantityButton}
                           onPress={() => onUpdateQuantity(index, item.quantity - 1)}
                        >
                           <Ionicons name="remove" size={16} color="#666" />
                        </TouchableOpacity>
                        
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                        
                        <TouchableOpacity
                           style={styles.quantityButton}
                           onPress={() => onUpdateQuantity(index, item.quantity + 1)}
                        >
                           <Ionicons name="add" size={16} color="#666" />
                        </TouchableOpacity>
                     </View>
                     
                     <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => onRemoveItem(index)}
                     >
                        <Ionicons name="trash" size={16} color="#ff4444" />
                     </TouchableOpacity>
                  </View>
               </View>
            ))}
         </ScrollView>

         {cartItems.length === 0 && (
            <View style={styles.emptyCart}>
               <Ionicons name="cart-outline" size={48} color="#ccc" />
               <Text style={styles.emptyCartText}>Cart is empty</Text>
               <Text style={styles.emptyCartSubtext}>Add items from the menu</Text>
            </View>
         )}

         {cartItems.length > 0 && (
            <View style={styles.cartFooter}>
               <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalAmount}>{formatPrice(total)}</Text>
               </View>
               
               <TouchableOpacity style={styles.checkoutButton} onPress={onCheckout}>
                  <Text style={styles.checkoutButtonText}>Checkout</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
               </TouchableOpacity>
            </View>
         )}
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      width: '35%',
      backgroundColor: '#f8f9fa',
      borderLeftWidth: 1,
      borderLeftColor: '#e0e0e0',
   },
   title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      padding: 20,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
   },
   cartItems: {
      flex: 1,
      paddingHorizontal: 15,
   },
   cartItem: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 12,
      marginVertical: 5,
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
   },
   cartItemInfo: {
      marginBottom: 8,
   },
   cartItemName: {
      fontSize: 14,
      fontWeight: '600',
      color: '#333',
      marginBottom: 2,
   },
   cartItemPrice: {
      fontSize: 12,
      color: '#007AFF',
      fontWeight: '500',
   },
   cartItemNotes: {
      fontSize: 11,
      color: '#666',
      fontStyle: 'italic',
      marginTop: 2,
   },
   cartItemActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
   },
   quantityControls: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      borderRadius: 15,
      paddingHorizontal: 5,
   },
   quantityButton: {
      padding: 8,
   },
   quantityText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#333',
      minWidth: 25,
      textAlign: 'center',
   },
   removeButton: {
      padding: 8,
   },
   emptyCart: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 50,
   },
   emptyCartText: {
      marginTop: 10,
      fontSize: 16,
      color: '#999',
      fontWeight: '500',
   },
   emptyCartSubtext: {
      marginTop: 5,
      fontSize: 14,
      color: '#ccc',
   },
   cartFooter: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: '#e0e0e0',
      backgroundColor: '#fff',
   },
   totalContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
   },
   totalLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
   },
   totalAmount: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#007AFF',
   },
   checkoutButton: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#007AFF',
      borderRadius: 8,
      paddingVertical: 12,
      gap: 8,
   },
   checkoutButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
   },
})
