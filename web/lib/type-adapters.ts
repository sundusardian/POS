// Type adapters to resolve incompatibilities between API client and WebSocket types

import * as ApiTypes from './api-client';
import * as WebSocketTypes from './api/types/orders';

/**
 * Adapts API client Order type to WebSocket Order type
 * This ensures compatibility between the two systems
 */
export function adaptOrderToWebSocketType(apiOrder: ApiTypes.Order): WebSocketTypes.Order {
  // Create a compatible desk object if it exists
  let adaptedDesk: WebSocketTypes.Desk | undefined = undefined;
  
  if (apiOrder.desk) {
    adaptedDesk = {
      ...apiOrder.desk,
      // Add the missing name property if it doesn't exist
      // The API client Desk type doesn't have name, but WebSocket type requires it
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      name: (apiOrder.desk as any).name || `Desk ${apiOrder.desk.number}`,
    };
  }

  // Return the adapted order with the compatible desk
  return {
    ...apiOrder,
    desk: adaptedDesk,
  } as WebSocketTypes.Order;
}

/**
 * Adapts an array of API client Orders to WebSocket Orders
 */
export function adaptOrdersToWebSocketType(apiOrders: ApiTypes.Order[]): WebSocketTypes.Order[] {
  return apiOrders.map(adaptOrderToWebSocketType);
}
