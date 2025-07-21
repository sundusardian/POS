import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { CreateStockMovementDto } from './dto/stock-movement.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Roles(Role.ADMIN, Role.MANAGER)
  @Post()
  async create(@Body() createStockDto: CreateStockDto) {
    return this.stockService.create(createStockDto);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  @Get()
  async findAll(@Query('branchId') branchId?: string) {
    return this.stockService.findAll(branchId);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  @Get('alerts/low-stock')
  async getLowStockAlerts(@Query('branchId') branchId?: string) {
    return this.stockService.getLowStockAlerts(branchId);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  @Get('alerts/expiring')
  async getExpiringStock(
    @Query('branchId') branchId?: string,
    @Query('daysAhead') daysAhead?: string,
  ) {
    const days = daysAhead ? parseInt(daysAhead, 10) : 7;
    return this.stockService.getExpiringStock(branchId, days);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.stockService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  @Get(':id/movements')
  async getStockMovements(@Param('id') id: string) {
    return this.stockService.getStockMovements(id);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Patch(':id/quantity')
  async updateQuantity(
    @Param('id') id: string,
    @Body() body: { quantity: number; userId?: string },
  ) {
    return this.stockService.updateQuantity(id, body.quantity, body.userId);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  @Post('movements')
  @HttpCode(HttpStatus.CREATED)
  async createMovement(@Body() createStockMovementDto: CreateStockMovementDto) {
    return this.stockService.createStockMovement(createStockMovementDto);
  }
}
