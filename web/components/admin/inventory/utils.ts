import { formatCurrency } from "@/lib/utils"

// Function to determine stock level (low, medium, high)
export function getStockLevel(quantity: number, minQuantity: number) {
  if (quantity <= minQuantity * 0.5) {
    return "low"
  } else if (quantity <= minQuantity) {
    return "medium"
  } else {
    return "high"
  }
}

// Function to calculate stock percentage
export function getStockPercentage(quantity: number, minQuantity: number) {
  return Math.min(Math.round((quantity / (minQuantity * 2)) * 100), 100)
}

// Format date to locale string
export function formatDate(dateString: string) {
  if (!dateString) return "-"
  
  return new Date(dateString).toLocaleString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Export the formatCurrency function for use in components
export { formatCurrency }
