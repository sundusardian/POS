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
  namespace: '/staff',
})
export class StaffUpdatesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(StaffUpdatesGateway.name);
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

      this.logger.log(`Client ${client.id} connected to staff updates - User: ${client.userId}, Role: ${client.userRole}`);
      
      client.emit('connected', {
        message: 'Connected to staff updates',
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
    this.logger.log(`Client ${client.id} disconnected from staff updates`);
  }

  @SubscribeMessage('joinStaffRoom')
  async handleJoinStaffRoom(
    @MessageBody() data: { branchId?: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const room = data.branchId ? `staff:branch:${data.branchId}` : 'staff:global';
    await client.join(room);
    client.emit('joinedStaffRoom', { room });
    this.logger.log(`Client ${client.id} joined staff room: ${room}`);
  }

  @SubscribeMessage('leaveStaffRoom')
  async handleLeaveStaffRoom(
    @MessageBody() data: { branchId?: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const room = data.branchId ? `staff:branch:${data.branchId}` : 'staff:global';
    await client.leave(room);
    client.emit('leftStaffRoom', { room });
    this.logger.log(`Client ${client.id} left staff room: ${room}`);
  }

  // Emit staff creation events
  emitStaffCreated(staff: {
    id: string;
    name: string;
    email: string;
    role: string;
    branchId?: string;
    branchName?: string;
    isActive: boolean;
  }) {
    const eventData = {
      type: 'STAFF_CREATED',
      staff,
      timestamp: new Date().toISOString(),
    };

    // Send to global staff room
    this.server.to('staff:global').emit('staffCreated', eventData);

    // Send to specific branch if applicable
    if (staff.branchId) {
      this.server.to(`staff:branch:${staff.branchId}`).emit('staffCreated', eventData);
      this.server.to(`branch:${staff.branchId}`).emit('staffCreated', eventData);
    }

    // Send to managers and admins
    this.server.to('role:MANAGER').to('role:ADMIN').emit('staffCreated', eventData);

    this.logger.log(`Staff created event emitted: ${staff.name} (${staff.id})`);
  }

  // Emit staff update events
  emitStaffUpdated(staff: {
    id: string;
    name: string;
    email: string;
    role: string;
    branchId?: string;
    branchName?: string;
    isActive: boolean;
  }) {
    const eventData = {
      type: 'STAFF_UPDATED',
      staffId: staff.id,
      staff,
      timestamp: new Date().toISOString(),
    };

    // Send to global staff room
    this.server.to('staff:global').emit('staffUpdated', eventData);

    // Send to specific branch if applicable
    if (staff.branchId) {
      this.server.to(`staff:branch:${staff.branchId}`).emit('staffUpdated', eventData);
      this.server.to(`branch:${staff.branchId}`).emit('staffUpdated', eventData);
    }

    // Send to managers and admins
    this.server.to('role:MANAGER').to('role:ADMIN').emit('staffUpdated', eventData);

    this.logger.log(`Staff updated event emitted: ${staff.name} (${staff.id})`);
  }

  // Emit staff deletion events
  emitStaffDeleted(staffId: string, staffName: string, branchId?: string) {
    const eventData = {
      type: 'STAFF_DELETED',
      staffId,
      staffName,
      timestamp: new Date().toISOString(),
    };

    // Send to global staff room
    this.server.to('staff:global').emit('staffDeleted', eventData);

    // Send to specific branch if applicable
    if (branchId) {
      this.server.to(`staff:branch:${branchId}`).emit('staffDeleted', eventData);
      this.server.to(`branch:${branchId}`).emit('staffDeleted', eventData);
    }

    // Send to managers and admins
    this.server.to('role:MANAGER').to('role:ADMIN').emit('staffDeleted', eventData);

    this.logger.log(`Staff deleted event emitted: ${staffName} (${staffId})`);
  }

  // Emit staff status change events
  emitStaffStatusChanged(staff: {
    id: string;
    name: string;
    isActive: boolean;
    branchId?: string;
    previousStatus?: boolean;
  }) {
    const eventData = {
      type: 'STAFF_STATUS_CHANGED',
      staffId: staff.id,
      staffName: staff.name,
      isActive: staff.isActive,
      previousStatus: staff.previousStatus,
      timestamp: new Date().toISOString(),
    };

    // Send to global staff room
    this.server.to('staff:global').emit('staffStatusChanged', eventData);

    // Send to specific branch if applicable
    if (staff.branchId) {
      this.server.to(`staff:branch:${staff.branchId}`).emit('staffStatusChanged', eventData);
      this.server.to(`branch:${staff.branchId}`).emit('staffStatusChanged', eventData);
    }

    // Send to managers and admins
    this.server.to('role:MANAGER').to('role:ADMIN').emit('staffStatusChanged', eventData);

    this.logger.log(`Staff status changed event emitted: ${staff.name} - ${staff.isActive ? 'Active' : 'Inactive'}`);
  }

  // Emit staff activity update events
  emitStaffActivityUpdate(activity: {
    staffId: string;
    staffName: string;
    activity: string;
    activityType: 'LOGIN' | 'LOGOUT' | 'ORDER_TAKEN' | 'ORDER_SERVED' | 'BREAK_START' | 'BREAK_END' | 'SHIFT_START' | 'SHIFT_END' | 'OTHER';
    branchId?: string;
    metadata?: any;
  }) {
    const eventData = {
      type: 'STAFF_ACTIVITY_UPDATE',
      staffId: activity.staffId,
      staffName: activity.staffName,
      activity: activity.activity,
      activityType: activity.activityType,
      metadata: activity.metadata,
      timestamp: new Date().toISOString(),
    };

    // Send to global staff room
    this.server.to('staff:global').emit('staffActivityUpdate', eventData);

    // Send to specific branch if applicable
    if (activity.branchId) {
      this.server.to(`staff:branch:${activity.branchId}`).emit('staffActivityUpdate', eventData);
      this.server.to(`branch:${activity.branchId}`).emit('staffActivityUpdate', eventData);
    }

    // Send to managers and admins
    this.server.to('role:MANAGER').to('role:ADMIN').emit('staffActivityUpdate', eventData);

    this.logger.log(`Staff activity update emitted: ${activity.staffName} - ${activity.activity}`);
  }

  // Emit staff performance metrics
  emitStaffPerformanceUpdate(performance: {
    staffId: string;
    staffName: string;
    metrics: {
      ordersServed: number;
      averageServiceTime: number;
      customerRating?: number;
      totalSales: number;
    };
    period: 'daily' | 'weekly' | 'monthly';
    branchId?: string;
  }) {
    const eventData = {
      type: 'STAFF_PERFORMANCE_UPDATE',
      staffId: performance.staffId,
      staffName: performance.staffName,
      metrics: performance.metrics,
      period: performance.period,
      timestamp: new Date().toISOString(),
    };

    // Send to specific branch if applicable
    if (performance.branchId) {
      this.server.to(`staff:branch:${performance.branchId}`).emit('staffPerformanceUpdate', eventData);
      this.server.to(`branch:${performance.branchId}`).emit('staffPerformanceUpdate', eventData);
    }

    // Send to managers and admins
    this.server.to('role:MANAGER').to('role:ADMIN').emit('staffPerformanceUpdate', eventData);

    this.logger.log(`Staff performance update emitted: ${performance.staffName} - ${performance.period}`);
  }

  // Emit shift change events
  emitShiftChange(shift: {
    staffId: string;
    staffName: string;
    type: 'START' | 'END';
    shiftId?: string;
    branchId?: string;
    scheduledStart?: string;
    scheduledEnd?: string;
    actualTime: string;
  }) {
    const eventData = {
      type: 'SHIFT_CHANGE',
      staffId: shift.staffId,
      staffName: shift.staffName,
      shiftType: shift.type,
      shiftId: shift.shiftId,
      scheduledStart: shift.scheduledStart,
      scheduledEnd: shift.scheduledEnd,
      actualTime: shift.actualTime,
      timestamp: new Date().toISOString(),
    };

    // Send to specific branch if applicable
    if (shift.branchId) {
      this.server.to(`staff:branch:${shift.branchId}`).emit('shiftChange', eventData);
      this.server.to(`branch:${shift.branchId}`).emit('shiftChange', eventData);
    }

    // Send to managers and admins
    this.server.to('role:MANAGER').to('role:ADMIN').emit('shiftChange', eventData);

    this.logger.log(`Shift change event emitted: ${shift.staffName} - ${shift.type}`);
  }

  // Utility methods
  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }

  getClientsByRole(role: string): AuthenticatedSocket[] {
    return Array.from(this.connectedClients.values()).filter(client => client.userRole === role);
  }

  getActiveStaffCount(): number {
    return Array.from(this.connectedClients.values()).filter(client => 
      client.userRole === 'STAFF' || client.userRole === 'MANAGER'
    ).length;
  }
}
