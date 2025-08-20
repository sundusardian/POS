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
  namespace: '/branch',
})
export class BranchUpdatesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(BranchUpdatesGateway.name);
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

      this.logger.log(`Client ${client.id} connected to branch updates - User: ${client.userId}, Role: ${client.userRole}`);
      
      client.emit('connected', {
        message: 'Connected to branch updates',
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
    this.logger.log(`Client ${client.id} disconnected from branch updates`);
  }

  @SubscribeMessage('joinBranchRoom')
  async handleJoinBranchRoom(
    @MessageBody() data: { branchId?: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const room = data.branchId ? `branch:performance:${data.branchId}` : 'branch:global';
    await client.join(room);
    client.emit('joinedBranchRoom', { room });
    this.logger.log(`Client ${client.id} joined branch room: ${room}`);
  }

  @SubscribeMessage('leaveBranchRoom')
  async handleLeaveBranchRoom(
    @MessageBody() data: { branchId?: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const room = data.branchId ? `branch:performance:${data.branchId}` : 'branch:global';
    await client.leave(room);
    client.emit('leftBranchRoom', { room });
    this.logger.log(`Client ${client.id} left branch room: ${room}`);
  }

  // Emit branch creation events
  emitBranchCreated(branch: {
    id: string;
    name: string;
    address: string;
    phone?: string;
    email?: string;
    isActive: boolean;
    managerId?: string;
    managerName?: string;
  }) {
    const eventData = {
      type: 'BRANCH_CREATED',
      branch,
      timestamp: new Date().toISOString(),
    };

    // Send to global branch room
    this.server.to('branch:global').emit('branchCreated', eventData);

    // Send to admins and managers
    this.server.to('role:ADMIN').to('role:MANAGER').emit('branchCreated', eventData);

    this.logger.log(`Branch created event emitted: ${branch.name} (${branch.id})`);
  }

  // Emit branch update events
  emitBranchUpdated(branch: {
    id: string;
    name: string;
    address: string;
    phone?: string;
    email?: string;
    isActive: boolean;
    managerId?: string;
    managerName?: string;
  }) {
    const eventData = {
      type: 'BRANCH_UPDATED',
      branchId: branch.id,
      branch,
      timestamp: new Date().toISOString(),
    };

    // Send to global branch room
    this.server.to('branch:global').emit('branchUpdated', eventData);

    // Send to specific branch
    this.server.to(`branch:${branch.id}`).emit('branchUpdated', eventData);

    // Send to admins and managers
    this.server.to('role:ADMIN').to('role:MANAGER').emit('branchUpdated', eventData);

    this.logger.log(`Branch updated event emitted: ${branch.name} (${branch.id})`);
  }

  // Emit branch deletion events
  emitBranchDeleted(branchId: string, branchName: string) {
    const eventData = {
      type: 'BRANCH_DELETED',
      branchId,
      branchName,
      timestamp: new Date().toISOString(),
    };

    // Send to global branch room
    this.server.to('branch:global').emit('branchDeleted', eventData);

    // Send to specific branch
    this.server.to(`branch:${branchId}`).emit('branchDeleted', eventData);

    // Send to admins and managers
    this.server.to('role:ADMIN').to('role:MANAGER').emit('branchDeleted', eventData);

    this.logger.log(`Branch deleted event emitted: ${branchName} (${branchId})`);
  }

  // Emit branch performance update events
  emitBranchPerformanceUpdate(performance: {
    branchId: string;
    branchName?: string;
    metrics: {
      totalOrders: number;
      completedOrders: number;
      cancelledOrders: number;
      totalRevenue: number;
      averageOrderValue: number;
      activeStaff: number;
      totalStaff: number;
      customerSatisfaction?: number;
    };
    period: 'hourly' | 'daily' | 'weekly' | 'monthly';
    periodStart: string;
    periodEnd: string;
  }) {
    const eventData = {
      type: 'BRANCH_PERFORMANCE_UPDATE',
      branchId: performance.branchId,
      branchName: performance.branchName,
      metrics: performance.metrics,
      period: performance.period,
      periodStart: performance.periodStart,
      periodEnd: performance.periodEnd,
      timestamp: new Date().toISOString(),
    };

    // Send to global branch room
    this.server.to('branch:global').emit('branchPerformanceUpdate', eventData);

    // Send to specific branch performance room
    this.server.to(`branch:performance:${performance.branchId}`).emit('branchPerformanceUpdate', eventData);

    // Send to specific branch
    this.server.to(`branch:${performance.branchId}`).emit('branchPerformanceUpdate', eventData);

    // Send to admins and managers
    this.server.to('role:ADMIN').to('role:MANAGER').emit('branchPerformanceUpdate', eventData);

    this.logger.log(`Branch performance update emitted: ${performance.branchName} - ${performance.period}`);
  }

  // Emit branch status change events
  emitBranchStatusChanged(branch: {
    id: string;
    name: string;
    isActive: boolean;
    previousStatus?: boolean;
    reason?: string;
  }) {
    const eventData = {
      type: 'BRANCH_STATUS_CHANGED',
      branchId: branch.id,
      branchName: branch.name,
      isActive: branch.isActive,
      previousStatus: branch.previousStatus,
      reason: branch.reason,
      timestamp: new Date().toISOString(),
    };

    // Send to global branch room
    this.server.to('branch:global').emit('branchStatusChanged', eventData);

    // Send to specific branch
    this.server.to(`branch:${branch.id}`).emit('branchStatusChanged', eventData);

    // Send to admins and managers
    this.server.to('role:ADMIN').to('role:MANAGER').emit('branchStatusChanged', eventData);

    this.logger.log(`Branch status changed event emitted: ${branch.name} - ${branch.isActive ? 'Active' : 'Inactive'}`);
  }

  // Emit branch sales milestone events
  emitBranchSalesMilestone(milestone: {
    branchId: string;
    branchName: string;
    milestoneType: 'DAILY_TARGET' | 'WEEKLY_TARGET' | 'MONTHLY_TARGET' | 'REVENUE_MILESTONE';
    target: number;
    achieved: number;
    percentage: number;
    period: string;
  }) {
    const eventData = {
      type: 'BRANCH_SALES_MILESTONE',
      branchId: milestone.branchId,
      branchName: milestone.branchName,
      milestoneType: milestone.milestoneType,
      target: milestone.target,
      achieved: milestone.achieved,
      percentage: milestone.percentage,
      period: milestone.period,
      timestamp: new Date().toISOString(),
    };

    // Send to specific branch
    this.server.to(`branch:${milestone.branchId}`).emit('branchSalesMilestone', eventData);

    // Send to admins and managers
    this.server.to('role:ADMIN').to('role:MANAGER').emit('branchSalesMilestone', eventData);

    this.logger.log(`Branch sales milestone emitted: ${milestone.branchName} - ${milestone.milestoneType} (${milestone.percentage}%)`);
  }

  // Emit branch alert events
  emitBranchAlert(alert: {
    branchId: string;
    branchName: string;
    alertType: 'LOW_PERFORMANCE' | 'HIGH_CANCELLATION_RATE' | 'STAFF_SHORTAGE' | 'INVENTORY_CRITICAL' | 'SYSTEM_ERROR';
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    data?: any;
  }) {
    const eventData = {
      type: 'BRANCH_ALERT',
      branchId: alert.branchId,
      branchName: alert.branchName,
      alertType: alert.alertType,
      severity: alert.severity,
      message: alert.message,
      data: alert.data,
      timestamp: new Date().toISOString(),
    };

    // Send to specific branch
    this.server.to(`branch:${alert.branchId}`).emit('branchAlert', eventData);

    // Send to admins and managers
    this.server.to('role:ADMIN').to('role:MANAGER').emit('branchAlert', eventData);

    this.logger.log(`Branch alert emitted: ${alert.branchName} - ${alert.alertType} (${alert.severity})`);
  }

  // Emit branch comparison events
  emitBranchComparison(comparison: {
    period: 'daily' | 'weekly' | 'monthly';
    branches: Array<{
      branchId: string;
      branchName: string;
      metrics: {
        orders: number;
        revenue: number;
        averageOrderValue: number;
        customerSatisfaction?: number;
      };
      rank: number;
    }>;
  }) {
    const eventData = {
      type: 'BRANCH_COMPARISON',
      period: comparison.period,
      branches: comparison.branches,
      timestamp: new Date().toISOString(),
    };

    // Send to global branch room
    this.server.to('branch:global').emit('branchComparison', eventData);

    // Send to each branch individually
    comparison.branches.forEach(branch => {
      this.server.to(`branch:${branch.branchId}`).emit('branchComparison', {
        ...eventData,
        yourBranch: branch,
      });
    });

    // Send to admins and managers
    this.server.to('role:ADMIN').to('role:MANAGER').emit('branchComparison', eventData);

    this.logger.log(`Branch comparison emitted: ${comparison.period} - ${comparison.branches.length} branches`);
  }

  // Utility methods
  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }

  getClientsByRole(role: string): AuthenticatedSocket[] {
    return Array.from(this.connectedClients.values()).filter(client => client.userRole === role);
  }

  getClientsByBranch(branchId: string): AuthenticatedSocket[] {
    return Array.from(this.connectedClients.values()).filter(client => client.branchId === branchId);
  }
}
