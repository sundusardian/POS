import React, { useState, useEffect } from 'react'
import {
   View,
   Text,
   StyleSheet,
   FlatList,
   TouchableOpacity,
   Alert,
   ActivityIndicator,
   RefreshControl,
} from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { DraftOrderStorage, DraftOrder } from '../../lib/storage/draft-storage'

export default function DraftOrdersScreen() {
   const [draftOrders, setDraftOrders] = useState<DraftOrder[]>([])
   const [isLoading, setIsLoading] = useState(true)
   const [isRefreshing, setIsRefreshing] = useState(false)

   const loadDraftOrders = async () => {
      try {
         const drafts = await DraftOrderStorage.getDraftOrders()
         // Sort by most recent first
         const sortedDrafts = drafts.sort((a, b) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
         )
         setDraftOrders(sortedDrafts)
      } catch (error) {
         console.error('Failed to load draft orders:', error)
         Alert.alert('Error', 'Failed to load draft orders')
      } finally {
         setIsLoading(false)
         setIsRefreshing(false)
      }
   }

   useEffect(() => {
      loadDraftOrders()
   }, [])

   const handleRefresh = () => {
      setIsRefreshing(true)
      loadDraftOrders()
   }

   const handleRestoreDraft = (draft: DraftOrder) => {
      Alert.alert(
         'Restore Draft Order',
         `Restore draft order for ${draft.customerName || 'Customer'} with ${draft.items.length} items?`,
         [
            { text: 'Cancel', style: 'cancel' },
            {
               text: 'Restore',
               onPress: () => {
                  // Navigate back to create-order with draft data
                  router.push({
                     pathname: '/(app)/create-order',
                     params: { 
                        restoreDraftId: draft.id 
                     }
                  })
               }
            }
         ]
      )
   }

   const handleDeleteDraft = (draft: DraftOrder) => {
      Alert.alert(
         'Delete Draft Order',
         `Are you sure you want to delete this draft order?`,
         [
            { text: 'Cancel', style: 'cancel' },
            {
               text: 'Delete',
               style: 'destructive',
               onPress: async () => {
                  try {
                     await DraftOrderStorage.deleteDraftOrder(draft.id)
                     loadDraftOrders() // Refresh the list
                     Alert.alert('Success', 'Draft order deleted')
                  } catch (err) {
                     console.error('Failed to delete draft:', err)
                     Alert.alert('Error', 'Failed to delete draft order')
                  }
               }
            }
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

   const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', {
         day: '2-digit',
         month: 'short',
         year: 'numeric',
         hour: '2-digit',
         minute: '2-digit'
      })
   }

   const renderDraftItem = ({ item }: { item: DraftOrder }) => (
      <View style={styles.draftCard}>
         <View style={styles.draftHeader}>
            <View style={styles.draftInfo}>
               <Text style={styles.customerName}>
                  {item.customerName || 'No Customer Name'}
               </Text>
               <Text style={styles.branchName}>{item.branchName}</Text>
               {item.deskNumber && (
                  <Text style={styles.deskNumber}>Table: {item.deskNumber}</Text>
               )}
            </View>
            <View style={styles.draftMeta}>
               <Text style={styles.totalAmount}>{formatPrice(item.totalAmount)}</Text>
               <Text style={styles.itemCount}>{item.items.length} items</Text>
               <Text style={styles.dateText}>{formatDate(item.updatedAt)}</Text>
            </View>
         </View>

         <View style={styles.itemsList}>
            {item.items.slice(0, 3).map((cartItem, index) => (
               <Text key={index} style={styles.itemText}>
                  {cartItem.quantity}x {cartItem.menuItem.name}
               </Text>
            ))}
            {item.items.length > 3 && (
               <Text style={styles.moreItems}>
                  +{item.items.length - 3} more items
               </Text>
            )}
         </View>

         <View style={styles.draftActions}>
            <TouchableOpacity
               style={styles.restoreButton}
               onPress={() => handleRestoreDraft(item)}
            >
               <Ionicons name="refresh" size={16} color="#007AFF" />
               <Text style={styles.restoreButtonText}>Restore</Text>
            </TouchableOpacity>

            <TouchableOpacity
               style={styles.deleteButton}
               onPress={() => handleDeleteDraft(item)}
            >
               <Ionicons name="trash" size={16} color="#FF3B30" />
               <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
         </View>
      </View>
   )

   if (isLoading) {
      return (
         <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading draft orders...</Text>
         </View>
      )
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
            <Text style={styles.headerTitle}>Draft Orders</Text>
            <View style={styles.headerRight}>
               <Text style={styles.draftCount}>{draftOrders.length}</Text>
            </View>
         </View>

         {draftOrders.length === 0 ? (
            <View style={styles.emptyContainer}>
               <Ionicons name="document-outline" size={64} color="#ccc" />
               <Text style={styles.emptyTitle}>No Draft Orders</Text>
               <Text style={styles.emptySubtitle}>
                  Draft orders you save will appear here
               </Text>
            </View>
         ) : (
            <FlatList
               data={draftOrders}
               renderItem={renderDraftItem}
               keyExtractor={(item) => item.id}
               contentContainerStyle={styles.listContainer}
               refreshControl={
                  <RefreshControl
                     refreshing={isRefreshing}
                     onRefresh={handleRefresh}
                     colors={['#007AFF']}
                  />
               }
            />
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
      backgroundColor: '#007AFF',
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
   },
   draftCount: {
      fontSize: 12,
      fontWeight: '600',
      color: '#fff',
   },
   loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: '#666',
   },
   emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
   },
   emptyTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#333',
      marginTop: 20,
   },
   emptySubtitle: {
      fontSize: 14,
      color: '#666',
      textAlign: 'center',
      marginTop: 8,
   },
   listContainer: {
      padding: 20,
   },
   draftCard: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
   },
   draftHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
   },
   draftInfo: {
      flex: 1,
   },
   customerName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
   },
   branchName: {
      fontSize: 14,
      color: '#666',
      marginTop: 2,
   },
   deskNumber: {
      fontSize: 12,
      color: '#999',
      marginTop: 2,
   },
   draftMeta: {
      alignItems: 'flex-end',
   },
   totalAmount: {
      fontSize: 16,
      fontWeight: '700',
      color: '#007AFF',
   },
   itemCount: {
      fontSize: 12,
      color: '#666',
      marginTop: 2,
   },
   dateText: {
      fontSize: 11,
      color: '#999',
      marginTop: 2,
   },
   itemsList: {
      marginBottom: 12,
   },
   itemText: {
      fontSize: 13,
      color: '#666',
      marginBottom: 2,
   },
   moreItems: {
      fontSize: 12,
      color: '#999',
      fontStyle: 'italic',
   },
   draftActions: {
      flexDirection: 'row',
      gap: 10,
   },
   restoreButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f0f8ff',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      gap: 6,
      flex: 1,
      justifyContent: 'center',
   },
   restoreButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#007AFF',
   },
   deleteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff5f5',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      gap: 6,
      flex: 1,
      justifyContent: 'center',
   },
   deleteButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#FF3B30',
   },
})
