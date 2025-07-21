import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ReportsService, PopularItem, StaffPerformance, TimeSeriesData } from './reports.service';
import { 
  ReportQueryDto, 
  SalesReportQueryDto, 
  PopularItemsQueryDto, 
  StaffPerformanceQueryDto 
} from './dto/report-query.dto';

@ApiTags('reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ 
    summary: 'Get dashboard metrics',
    description: 'Get key performance indicators for today, this month, and this year'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Dashboard metrics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        today: {
          type: 'object',
          properties: {
            revenue: { type: 'number', example: 1250.50 },
            orders: { type: 'number', example: 25 },
            averageOrderValue: { type: 'number', example: 50.02 },
          },
        },
        thisMonth: {
          type: 'object',
          properties: {
            revenue: { type: 'number', example: 35000.00 },
            orders: { type: 'number', example: 750 },
            averageOrderValue: { type: 'number', example: 46.67 },
          },
        },
        thisYear: {
          type: 'object',
          properties: {
            revenue: { type: 'number', example: 420000.00 },
            orders: { type: 'number', example: 9000 },
            averageOrderValue: { type: 'number', example: 46.67 },
          },
        },
      },
    },
  })
  @ApiQuery({ name: 'branchId', required: false, description: 'Filter by branch ID' })
  async getDashboardMetrics(@Query('branchId') branchId?: string) {
    return this.reportsService.getDashboardMetrics(branchId);
  }

  @Get('sales')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ 
    summary: 'Get sales report',
    description: 'Generate comprehensive sales report with revenue, order metrics, and optional breakdowns'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Sales report generated successfully',
    schema: {
      type: 'object',
      properties: {
        period: { type: 'string', example: 'this_month' },
        dateRange: {
          type: 'object',
          properties: {
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
          },
        },
        metrics: {
          type: 'object',
          properties: {
            totalRevenue: { type: 'number', example: 35000.00 },
            totalOrders: { type: 'number', example: 750 },
            averageOrderValue: { type: 'number', example: 46.67 },
            totalItems: { type: 'number', example: 2250 },
            completedOrders: { type: 'number', example: 720 },
            cancelledOrders: { type: 'number', example: 30 },
            cancellationRate: { type: 'number', example: 4.0 },
          },
        },
        paymentMethods: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              method: { type: 'string', example: 'CASH' },
              count: { type: 'number', example: 450 },
              totalAmount: { type: 'number', example: 21000.00 },
              percentage: { type: 'number', example: 60.0 },
            },
          },
        },
        timeSeries: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              period: { type: 'string', example: '2024-01-15' },
              revenue: { type: 'number', example: 1200.00 },
              orders: { type: 'number', example: 25 },
              items: { type: 'number', example: 75 },
              averageOrderValue: { type: 'number', example: 48.00 },
            },
          },
        },
      },
    },
  })
  async getSalesReport(@Query() query: SalesReportQueryDto) {
    return this.reportsService.getSalesReport(query);
  }

  @Get('popular-items')
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  @ApiOperation({ 
    summary: 'Get popular items report',
    description: 'Get the most popular menu items by quantity sold or revenue generated'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Popular items report generated successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          menuItemId: { type: 'string', example: 'menu-1' },
          name: { type: 'string', example: 'Margherita Pizza' },
          category: { type: 'string', example: 'Pizza' },
          quantitySold: { type: 'number', example: 150 },
          revenue: { type: 'number', example: 2250.00 },
          averagePrice: { type: 'number', example: 15.00 },
          orderCount: { type: 'number', example: 120 },
        },
      },
    },
  })

  async getPopularItems(@Query() query: PopularItemsQueryDto): Promise<PopularItem[]> {
    return this.reportsService.getPopularItems(query);
  }

  @Get('staff-performance')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ 
    summary: 'Get staff performance report',
    description: 'Analyze staff performance metrics including sales, order count, and efficiency'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Staff performance report generated successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          staffId: { type: 'string', example: 'staff-1' },
          staffName: { type: 'string', example: 'John Doe' },
          totalSales: { type: 'number', example: 15000.00 },
          orderCount: { type: 'number', example: 300 },
          averageOrderValue: { type: 'number', example: 50.00 },
          totalItems: { type: 'number', example: 900 },
          workingDays: { type: 'number', example: 22 },
          salesPerDay: { type: 'number', example: 681.82 },
        },
      },
    },
  })
  async getStaffPerformance(@Query() query: StaffPerformanceQueryDto): Promise<StaffPerformance[]> {
    return this.reportsService.getStaffPerformance(query);
  }

  @Get('inventory')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ 
    summary: 'Get inventory report',
    description: 'Get inventory overview with stock levels, alerts, and valuation'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Inventory report generated successfully',
    schema: {
      type: 'object',
      properties: {
        summary: {
          type: 'object',
          properties: {
            totalItems: { type: 'number', example: 150 },
            totalValue: { type: 'number', example: 25000.00 },
            lowStockCount: { type: 'number', example: 12 },
            outOfStockCount: { type: 'number', example: 3 },
            expiringCount: { type: 'number', example: 5 },
          },
        },
        alerts: {
          type: 'object',
          properties: {
            lowStock: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  ingredient: { type: 'string', example: 'Tomatoes' },
                  category: { type: 'string', example: 'Vegetables' },
                  currentQuantity: { type: 'number', example: 5 },
                  minQuantity: { type: 'number', example: 10 },
                  branch: { type: 'string', example: 'Main Branch' },
                },
              },
            },
            outOfStock: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  ingredient: { type: 'string', example: 'Mozzarella' },
                  category: { type: 'string', example: 'Dairy' },
                  branch: { type: 'string', example: 'Main Branch' },
                },
              },
            },
            expiring: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  ingredient: { type: 'string', example: 'Fresh Basil' },
                  category: { type: 'string', example: 'Herbs' },
                  quantity: { type: 'number', example: 2 },
                  expiryDate: { type: 'string', format: 'date-time' },
                  daysUntilExpiry: { type: 'number', example: 3 },
                  branch: { type: 'string', example: 'Main Branch' },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiQuery({ name: 'branchId', required: false, description: 'Filter by branch ID' })
  async getInventoryReport(@Query('branchId') branchId?: string) {
    return this.reportsService.getInventoryReport(branchId);
  }

  @Get('time-series')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ 
    summary: 'Get time series data',
    description: 'Get sales data grouped by time periods (hour, day, week, month)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Time series data retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          period: { type: 'string', example: '2024-01-15' },
          revenue: { type: 'number', example: 1200.00 },
          orders: { type: 'number', example: 25 },
          items: { type: 'number', example: 75 },
          averageOrderValue: { type: 'number', example: 48.00 },
        },
      },
    },
  })
  async getTimeSeriesData(@Query() query: ReportQueryDto): Promise<TimeSeriesData[]> {
    return this.reportsService.getTimeSeriesData(query);
  }
}
