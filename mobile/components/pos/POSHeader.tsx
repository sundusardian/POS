import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface POSHeaderProps {
   onBack: () => void
   cartItemCount: number
   onCartPress: () => void
}

export default function POSHeader({ onBack, cartItemCount, onCartPress }: POSHeaderProps) {
   return (
      <View style={styles.header}>
         <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#333" />
         </TouchableOpacity>
         
         <Text style={styles.title}>POS - Create Order</Text>
         
         <TouchableOpacity style={styles.cartButton} onPress={onCartPress}>
            <Ionicons name="cart" size={24} color="#007AFF" />
            {cartItemCount > 0 && (
               <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
               </View>
            )}
         </TouchableOpacity>
      </View>
   )
}

const styles = StyleSheet.create({
   header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
   },
   backButton: {
      padding: 8,
   },
   title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      flex: 1,
      textAlign: 'center',
   },
   cartButton: {
      padding: 8,
      position: 'relative',
   },
   cartBadge: {
      position: 'absolute',
      top: 4,
      right: 4,
      backgroundColor: '#ff4444',
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
   },
   cartBadgeText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
   },
})
