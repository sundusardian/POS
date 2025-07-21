import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsEnum, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export enum ReportPeriod {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  THIS_WEEK = 'this_week',
  LAST_WEEK = 'last_week',
  THIS_MONTH = 'this_month',
  LAST_MONTH = 'last_month',
  THIS_YEAR = 'this_year',
  CUSTOM = 'custom',
}

export enum ReportType {
  SALES = 'sales',
  REVENUE = 'revenue',
  ORDERS = 'orders',
  INVENTORY = 'inventory',
  STAFF_PERFORMANCE = 'staff_performance',
  POPULAR_ITEMS = 'popular_items',
}

export class ReportQueryDto {
  @ApiPropertyOptional({
    enum: ReportPeriod,
    description: 'Predefined time period for the report',
    example: ReportPeriod.THIS_MONTH,
  })
  @IsOptional()
  @IsEnum(ReportPeriod)
  period?: ReportPeriod;

  @ApiPropertyOptional({
    description: 'Custom start date (ISO string)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Custom end date (ISO string)',
    example: '2024-12-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Filter by specific branch ID',
    example: 'branch-1',
  })
  @IsOptional()
  @IsString()
  branchId?: string;

  @ApiPropertyOptional({
    description: 'Filter by specific staff member ID',
    example: 'staff-1',
  })
  @IsOptional()
  @IsString()
  staffId?: string;

  @ApiPropertyOptional({
    description: 'Group results by time interval',
    enum: ['hour', 'day', 'week', 'month'],
    example: 'day',
  })
  @IsOptional()
  @IsEnum(['hour', 'day', 'week', 'month'])
  groupBy?: 'hour' | 'day' | 'week' | 'month';
}

export class SalesReportQueryDto extends ReportQueryDto {
  @ApiPropertyOptional({
    description: 'Include detailed order breakdown',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  includeOrderDetails?: boolean;

  @ApiPropertyOptional({
    description: 'Include payment method breakdown',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  includePaymentMethods?: boolean;
}

export class PopularItemsQueryDto extends ReportQueryDto {
  @ApiPropertyOptional({
    description: 'Number of top items to return',
    example: 10,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Sort by quantity or revenue',
    enum: ['quantity', 'revenue'],
    example: 'quantity',
  })
  @IsOptional()
  @IsEnum(['quantity', 'revenue'])
  sortBy?: 'quantity' | 'revenue' = 'quantity';
}

export class StaffPerformanceQueryDto extends ReportQueryDto {
  @ApiPropertyOptional({
    description: 'Include detailed metrics per staff member',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  includeDetails?: boolean;

  @ApiPropertyOptional({
    description: 'Sort by total sales, order count, or average order value',
    enum: ['total_sales', 'order_count', 'average_order_value'],
    example: 'total_sales',
  })
  @IsOptional()
  @IsEnum(['total_sales', 'order_count', 'average_order_value'])
  sortBy?: 'total_sales' | 'order_count' | 'average_order_value' = 'total_sales';
}
