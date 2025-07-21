import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
  branchId?: string;
}

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:8081'],
    credentials: true,
  },
  namespace: '/orders',
})
export class OrderUpdatesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(OrderUpdatesGateway.name);
  private connectedClients = new Map<string, AuthenticatedSocket>();

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Extract token from handshake auth
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token`);
        client.disconnect();
        return;
      }

      // Verify JWT token
      const payload = this.jwtService.verify(token);
      client.userId = payload.sub;
      client.userRole = payload.role;
      client.branchId = payload.branchId; // If user is associated with a specific branch

      this.connectedClients.set(client.id, client);
      
      // Join role-based rooms
      await client.join(`role:${client.userRole}`);
      
      // Join branch-specific room if applicable
      if (client.branchId) {
        await client.join(`branch:${client.branchId}`);
      }

      this.logger.log(`Client ${client.id} connected - User: ${client.userId}, Role: ${client.userRole}`);
      
      // Send connection confirmation
      client.emit('connected', {
        message: 'Connected to order updates',
        userId: client.userId,
        role: client.userRole,
      });

    } catch (error) {
      this.logger.error(`Authentication failed for client ${client.id}:`, error.message);
      client.emit('error', { message: 'Authentication failed' });
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.connectedClients.delete(client.id);
    this.logger.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('joinOrderRoom')
  async handleJoinOrderRoom(
    @MessageBody() data: { orderId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    await client.join(`order:${data.orderId}`);
    client.emit('joinedOrderRoom', { orderId: data.orderId });
    this.logger.log(`Client ${client.id} joined order room: ${data.orderId}`);
  }

  @SubscribeMessage('leaveOrderRoom')
  async handleLeaveOrderRoom(
    @MessageBody() data: { orderId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    await client.leave(`order:${data.orderId}`);
    client.emit('leftOrderRoom', { orderId: data.orderId });
    this.logger.log(`Client ${client.id} left order room: ${data.orderId}`);
  }

  @SubscribeMessage('joinDeskRoom')
  async handleJoinDeskRoom(
    @MessageBody() data: { deskId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    await client.join(`desk:${data.deskId}`);
    client.emit('joinedDeskRoom', { deskId: data.deskId });
    this.logger.log(`Client ${client.id} joined desk room: ${data.deskId}`);
  }

  @SubscribeMessage('leaveDeskRoom')
  async handleLeaveDeskRoom(
    @MessageBody() data: { deskId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    await client.leave(`desk:${data.deskId}`);
    client.emit('leftDeskRoom', { deskId: data.deskId });
    this.logger.log(`Client ${client.id} left desk room: ${data.deskId}`);
  }

  // Methods to emit events from services
  emitOrderCreated(order: any) {
    // Notify staff at the specific branch
    this.server.to(`branch:${order.branchId}`).emit('orderCreated', {
      type: 'ORDER_CREATED',
      order,
      timestamp: new Date().toISOString(),
    });

    // Notify customers at the specific desk
    if (order.deskId) {
      this.server.to(`desk:${order.deskId}`).emit('orderCreated', {
        type: 'ORDER_CREATED',
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          totalAmount: order.totalAmount,
          estimatedTime: order.estimatedTime,
        },
        timestamp: new Date().toISOString(),
      });
    }

    this.logger.log(`Order created event emitted: ${order.id}`);
  }

  emitOrderStatusChanged(order: any, previousStatus: string) {
    // Notify all relevant parties
    this.server.to(`order:${order.id}`).emit('orderStatusChanged', {
      type: 'ORDER_STATUS_CHANGED',
      orderId: order.id,
      orderNumber: order.orderNumber,
      newStatus: order.status,
      previousStatus,
      timestamp: new Date().toISOString(),
    });

    // Notify branch staff
    this.server.to(`branch:${order.branchId}`).emit('orderStatusChanged', {
      type: 'ORDER_STATUS_CHANGED',
      orderId: order.id,
      orderNumber: order.orderNumber,
      newStatus: order.status,
      previousStatus,
      timestamp: new Date().toISOString(),
    });

    // Notify customers at the desk
    if (order.deskId) {
      this.server.to(`desk:${order.deskId}`).emit('orderStatusChanged', {
        type: 'ORDER_STATUS_CHANGED',
        orderId: order.id,
        orderNumber: order.orderNumber,
        newStatus: order.status,
        previousStatus,
        customerMessage: this.getCustomerMessage(order.status),
        timestamp: new Date().toISOString(),
      });
    }

    this.logger.log(`Order status changed event emitted: ${order.id} (${previousStatus} -> ${order.status})`);
  }

  emitOrderCancelled(order: any) {
    this.server.to(`order:${order.id}`).emit('orderCancelled', {
      type: 'ORDER_CANCELLED',
      orderId: order.id,
      orderNumber: order.orderNumber,
      reason: order.cancellationReason,
      timestamp: new Date().toISOString(),
    });

    // Notify branch staff
    this.server.to(`branch:${order.branchId}`).emit('orderCancelled', {
      type: 'ORDER_CANCELLED',
      orderId: order.id,
      orderNumber: order.orderNumber,
      timestamp: new Date().toISOString(),
    });

    // Notify customers
    if (order.deskId) {
      this.server.to(`desk:${order.deskId}`).emit('orderCancelled', {
        type: 'ORDER_CANCELLED',
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerMessage: 'Your order has been cancelled. Please contact staff for assistance.',
        timestamp: new Date().toISOString(),
      });
    }

    this.logger.log(`Order cancelled event emitted: ${order.id}`);
  }

  emitPaymentReceived(payment: any, order: any) {
    this.server.to(`order:${order.id}`).emit('paymentReceived', {
      type: 'PAYMENT_RECEIVED',
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentId: payment.id,
      amount: payment.paidAmount,
      method: payment.paymentMethod,
      changeAmount: payment.changeAmount,
      timestamp: new Date().toISOString(),
    });

    // Notify branch staff
    this.server.to(`branch:${order.branchId}`).emit('paymentReceived', {
      type: 'PAYMENT_RECEIVED',
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: payment.paidAmount,
      method: payment.paymentMethod,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Payment received event emitted: ${payment.id} for order ${order.id}`);
  }

  emitKitchenAlert(order: any, alertType: 'NEW_ORDER' | 'URGENT' | 'READY') {
    // Notify kitchen staff (staff role)
    this.server.to('role:STAFF').emit('kitchenAlert', {
      type: 'KITCHEN_ALERT',
      alertType,
      orderId: order.id,
      orderNumber: order.orderNumber,
      items: order.orderItems,
      specialInstructions: order.notes,
      priority: alertType === 'URGENT' ? 'high' : 'normal',
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Kitchen alert emitted: ${alertType} for order ${order.id}`);
  }

  emitInventoryAlert(alert: { type: 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRING'; ingredient: any; stock?: any }) {
    // Notify managers and admins
    this.server.to('role:MANAGER').to('role:ADMIN').emit('inventoryAlert', {
      type: 'INVENTORY_ALERT',
      alertType: alert.type,
      ingredient: alert.ingredient,
      stock: alert.stock,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Inventory alert emitted: ${alert.type} for ingredient ${alert.ingredient.name}`);
  }

  private getCustomerMessage(status: string): string {
    const messages = {
      PENDING: 'Your order has been received and is being processed.',
      CONFIRMED: 'Your order has been confirmed and is being prepared.',
      PREPARING: 'Your order is being prepared by our kitchen.',
      READY: 'Your order is ready for pickup!',
      SERVED: 'Your order has been served. Enjoy your meal!',
      COMPLETED: 'Thank you for your order!',
      CANCELLED: 'Your order has been cancelled. Please contact staff for assistance.',
    };

    return messages[status] || 'Order status updated.';
  }

  // Utility method to get connected clients count
  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }

  // Utility method to get clients by role
  getClientsByRole(role: string): AuthenticatedSocket[] {
    return Array.from(this.connectedClients.values()).filter(client => client.userRole === role);
  }
}
