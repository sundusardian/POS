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
import { Logger } from '@nestjs/common';
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
  namespace: '/inventory',
})
export class InventoryUpdatesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(InventoryUpdatesGateway.name);
  private connectedClients = new Map<string, AuthenticatedSocket>();

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token`);
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      client.userId = payload.sub;
      client.userRole = payload.role;
      client.branchId = payload.branchId;

      this.connectedClients.set(client.id, client);
      
      // Join role-based rooms
      await client.join(`role:${client.userRole}`);
      
      // Join branch-specific room if applicable
      if (client.branchId) {
        await client.join(`branch:${client.branchId}`);
      }

      this.logger.log(`Client ${client.id} connected to inventory updates - User: ${client.userId}, Role: ${client.userRole}`);
      
      client.emit('connected', {
        message: 'Connected to inventory updates',
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
    this.logger.log(`Client ${client.id} disconnected from inventory updates`);
  }

  @SubscribeMessage('joinInventoryRoom')
  async handleJoinInventoryRoom(
    @MessageBody() data: { branchId?: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const room = data.branchId ? `inventory:branch:${data.branchId}` : 'inventory:global';
    await client.join(room);
    client.emit('joinedInventoryRoom', { room });
    this.logger.log(`Client ${client.id} joined inventory room: ${room}`);
  }

  @SubscribeMessage('leaveInventoryRoom')
  async handleLeaveInventoryRoom(
    @MessageBody() data: { branchId?: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const room = data.branchId ? `inventory:branch:${data.branchId}` : 'inventory:global';
    await client.leave(room);
    client.emit('leftInventoryRoom', { room });
    this.logger.log(`Client ${client.id} left inventory room: ${room}`);
  }

  // Emit inventory alert events
  emitInventoryAlert(alert: {
    type: 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRING' | 'RESTOCK_NEEDED';
    message: string;
    ingredientId: string;
    ingredientName: string;
    currentQuantity: number;
    minimumQuantity?: number;
    branchId?: string;
    severity: 'low' | 'medium' | 'high';
  }) {
    const eventData = {
      type: alert.type,
      message: alert.message,
      data: {
        ingredientId: alert.ingredientId,
        ingredientName: alert.ingredientName,
        currentQuantity: alert.currentQuantity,
        minimumQuantity: alert.minimumQuantity,
        severity: alert.severity,
      },
      timestamp: new Date().toISOString(),
    };

    // Send to global inventory room
    this.server.to('inventory:global').emit('inventoryAlert', eventData);

    // Send to specific branch if applicable
    if (alert.branchId) {
      this.server.to(`inventory:branch:${alert.branchId}`).emit('inventoryAlert', eventData);
      this.server.to(`branch:${alert.branchId}`).emit('inventoryAlert', eventData);
    }

    // Send to managers and admins
    this.server.to('role:MANAGER').to('role:ADMIN').emit('inventoryAlert', eventData);

    this.logger.log(`Inventory alert emitted: ${alert.type} for ${alert.ingredientName}`);
  }

  // Emit inventory level update events
  emitInventoryLevelUpdate(update: {
    ingredientId: string;
    ingredientName?: string;
    quantity: number;
    status: 'low' | 'normal' | 'high';
    branchId?: string;
    previousQuantity?: number;
  }) {
    const eventData = {
      ingredientId: update.ingredientId,
      ingredientName: update.ingredientName,
      quantity: update.quantity,
      status: update.status,
      previousQuantity: update.previousQuantity,
      timestamp: new Date().toISOString(),
    };

    // Send to global inventory room
    this.server.to('inventory:global').emit('inventoryLevelUpdate', eventData);

    // Send to specific branch if applicable
    if (update.branchId) {
      this.server.to(`inventory:branch:${update.branchId}`).emit('inventoryLevelUpdate', eventData);
      this.server.to(`branch:${update.branchId}`).emit('inventoryLevelUpdate', eventData);
    }

    this.logger.log(`Inventory level update emitted for ${update.ingredientName}: ${update.quantity} (${update.status})`);
  }

  // Emit stock movement events
  emitStockMovement(movement: {
    id: string;
    type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';
    ingredientId: string;
    ingredientName: string;
    quantity: number;
    reason?: string;
    branchId?: string;
    userId: string;
    userName?: string;
  }) {
    const eventData = {
      movementId: movement.id,
      type: movement.type,
      ingredientId: movement.ingredientId,
      ingredientName: movement.ingredientName,
      quantity: movement.quantity,
      reason: movement.reason,
      userId: movement.userId,
      userName: movement.userName,
      timestamp: new Date().toISOString(),
    };

    // Send to global inventory room
    this.server.to('inventory:global').emit('stockMovement', eventData);

    // Send to specific branch if applicable
    if (movement.branchId) {
      this.server.to(`inventory:branch:${movement.branchId}`).emit('stockMovement', eventData);
      this.server.to(`branch:${movement.branchId}`).emit('stockMovement', eventData);
    }

    // Send to managers and admins
    this.server.to('role:MANAGER').to('role:ADMIN').emit('stockMovement', eventData);

    this.logger.log(`Stock movement emitted: ${movement.type} - ${movement.ingredientName} (${movement.quantity})`);
  }

  // Emit supplier update events
  emitSupplierUpdate(update: {
    type: 'CREATED' | 'UPDATED' | 'DELETED';
    supplierId: string;
    supplierName: string;
    data?: any;
  }) {
    const eventData = {
      type: update.type,
      supplierId: update.supplierId,
      supplierName: update.supplierName,
      data: update.data,
      timestamp: new Date().toISOString(),
    };

    // Send to managers and admins
    this.server.to('role:MANAGER').to('role:ADMIN').emit('supplierUpdate', eventData);

    this.logger.log(`Supplier update emitted: ${update.type} - ${update.supplierName}`);
  }

  // Utility methods
  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }

  getClientsByRole(role: string): AuthenticatedSocket[] {
    return Array.from(this.connectedClients.values()).filter(client => client.userRole === role);
  }
}
