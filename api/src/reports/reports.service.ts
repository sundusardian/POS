import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  ReportQueryDto, 
  SalesReportQueryDto, 
  PopularItemsQueryDto, 
  StaffPerformanceQueryDto,
  ReportPeriod 
} from './dto/report-query.dto';
import { Prisma } from '@prisma/client';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface SalesMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalItems: number;
  completedOrders: number;
  cancelledOrders: number;
  cancellationRate: number;
}

export interface PaymentMethodBreakdown {
  method: string;
  count: number;
  totalAmount: number;
  percentage: number;
}

export interface PopularItem {
  menuItemId: string;
  name: string;
  category: string;
  quantitySold: number;
  revenue: number;
  averagePrice: number;
  orderCount: number;
}

export interface StaffPerformance {
  staffId: string;
  staffName: string;
  totalSales: number;
  orderCount: number;
  averageOrderValue: number;
  totalItems: number;
  workingDays: number;
  salesPerDay: number;
}

export interface TimeSeriesData {
  period: string;
  revenue: number;
  orders: number;
  items: number;
  averageOrderValue: number;
}

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  private getDateRange(query: ReportQueryDto): DateRange {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = new Date(now);

    if (query.period === ReportPeriod.CUSTOM) {
      if (!query.startDate || !query.endDate) {
        throw new Error('Start date and end date are required for custom period');
      }
      startDate = new Date(query.startDate);
      endDate = new Date(query.endDate);
    } else {
      switch (query.period) {
        case ReportPeriod.TODAY:
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
          break;
        case ReportPeriod.YESTERDAY:
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          startDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
          endDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59);
          break;
        case ReportPeriod.THIS_WEEK:
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay());
          startDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate());
          break;
        case ReportPeriod.LAST_WEEK:
          const lastWeekStart = new Date(now);
          lastWeekStart.setDate(now.getDate() - now.getDay() - 7);
          startDate = new Date(lastWeekStart.getFullYear(), lastWeekStart.getMonth(), lastWeekStart.getDate());
          const lastWeekEnd = new Date(lastWeekStart);
          lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
          endDate = new Date(lastWeekEnd.getFullYear(), lastWeekEnd.getMonth(), lastWeekEnd.getDate(), 23, 59, 59);
          break;
        case ReportPeriod.THIS_MONTH:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case ReportPeriod.LAST_MONTH:
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          startDate = lastMonth;
          endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
          break;
        case ReportPeriod.THIS_YEAR:
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          // Default to last 30 days
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 30);
      }
    }

    return { startDate, endDate };
  }

  private buildOrderWhereClause(query: ReportQueryDto): Prisma.OrderWhereInput {
    const { startDate, endDate } = this.getDateRange(query);
    
    const where: Prisma.OrderWhereInput = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (query.branchId) {
      where.branchId = query.branchId;
    }

    if (query.staffId) {
      where.staffId = query.staffId;
    }

    return where;
  }

  async getSalesReport(query: SalesReportQueryDto) {
    const where = this.buildOrderWhereClause(query);
    
    // Get basic sales metrics
    const orders = await this.prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            menuItem: {
              include: {
                category: true,
              },
            },
          },
        },
        payment: true,
        staff: {
          select: {
            id: true,
            name: true,
          },
        },
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const completedOrders = orders.filter(order => order.status === 'COMPLETED');
    const cancelledOrders = orders.filter(order => order.status === 'CANCELLED');

    const totalRevenue = completedOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const totalItems = completedOrders.reduce((sum, order) => 
      sum + order.orderItems.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    const metrics: SalesMetrics = {
      totalRevenue,
      totalOrders: orders.length,
      averageOrderValue: completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0,
      totalItems,
      completedOrders: completedOrders.length,
      cancelledOrders: cancelledOrders.length,
      cancellationRate: orders.length > 0 ? (cancelledOrders.length / orders.length) * 100 : 0,
    };

    const result: any = {
      period: query.period || 'custom',
      dateRange: this.getDateRange(query),
      metrics,
    };

    // Include payment method breakdown if requested
    if (query.includePaymentMethods) {
      const payments = completedOrders
        .filter(order => order.payment)
        .map(order => order.payment!);

      const paymentBreakdown: PaymentMethodBreakdown[] = [];
      const paymentMethods = [...new Set(payments.map(p => p.paymentMethod))];

      for (const method of paymentMethods) {
        const methodPayments = payments.filter(p => p.paymentMethod === method);
        const totalAmount = methodPayments.reduce((sum, p) => sum + Number(p.paidAmount), 0);
        
        paymentBreakdown.push({
          method,
          count: methodPayments.length,
          totalAmount,
          percentage: totalRevenue > 0 ? (totalAmount / totalRevenue) * 100 : 0,
        });
      }

      result.paymentMethods = paymentBreakdown;
    }

    // Include detailed order breakdown if requested
    if (query.includeOrderDetails) {
      result.orders = orders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: Number(order.totalAmount),
        itemCount: order.orderItems.reduce((sum, item) => sum + item.quantity, 0),
        createdAt: order.createdAt,
        staff: order.staff,
        branch: order.branch,
        paymentMethod: order.payment?.paymentMethod,
      }));
    }

    // Add time series data if groupBy is specified
    if (query.groupBy) {
      result.timeSeries = await this.getTimeSeriesData(query);
    }

    return result;
  }

  async getPopularItems(query: PopularItemsQueryDto): Promise<PopularItem[]> {
    const where = this.buildOrderWhereClause(query);
    
    const orderItems = await this.prisma.orderItem.findMany({
      where: {
        order: {
          ...where,
          status: 'COMPLETED',
        },
      },
      include: {
        menuItem: {
          include: {
            category: true,
          },
        },
      },
    });

    // Group by menu item and calculate metrics
    const itemMetrics = new Map<string, {
      menuItem: any;
      quantitySold: number;
      revenue: number;
      orderCount: number;
    }>();

    orderItems.forEach(item => {
      const key = item.menuItem.id;
      const existing = itemMetrics.get(key);
      
      if (existing) {
        existing.quantitySold += item.quantity;
        existing.revenue += Number(item.totalPrice);
        existing.orderCount += 1;
      } else {
        itemMetrics.set(key, {
          menuItem: item.menuItem,
          quantitySold: item.quantity,
          revenue: Number(item.totalPrice),
          orderCount: 1,
        });
      }
    });

    // Convert to array and sort
    const popularItems: PopularItem[] = Array.from(itemMetrics.values()).map(item => ({
      menuItemId: item.menuItem.id,
      name: item.menuItem.name,
      category: item.menuItem.category.name,
      quantitySold: item.quantitySold,
      revenue: item.revenue,
      averagePrice: item.revenue / item.quantitySold,
      orderCount: item.orderCount,
    }));

    // Sort by specified criteria
    popularItems.sort((a, b) => {
      if (query.sortBy === 'revenue') {
        return b.revenue - a.revenue;
      }
      return b.quantitySold - a.quantitySold;
    });

    return popularItems.slice(0, query.limit || 10);
  }

  async getStaffPerformance(query: StaffPerformanceQueryDto): Promise<StaffPerformance[]> {
    const where = this.buildOrderWhereClause(query);
    const { startDate, endDate } = this.getDateRange(query);
    
    const orders = await this.prisma.order.findMany({
      where: {
        ...where,
        status: 'COMPLETED',
      },
      include: {
        orderItems: true,
        staff: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Group by staff member
    const staffMetrics = new Map<string, {
      staff: any;
      orders: any[];
      totalSales: number;
      totalItems: number;
    }>();

    orders.forEach(order => {
      if (!order.staff) return;
      
      const key = order.staff.id;
      const existing = staffMetrics.get(key);
      const orderTotal = Number(order.totalAmount);
      const itemCount = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
      
      if (existing) {
        existing.orders.push(order);
        existing.totalSales += orderTotal;
        existing.totalItems += itemCount;
      } else {
        staffMetrics.set(key, {
          staff: order.staff,
          orders: [order],
          totalSales: orderTotal,
          totalItems: itemCount,
        });
      }
    });

    // Calculate working days in the period
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const workingDays = Math.min(daysDiff, 30); // Cap at 30 days for realistic calculation

    // Convert to performance metrics
    const performance: StaffPerformance[] = Array.from(staffMetrics.values()).map(staff => ({
      staffId: staff.staff.id,
      staffName: staff.staff.name,
      totalSales: staff.totalSales,
      orderCount: staff.orders.length,
      averageOrderValue: staff.totalSales / staff.orders.length,
      totalItems: staff.totalItems,
      workingDays,
      salesPerDay: staff.totalSales / workingDays,
    }));

    // Sort by specified criteria
    performance.sort((a, b) => {
      switch (query.sortBy) {
        case 'order_count':
          return b.orderCount - a.orderCount;
        case 'average_order_value':
          return b.averageOrderValue - a.averageOrderValue;
        default:
          return b.totalSales - a.totalSales;
      }
    });

    return performance;
  }

  async getTimeSeriesData(query: ReportQueryDto): Promise<TimeSeriesData[]> {
    const where = this.buildOrderWhereClause(query);
    const { startDate, endDate } = this.getDateRange(query);
    
    // This is a simplified implementation - in production, you might want to use raw SQL
    // for better performance with large datasets
    const orders = await this.prisma.order.findMany({
      where: {
        ...where,
        status: 'COMPLETED',
      },
      include: {
        orderItems: true,
      },
    });

    // Group orders by time period
    const timeGroups = new Map<string, {
      orders: any[];
      revenue: number;
      items: number;
    }>();

    orders.forEach(order => {
      let periodKey: string;
      const orderDate = new Date(order.createdAt);
      
      switch (query.groupBy) {
        case 'hour':
          periodKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}-${String(orderDate.getDate()).padStart(2, '0')} ${String(orderDate.getHours()).padStart(2, '0')}:00`;
          break;
        case 'day':
          periodKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}-${String(orderDate.getDate()).padStart(2, '0')}`;
          break;
        case 'week':
          const weekStart = new Date(orderDate);
          weekStart.setDate(orderDate.getDate() - orderDate.getDay());
          periodKey = `Week of ${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`;
          break;
        case 'month':
          periodKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
          break;
        default:
          periodKey = orderDate.toISOString().split('T')[0];
      }

      const existing = timeGroups.get(periodKey);
      const revenue = Number(order.totalAmount);
      const items = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
      
      if (existing) {
        existing.orders.push(order);
        existing.revenue += revenue;
        existing.items += items;
      } else {
        timeGroups.set(periodKey, {
          orders: [order],
          revenue,
          items,
        });
      }
    });

    // Convert to time series data
    const timeSeries: TimeSeriesData[] = Array.from(timeGroups.entries()).map(([period, data]) => ({
      period,
      revenue: data.revenue,
      orders: data.orders.length,
      items: data.items,
      averageOrderValue: data.revenue / data.orders.length,
    }));

    // Sort by period
    timeSeries.sort((a, b) => a.period.localeCompare(b.period));

    return timeSeries;
  }

  async getDashboardMetrics(branchId?: string) {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const baseWhere: Prisma.OrderWhereInput = branchId ? { branchId } : {};

    // Today's metrics
    const todayOrders = await this.prisma.order.findMany({
      where: {
        ...baseWhere,
        createdAt: { gte: startOfDay },
        status: 'COMPLETED',
      },
    });

    // This month's metrics
    const monthOrders = await this.prisma.order.findMany({
      where: {
        ...baseWhere,
        createdAt: { gte: startOfMonth },
        status: 'COMPLETED',
      },
    });

    // This year's metrics
    const yearOrders = await this.prisma.order.findMany({
      where: {
        ...baseWhere,
        createdAt: { gte: startOfYear },
        status: 'COMPLETED',
      },
    });

    const todayRevenue = todayOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const monthRevenue = monthOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const yearRevenue = yearOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

    return {
      today: {
        revenue: todayRevenue,
        orders: todayOrders.length,
        averageOrderValue: todayOrders.length > 0 ? todayRevenue / todayOrders.length : 0,
      },
      thisMonth: {
        revenue: monthRevenue,
        orders: monthOrders.length,
        averageOrderValue: monthOrders.length > 0 ? monthRevenue / monthOrders.length : 0,
      },
      thisYear: {
        revenue: yearRevenue,
        orders: yearOrders.length,
        averageOrderValue: yearOrders.length > 0 ? yearRevenue / yearOrders.length : 0,
      },
    };
  }

  async getInventoryReport(branchId?: string) {
    const where: Prisma.StockWhereInput = branchId ? { branchId } : {};

    const stocks = await this.prisma.stock.findMany({
      where,
      include: {
        ingredient: true,
        branch: true,
      },
    });

    const totalValue = stocks.reduce((sum, stock) => {
      const value = Number(stock.quantity) * Number(stock.unitCost || 0);
      return sum + value;
    }, 0);

    const lowStockItems = stocks.filter(stock => 
      Number(stock.quantity) <= Number(stock.minQuantity)
    );

    const outOfStockItems = stocks.filter(stock => Number(stock.quantity) === 0);

    const expiringItems = stocks.filter(stock => {
      if (!stock.expiryDate) return false;
      const daysUntilExpiry = Math.ceil(
        (new Date(stock.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
    });

    return {
      summary: {
        totalItems: stocks.length,
        totalValue,
        lowStockCount: lowStockItems.length,
        outOfStockCount: outOfStockItems.length,
        expiringCount: expiringItems.length,
      },
      alerts: {
        lowStock: lowStockItems.map(stock => ({
          id: stock.id,
          ingredient: stock.ingredient.name,
          category: 'N/A', // Category not available in current schema
          currentQuantity: Number(stock.quantity),
          minQuantity: Number(stock.minQuantity),
          branch: stock.branch.name,
        })),
        outOfStock: outOfStockItems.map(stock => ({
          id: stock.id,
          ingredient: stock.ingredient.name,
          category: 'N/A', // Category not available in current schema
          branch: stock.branch.name,
        })),
        expiring: expiringItems.map(stock => ({
          id: stock.id,
          ingredient: stock.ingredient.name,
          category: 'N/A', // Category not available in current schema
          quantity: Number(stock.quantity),
          expiryDate: stock.expiryDate,
          daysUntilExpiry: Math.ceil(
            (new Date(stock.expiryDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          ),
          branch: stock.branch.name,
        })),
      },
    };
  }
}
