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

interface DashboardMetrics {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  activeStaff: number;
  totalStaff: number;
  activeBranches: number;
  totalBranches: number;
  lowStockItems: number;
  criticalAlerts: number;
}

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:8081'],
    credentials: true,
  },
  namespace: '/dashboard',
})
export class DashboardUpdatesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(DashboardUpdatesGateway.name);
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

      this.logger.log(`Client ${client.id} connected to dashboard updates - User: ${client.userId}, Role: ${client.userRole}`);
      
      client.emit('connected', {
        message: 'Connected to dashboard updates',
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
    this.logger.log(`Client ${client.id} disconnected from dashboard updates`);
  }

  @SubscribeMessage('joinDashboardRoom')
  async handleJoinDashboardRoom(
    @MessageBody() data: { branchId?: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const room = data.branchId ? `dashboard:branch:${data.branchId}` : 'dashboard:global';
    await client.join(room);
    client.emit('joinedDashboardRoom', { room });
    this.logger.log(`Client ${client.id} joined dashboard room: ${room}`);
  }

  @SubscribeMessage('leaveDashboardRoom')
  async handleLeaveDashboardRoom(
    @MessageBody() data: { branchId?: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const room = data.branchId ? `dashboard:branch:${data.branchId}` : 'dashboard:global';
    await client.leave(room);
    client.emit('leftDashboardRoom', { room });
    this.logger.log(`Client ${client.id} left dashboard room: ${room}`);
  }

  // Emit dashboard metrics update events
  emitDashboardMetricsUpdate(metrics: DashboardMetrics, branchId?: string) {
    const eventData = {
      type: 'DASHBOARD_METRICS_UPDATE',
      metrics,
      branchId,
      timestamp: new Date().toISOString(),
    };

    // Send to global dashboard room
    this.server.to('dashboard:global').emit('dashboardMetricsUpdate', eventData);

    // Send to specific branch dashboard if applicable
    if (branchId) {
      this.server.to(`dashboard:branch:${branchId}`).emit('dashboardMetricsUpdate', eventData);
      this.server.to(`branch:${branchId}`).emit('dashboardMetricsUpdate', eventData);
    }

    // Send to admins and managers
    this.server.to('role:ADMIN').to('role:MANAGER').emit('dashboardMetricsUpdate', eventData);

    this.logger.log(`Dashboard metrics update emitted${branchId ? ` for branch ${branchId}` : ' globally'}`);
  }

  // Emit real-time stats update events
  emitRealtimeStatsUpdate(update: {
    type: 'totalOrders' | 'activeOrders' | 'completedOrders' | 'cancelledOrders' | 'totalRevenue' | 'averageOrderValue' | 'activeStaff';
    value: number;
    change?: number;
    percentage?: number;
    branchId?: string;
  }) {
    const eventData = {
      type: 'REALTIME_STATS_UPDATE',
      statType: update.type,
      value: update.value,
      change: update.change,
      percentage: update.percentage,
      branchId: update.branchId,
      timestamp: new Date().toISOString(),
    };

    // Send to global dashboard room
    this.server.to('dashboard:global').emit('realtimeStatsUpdate', eventData);

    // Send to specific branch dashboard if applicable
    if (update.branchId) {
      this.server.to(`dashboard:branch:${update.branchId}`).emit('realtimeStatsUpdate', eventData);
      this.server.to(`branch:${update.branchId}`).emit('realtimeStatsUpdate', eventData);
    }

    // Send to admins and managers
    this.server.to('role:ADMIN').to('role:MANAGER').emit('realtimeStatsUpdate', eventData);

    this.logger.log(`Realtime stats update emitted: ${update.type} = ${update.value}${update.branchId ? ` for branch ${update.branchId}` : ''}`);
  }

  // Emit system health update events
  emitSystemHealthUpdate(health: {
    status: 'healthy' | 'warning' | 'critical';
    uptime: number;
    connectedClients: number;
    activeConnections: number;
    memoryUsage: number;
    cpuUsage: number;
    databaseStatus: 'connected' | 'disconnected' | 'slow';
    lastBackup?: string;
    alerts: Array<{
      type: string;
      message: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
    }>;
  }) {
    const eventData = {
      type: 'SYSTEM_HEALTH_UPDATE',
      health,
      timestamp: new Date().toISOString(),
    };

    // Send to admins only
    this.server.to('role:ADMIN').emit('systemHealthUpdate', eventData);

    this.logger.log(`System health update emitted: ${health.status}`);
  }

  // Emit dashboard alert events
  emitDashboardAlert(alert: {
    alertType: 'SYSTEM_ERROR' | 'HIGH_LOAD' | 'LOW_PERFORMANCE' | 'SECURITY_BREACH' | 'DATA_ANOMALY' | 'CRITICAL_THRESHOLD';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    message: string;
    data?: any;
    branchId?: string;
    requiresAction?: boolean;
    actionUrl?: string;
  }) {
    const eventData = {
      type: 'DASHBOARD_ALERT',
      alertType: alert.alertType,
      severity: alert.severity,
      title: alert.title,
      message: alert.message,
      data: alert.data,
      branchId: alert.branchId,
      requiresAction: alert.requiresAction,
      actionUrl: alert.actionUrl,
      timestamp: new Date().toISOString(),
    };

    // Send to global dashboard room
    this.server.to('dashboard:global').emit('dashboardAlert', eventData);

    // Send to specific branch dashboard if applicable
    if (alert.branchId) {
      this.server.to(`dashboard:branch:${alert.branchId}`).emit('dashboardAlert', eventData);
      this.server.to(`branch:${alert.branchId}`).emit('dashboardAlert', eventData);
    }

    // Send to admins and managers
    this.server.to('role:ADMIN').to('role:MANAGER').emit('dashboardAlert', eventData);

    this.logger.log(`Dashboard alert emitted: ${alert.alertType} - ${alert.title} (${alert.severity})`);
  }

  // Emit performance summary events
  emitPerformanceSummary(summary: {
    period: 'hourly' | 'daily' | 'weekly' | 'monthly';
    periodStart: string;
    periodEnd: string;
    metrics: {
      totalOrders: number;
      totalRevenue: number;
      averageOrderValue: number;
      topSellingItems: Array<{
        itemId: string;
        itemName: string;
        quantity: number;
        revenue: number;
      }>;
      branchPerformance: Array<{
        branchId: string;
        branchName: string;
        orders: number;
        revenue: number;
        rank: number;
      }>;
      staffPerformance: Array<{
        staffId: string;
        staffName: string;
        ordersServed: number;
        totalSales: number;
        rank: number;
      }>;
    };
    branchId?: string;
  }) {
    const eventData = {
      type: 'PERFORMANCE_SUMMARY',
      period: summary.period,
      periodStart: summary.periodStart,
      periodEnd: summary.periodEnd,
      metrics: summary.metrics,
      branchId: summary.branchId,
      timestamp: new Date().toISOString(),
    };

    // Send to global dashboard room
    this.server.to('dashboard:global').emit('performanceSummary', eventData);

    // Send to specific branch dashboard if applicable
    if (summary.branchId) {
      this.server.to(`dashboard:branch:${summary.branchId}`).emit('performanceSummary', eventData);
      this.server.to(`branch:${summary.branchId}`).emit('performanceSummary', eventData);
    }

    // Send to admins and managers
    this.server.to('role:ADMIN').to('role:MANAGER').emit('performanceSummary', eventData);

    this.logger.log(`Performance summary emitted: ${summary.period}${summary.branchId ? ` for branch ${summary.branchId}` : ' globally'}`);
  }

  // Emit notification events
  emitNotification(notification: {
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
    title: string;
    message: string;
    targetRole?: string;
    targetUser?: string;
    branchId?: string;
    persistent?: boolean;
    actionUrl?: string;
    data?: any;
  }) {
    const eventData = {
      type: 'NOTIFICATION',
      notificationType: notification.type,
      title: notification.title,
      message: notification.message,
      persistent: notification.persistent,
      actionUrl: notification.actionUrl,
      data: notification.data,
      timestamp: new Date().toISOString(),
    };

    // Send to specific user if specified
    if (notification.targetUser) {
      const targetClients = Array.from(this.connectedClients.values())
        .filter(client => client.userId === notification.targetUser);
      targetClients.forEach(client => {
        client.emit('notification', eventData);
      });
    }
    // Send to specific role if specified
    else if (notification.targetRole) {
      this.server.to(`role:${notification.targetRole}`).emit('notification', eventData);
    }
    // Send to specific branch if specified
    else if (notification.branchId) {
      this.server.to(`branch:${notification.branchId}`).emit('notification', eventData);
    }
    // Send to all dashboard users
    else {
      this.server.to('dashboard:global').emit('notification', eventData);
    }

    this.logger.log(`Notification emitted: ${notification.title} (${notification.type})`);
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

  // Method to broadcast current metrics to all connected dashboard clients
  broadcastCurrentMetrics(metrics: DashboardMetrics) {
    this.emitDashboardMetricsUpdate(metrics);
  }

  // Method to get dashboard statistics
  getDashboardStats() {
    const totalClients = this.connectedClients.size;
    const clientsByRole = {
      ADMIN: this.getClientsByRole('ADMIN').length,
      MANAGER: this.getClientsByRole('MANAGER').length,
      STAFF: this.getClientsByRole('STAFF').length,
    };

    return {
      totalConnectedClients: totalClients,
      clientsByRole,
      timestamp: new Date().toISOString(),
    };
  }
}
