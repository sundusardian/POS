import React, {useState, useEffect} from "react"
import {
   View,
   Text,
   StyleSheet,
   ScrollView,
   TouchableOpacity,
   TextInput,
   Alert,
   RefreshControl,
   Modal,
   ActivityIndicator,
   FlatList,
} from "react-native"
import {Ionicons} from "@expo/vector-icons"
import {router} from "expo-router"
import {apiClient, Order} from "../../lib/api"

export default function OrdersScreen() {
   const [orders, setOrders] = useState<Order[]>([])
   const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
   // Removed unused state variables for now - can be added back when create order modal is implemented
   const [isLoading, setIsLoading] = useState(true)
   const [isRefreshing, setIsRefreshing] = useState(false)
   const [searchQuery, setSearchQuery] = useState("")
   const [selectedStatus, setSelectedStatus] = useState<string>("ALL")
   // Removed unused create modal state for now
   const [showOrderDetail, setShowOrderDetail] = useState(false)
   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

   // Create order form state removed for now - will be added back when create modal is implemented

   // Removed unused user for now - can be added back when user-specific features are needed

   const statusOptions = [
      {value: "ALL", label: "All Orders", color: "#666"},
      {value: "PENDING", label: "Pending", color: "#FF9500"},
      {value: "CONFIRMED", label: "Confirmed", color: "#007AFF"},
      {value: "PREPARING", label: "Preparing", color: "#FF3B30"},
      {value: "READY", label: "Ready", color: "#34C759"},
      {value: "SERVED", label: "Served", color: "#5856D6"},
      {value: "COMPLETED", label: "Completed", color: "#00C7BE"},
      {value: "CANCELLED", label: "Cancelled", color: "#8E8E93"},
   ]

   useEffect(() => {
      loadInitialData()
   }, [])

   useEffect(() => {
      let filtered = orders

      // Filter by status
      if (selectedStatus !== "ALL") {
         filtered = filtered.filter((order) => order.status === selectedStatus)
      }

      // Filter by search query
      if (searchQuery.trim()) {
         const query = searchQuery.toLowerCase()
         filtered = filtered.filter(
            (order) =>
               order.orderNumber.toLowerCase().includes(query) ||
               order.customerName?.toLowerCase().includes(query) ||
               order.branch?.name.toLowerCase().includes(query)
         )
      }

      setFilteredOrders(filtered)
   }, [orders, searchQuery, selectedStatus])

   const loadInitialData = async () => {
      try {
         setIsLoading(true)
         const ordersData = await apiClient.orders.getOrders()
         setOrders(ordersData)
      } catch (error) {
         console.error("Failed to load data:", error)
         Alert.alert("Error", "Failed to load orders data")
      } finally {
         setIsLoading(false)
      }
   }

   const handleRefresh = async () => {
      setIsRefreshing(true)
      await loadInitialData()
      setIsRefreshing(false)
   }

   // filterOrders function moved inline to useEffect to fix dependency issues

   const getStatusColor = (status: string) => {
      const statusOption = statusOptions.find(
         (option) => option.value === status
      )
      return statusOption?.color || "#666"
   }

   const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("id-ID", {
         style: "currency",
         currency: "IDR",
         minimumFractionDigits: 0,
      }).format(amount)
   }

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("id-ID", {
         day: "2-digit",
         month: "short",
         year: "numeric",
         hour: "2-digit",
         minute: "2-digit",
      })
   }

   // handleCreateOrder removed for now - will be added back when create modal is implemented

   const handleUpdateOrderStatus = async (
      orderId: string,
      newStatus: string
   ) => {
      try {
         const updatedOrder = await apiClient.orders.updateOrder(orderId, {
            status: newStatus as any,
         })

         setOrders((prev) =>
            prev.map((order) => (order.id === orderId ? updatedOrder : order))
         )

         if (selectedOrder?.id === orderId) {
            setSelectedOrder(updatedOrder)
         }

         Alert.alert("Success", "Order status updated")
      } catch (error) {
         console.error("Failed to update order:", error)
         Alert.alert("Error", "Failed to update order status")
      }
   }

   // resetCreateForm function removed for now - will be added back when create modal is implemented

   const renderOrderCard = (order: Order) => (
      <TouchableOpacity
         style={[styles.orderCard, {marginHorizontal: 20}]}
         onPress={() => {
            setSelectedOrder(order)
            setShowOrderDetail(true)
         }}
      >
         <View style={styles.orderHeader}>
            <View style={styles.orderInfo}>
               <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
               <Text style={styles.customerName}>
                  {order.customerName || "Walk-in Customer"}
               </Text>
            </View>
            <View
               style={[
                  styles.statusBadge,
                  {backgroundColor: getStatusColor(order.status)},
               ]}
            >
               <Text style={styles.statusText}>{order.status}</Text>
            </View>
         </View>

         <View style={styles.orderDetails}>
            <View style={styles.orderDetailRow}>
               <Ionicons name="storefront" size={16} color="#666" />
               <Text style={styles.orderDetailText}>{order.branch?.name}</Text>
            </View>
            <View style={styles.orderDetailRow}>
               <Ionicons name="time" size={16} color="#666" />
               <Text style={styles.orderDetailText}>
                  {formatDate(order.createdAt)}
               </Text>
            </View>
            <View style={styles.orderDetailRow}>
               <Ionicons name="receipt" size={16} color="#666" />
               <Text style={styles.orderDetailText}>
                  {order.orderItems.length} item
                  {order.orderItems.length !== 1 ? "s" : ""}
               </Text>
            </View>
         </View>

         <View style={styles.orderFooter}>
            <Text style={styles.totalAmount}>
               {formatCurrency(order.totalAmount)}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#007AFF" />
         </View>
      </TouchableOpacity>
   )

   const renderOrderDetail = () => (
      <Modal
         visible={showOrderDetail}
         animationType="slide"
         presentationStyle="pageSheet"
      >
         <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
               <TouchableOpacity onPress={() => setShowOrderDetail(false)}>
                  <Ionicons name="close" size={24} color="#007AFF" />
               </TouchableOpacity>
               <Text style={styles.modalTitle}>Order Details</Text>
               <View style={{width: 24}} />
            </View>

            {selectedOrder && (
               <ScrollView style={styles.modalContent}>
                  <View style={styles.orderDetailCard}>
                     <View style={styles.orderDetailHeader}>
                        <Text style={styles.orderDetailNumber}>
                           #{selectedOrder.orderNumber}
                        </Text>
                        <View
                           style={[
                              styles.statusBadge,
                              {
                                 backgroundColor: getStatusColor(
                                    selectedOrder.status
                                 ),
                              },
                           ]}
                        >
                           <Text style={styles.statusText}>
                              {selectedOrder.status}
                           </Text>
                        </View>
                     </View>

                     <View style={styles.customerInfo}>
                        <Text style={styles.sectionTitle}>
                           Customer Information
                        </Text>
                        <Text style={styles.customerDetail}>
                           Name:{" "}
                           {selectedOrder.customerName || "Walk-in Customer"}
                        </Text>
                        {selectedOrder.customerPhone && (
                           <Text style={styles.customerDetail}>
                              Phone: {selectedOrder.customerPhone}
                           </Text>
                        )}
                        <Text style={styles.customerDetail}>
                           Branch: {selectedOrder.branch?.name}
                        </Text>
                        <Text style={styles.customerDetail}>
                           Date: {formatDate(selectedOrder.createdAt)}
                        </Text>
                     </View>

                     <View style={styles.itemsList}>
                        <Text style={styles.sectionTitle}>Order Items</Text>
                        {selectedOrder.orderItems.map((item, index) => (
                           <View key={index} style={styles.orderItem}>
                              <View style={styles.itemInfo}>
                                 <Text style={styles.itemName}>
                                    {item.menuItem?.name}
                                 </Text>
                                 <Text style={styles.itemQuantity}>
                                    Qty: {item.quantity}
                                 </Text>
                              </View>
                              <Text style={styles.itemPrice}>
                                 {formatCurrency(
                                    item.unitPrice * item.quantity
                                 )}
                              </Text>
                           </View>
                        ))}
                     </View>

                     <View style={styles.totalSection}>
                        <Text style={styles.totalLabel}>Total Amount:</Text>
                        <Text style={styles.totalValue}>
                           {formatCurrency(selectedOrder.totalAmount)}
                        </Text>
                     </View>

                     {/* Status update buttons */}
                     <View style={styles.actionButtons}>
                        <Text style={styles.sectionTitle}>Update Status</Text>
                        <View style={styles.statusButtons}>
                           {statusOptions.slice(1).map((status) => (
                              <TouchableOpacity
                                 key={status.value}
                                 style={[
                                    styles.statusButton,
                                    {backgroundColor: status.color},
                                    selectedOrder.status === status.value &&
                                       styles.currentStatus,
                                 ]}
                                 onPress={() =>
                                    handleUpdateOrderStatus(
                                       selectedOrder.id,
                                       status.value
                                    )
                                 }
                                 disabled={
                                    selectedOrder.status === status.value
                                 }
                              >
                                 <Text style={styles.statusButtonText}>
                                    {status.label}
                                 </Text>
                              </TouchableOpacity>
                           ))}
                        </View>
                     </View>
                  </View>
               </ScrollView>
            )}
         </View>
      </Modal>
   )

   if (isLoading && !isRefreshing) {
      return (
         <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading orders...</Text>
         </View>
      )
   }

   return (
      <View style={styles.container}>
         {/* Header */}
         <View style={styles.header}>
            <Text style={styles.title}>Orders</Text>
            <TouchableOpacity
               style={styles.addButton}
               onPress={() => router.push("/create-order")}
            >
               <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
         </View>

         {/* Search and Filter */}
         <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
               <Ionicons name="search" size={20} color="#666" />
               <TextInput
                  style={styles.searchInput}
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
               />
            </View>
         </View>

         {/* Status Filter */}
         <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.statusFilter}
            contentContainerStyle={styles.statusFilterContent}
         >
            {statusOptions.map((status) => (
               <TouchableOpacity
                  key={status.value}
                  style={[
                     styles.statusFilterButton,
                     selectedStatus === status.value && styles.activeStatusFilter,
                     {borderColor: status.color},
                  ]}
                  onPress={() => setSelectedStatus(status.value)}
               >
                  <Text
                     style={[
                        styles.statusFilterText,
                        selectedStatus === status.value && {color: status.color},
                     ]}
                  >
                     {status.label}
                  </Text>
               </TouchableOpacity>
            ))}
         </ScrollView>

         {/* Orders List */}
         <FlatList
            style={styles.ordersList}
            data={filteredOrders}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => renderOrderCard(item)}
            refreshControl={
               <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
               />
            }
            ListEmptyComponent={
               isLoading ? (
                  <View style={styles.loadingContainer}>
                     <ActivityIndicator size="large" color="#007AFF" />
                     <Text style={styles.loadingText}>Loading orders...</Text>
                  </View>
               ) : (
                  <View style={styles.emptyState}>
                     <Ionicons name="receipt-outline" size={64} color="#ccc" />
                     <Text style={styles.emptyStateText}>No orders found</Text>
                     <Text style={styles.emptyStateSubtext}>
                        {searchQuery || selectedStatus !== "ALL"
                           ? "Try adjusting your search or filter"
                           : "Create your first order to get started"}
                     </Text>
                  </View>
               )
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
               filteredOrders.length === 0
                  ? styles.emptyListContainer
                  : undefined
            }
         />

         {/* Order Detail Modal */}
         {renderOrderDetail()}
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#f8f9fa",
   },
   loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f8f9fa",
   },
   loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: "#666",
   },
   header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      backgroundColor: "#fff",
      borderBottomWidth: 1,
      borderBottomColor: "#e0e0e0",
   },
   title: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#333",
   },
   addButton: {
      backgroundColor: "#007AFF",
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: "center",
      alignItems: "center",
   },
   searchContainer: {
      padding: 20,
      backgroundColor: "#fff",
   },
   searchInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#f8f9fa",
      borderRadius: 10,
      paddingHorizontal: 15,
      height: 44,
   },
   searchInput: {
      flex: 1,
      marginLeft: 10,
      fontSize: 16,
      color: "#333",
   },
   statusFilter: {
      backgroundColor: "#fff",
      paddingVertical: 10,
      maxHeight: 52,
   },
   statusFilterContent: {
      paddingHorizontal: 20,
   },
   statusFilterButton: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      marginRight: 10,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "#e0e0e0",
      minHeight: 32,
      justifyContent: "center",
      alignItems: "center",
   },
   activeStatusFilter: {
      backgroundColor: "#f0f8ff",
   },
   statusFilterText: {
      fontSize: 14,
      color: "#666",
      fontWeight: "500",
   },
   ordersList: {
      flex: 1,
   },
   emptyListContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
   },
   orderCard: {
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
   },
   orderHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
   },
   orderInfo: {
      flex: 1,
   },
   orderNumber: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 4,
   },
   customerName: {
      fontSize: 14,
      color: "#666",
   },
   statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
   },
   statusText: {
      color: "#fff",
      fontSize: 12,
      fontWeight: "600",
   },
   orderDetails: {
      marginBottom: 12,
   },
   orderDetailRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
   },
   orderDetailText: {
      marginLeft: 8,
      fontSize: 14,
      color: "#666",
   },
   orderFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: "#f0f0f0",
   },
   totalAmount: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#007AFF",
   },
   emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
   },
   emptyStateText: {
      fontSize: 18,
      fontWeight: "600",
      color: "#666",
      marginTop: 16,
      marginBottom: 8,
   },
   emptyStateSubtext: {
      fontSize: 14,
      color: "#999",
      textAlign: "center",
      paddingHorizontal: 40,
   },
   modalContainer: {
      flex: 1,
      backgroundColor: "#f8f9fa",
   },
   modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      backgroundColor: "#fff",
      borderBottomWidth: 1,
      borderBottomColor: "#e0e0e0",
   },
   modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
   },
   modalContent: {
      flex: 1,
      padding: 20,
   },
   orderDetailCard: {
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: 20,
   },
   orderDetailHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
   },
   orderDetailNumber: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#333",
   },
   customerInfo: {
      marginBottom: 20,
   },
   sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: "#333",
      marginBottom: 10,
   },
   customerDetail: {
      fontSize: 14,
      color: "#666",
      marginBottom: 4,
   },
   itemsList: {
      marginBottom: 20,
   },
   orderItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
   },
   itemInfo: {
      flex: 1,
   },
   itemName: {
      fontSize: 14,
      fontWeight: "500",
      color: "#333",
   },
   itemQuantity: {
      fontSize: 12,
      color: "#666",
   },
   itemPrice: {
      fontSize: 14,
      fontWeight: "600",
      color: "#007AFF",
   },
   totalSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 16,
      borderTopWidth: 2,
      borderTopColor: "#e0e0e0",
      marginBottom: 20,
   },
   totalLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: "#333",
   },
   totalValue: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#007AFF",
   },
   actionButtons: {
      marginTop: 20,
   },
   statusButtons: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
   },
   statusButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
      marginBottom: 8,
   },
   currentStatus: {
      opacity: 0.5,
   },
   statusButtonText: {
      color: "#fff",
      fontSize: 12,
      fontWeight: "600",
   },
})
