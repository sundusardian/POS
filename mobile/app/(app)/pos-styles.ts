import { StyleSheet } from "react-native"

export const posStyles = StyleSheet.create({
   branchSelector: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
   },
   branchPlaceholder: {
      fontSize: 14,
      color: "#999",
   },
   branchSelected: {
      fontSize: 14,
      color: "#333",
   },
   summaryItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 4,
   },
   summaryItemName: {
      fontSize: 14,
      color: "#333",
      flex: 1,
   },
   summaryItemPrice: {
      fontSize: 14,
      fontWeight: "500",
      color: "#666",
   },
   summaryTotal: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 12,
      marginTop: 12,
      borderTopWidth: 1,
      borderTopColor: "#e0e0e0",
   },
   summaryTotalLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: "#333",
   },
   summaryTotalAmount: {
      fontSize: 18,
      fontWeight: "700",
      color: "#007AFF",
   },
   placeOrderButton: {
      backgroundColor: "#007AFF",
      borderRadius: 8,
      paddingVertical: 16,
      alignItems: "center",
      marginTop: 16,
   },
   placeOrderButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
   },
})
