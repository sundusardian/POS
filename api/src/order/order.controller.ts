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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid order data' })
  @ApiResponse({ status: 404, description: 'Branch or menu item not found' })
  @Public()
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @ApiOperation({ summary: 'Get all orders with optional filtering' })
  @ApiBearerAuth('JWT-auth')
  @ApiQuery({ name: 'branchId', required: false, description: 'Filter by branch ID' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by order status' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  @Get()
  async findAll(
    @Query('branchId') branchId?: string,
    @Query('status') status?: string,
  ) {
    return this.orderService.findAll(branchId, status);
  }

  @ApiOperation({ summary: 'Get order by ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancel(@Param('id') id: string) {
    return this.orderService.cancel(id);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  @Post('payment')
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.orderService.createPayment(createPaymentDto);
  }

  @ApiOperation({ summary: 'Get orders for a specific desk (for customer viewing)' })
  @ApiParam({ name: 'deskId', description: 'Desk ID' })
  @ApiResponse({ status: 200, description: 'Desk orders retrieved successfully' })
  @Public()
  @Get('desk/:deskId')
  async getOrdersByDesk(@Param('deskId') deskId: string) {
    return this.orderService.getOrdersByDesk(deskId);
  }
}
