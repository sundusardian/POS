import React from 'react'
import {
   View,
   Text,
   TextInput,
   TouchableOpacity,
   FlatList,
   ScrollView,
   StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Category, MenuItem } from '../../lib/api/types'

interface MenuSectionProps {
   categories: Category[]
   menuItems: MenuItem[]
   selectedCategory: string | null
   searchQuery: string
   onCategorySelect: (categoryId: string | null) => void
   onSearchChange: (query: string) => void
   onItemPress: (item: MenuItem) => void
   formatPrice: (amount: number) => string
}

export default function MenuSection({
   categories,
   menuItems,
   selectedCategory,
   searchQuery,
   onCategorySelect,
   onSearchChange,
   onItemPress,
   formatPrice,
}: MenuSectionProps) {
   return (
      <View style={styles.container}>
         {/* Search Bar */}
         <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
               style={styles.searchInput}
               placeholder="Search menu items..."
               value={searchQuery}
               onChangeText={onSearchChange}
               placeholderTextColor="#999"
            />
         </View>

         {/* Category Tabs */}
         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryTabs}>
            <TouchableOpacity
               style={[styles.categoryTab, selectedCategory === null && styles.categoryTabActive]}
               onPress={() => onCategorySelect(null)}
            >
               <Text style={[styles.categoryTabText, selectedCategory === null && styles.categoryTabTextActive]}>
                  All
               </Text>
            </TouchableOpacity>
            {categories.map((category) => (
               <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryTab, selectedCategory === category.id && styles.categoryTabActive]}
                  onPress={() => onCategorySelect(category.id)}
               >
                  <Text style={[styles.categoryTabText, selectedCategory === category.id && styles.categoryTabTextActive]}>
                     {category.name}
                  </Text>
               </TouchableOpacity>
            ))}
         </ScrollView>

         {/* Menu Items Grid */}
         <FlatList
            data={menuItems}
            numColumns={2}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.menuGrid}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
               <TouchableOpacity style={styles.menuItem} onPress={() => onItemPress(item)}>
                  <View style={styles.menuItemContent}>
                     <Text style={styles.menuItemName} numberOfLines={2}>
                        {item.name}
                     </Text>
                     <Text style={styles.menuItemDescription} numberOfLines={2}>
                        {item.description}
                     </Text>
                     <Text style={styles.menuItemPrice}>{formatPrice(item.price)}</Text>
                  </View>
               </TouchableOpacity>
            )}
            ListEmptyComponent={
               <View style={styles.emptyState}>
                  <Ionicons name="restaurant" size={48} color="#ccc" />
                  <Text style={styles.emptyStateText}>No menu items found</Text>
               </View>
            }
         />
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
      marginRight: 1,
   },
   searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: 15,
      paddingHorizontal: 15,
      paddingVertical: 12,
      backgroundColor: '#f5f5f5',
      borderRadius: 25,
   },
   searchIcon: {
      marginRight: 10,
   },
   searchInput: {
      flex: 1,
      fontSize: 16,
      color: '#333',
   },
   categoryTabs: {
      paddingHorizontal: 15,
      marginBottom: 10,
      maxHeight: 40,
   },
   categoryTab: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginRight: 10,
      backgroundColor: '#f0f0f0',
      borderRadius: 20,
   },
   categoryTabActive: {
      backgroundColor: '#007AFF',
   },
   categoryTabText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#666',
   },
   categoryTabTextActive: {
      color: '#fff',
   },
   menuGrid: {
      padding: 15,
      paddingTop: 5,
   },
   menuItem: {
      flex: 1,
      margin: 5,
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 15,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      borderWidth: 1,
      borderColor: '#f0f0f0',
   },
   menuItemContent: {
      alignItems: 'flex-start',
   },
   menuItemName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 5,
   },
   menuItemDescription: {
      fontSize: 12,
      color: '#666',
      marginBottom: 10,
      lineHeight: 16,
   },
   menuItemPrice: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#007AFF',
   },
   emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 50,
   },
   emptyStateText: {
      marginTop: 10,
      fontSize: 16,
      color: '#999',
   },
})
