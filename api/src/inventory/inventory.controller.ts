import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @ApiOperation({ summary: 'Get inventory overview dashboard' })
  @ApiBearerAuth('JWT-auth')
  @ApiQuery({ name: 'branchId', required: false, description: 'Filter by branch ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Inventory overview retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalIngredients: { type: 'number' },
        lowStockItems: { type: 'number' },
        expiringItems: { type: 'number' },
        totalStockValue: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Roles(Role.ADMIN, Role.MANAGER)
  @Get('overview')
  async getOverview(@Query('branchId') branchId?: string) {
    return this.inventoryService.getInventoryOverview(branchId);
  }

  @ApiOperation({ summary: 'Get detailed inventory report' })
  @ApiBearerAuth('JWT-auth')
  @ApiQuery({ name: 'branchId', required: false, description: 'Filter by branch ID' })
  @ApiResponse({ status: 200, description: 'Inventory report retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Roles(Role.ADMIN, Role.MANAGER)
  @Get('report')
  async getReport(@Query('branchId') branchId?: string) {
    return this.inventoryService.getInventoryReport(branchId);
  }
}
