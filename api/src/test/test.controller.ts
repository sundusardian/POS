import { Controller, Post, Patch, Body, Param, UseGuards, Get } from '@nestjs/common';
import { OrderService } from '../order/order.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOrderDto } from '../order/dto/create-order.dto';
import { UpdateOrderDto, OrderStatus } from '../order/dto/update-order.dto';
import { CreatePaymentDto, PaymentMethod } from '../order/dto/create-payment.dto';
import { User, JwtUser } from '../auth/decorators/user.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Controller('/test')
@UseGuards(JwtAuthGuard)
export class TestController {
  constructor(
    private readonly orderService: OrderService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('orders')
  async createTestOrder(@Body() body: any) {
    // Adapt payload from test client to real DTO
    const dto: CreateOrderDto = {
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      deskId: body.deskId,
      branchId: body.branchId,
      staffId: body.staffId,
      items: (body.orderItems || body.items || []).map((item: any) => ({
        menuItemId: item.menuItemId,
        quantity: Number(item.quantity),
        notes: item.notes || '',
      })),
      notes: body.notes || '',
    };
    return this.orderService.create(dto);
  }

  @Patch('orders/:id')
  async updateTestOrder(@Param('id') id: string, @Body() body: any) {
    // Adapt payload for order update
    const updateDto: UpdateOrderDto = {
      status: body.status,
      notes: body.notes,
    };
    return this.orderService.update(id, updateDto);
  }

  @Post('orders/:id/cancel')
  async cancelTestOrder(@Param('id') id: string) {
    return this.orderService.cancel(id);
  }

  @Post('orders/payment')
  async testPayment(@Body() body: any) {
    const paymentDto: CreatePaymentDto = {
      orderId: body.orderId,
      paidAmount: Number(body.paidAmount),
      paymentMethod: body.paymentMethod as PaymentMethod || PaymentMethod.CASH,
      receiptNumber: body.receiptNumber,
    };
    return this.orderService.createPayment(paymentDto);
  }

  // Additional test endpoints for better testing
  @Get('orders')
  async getAllTestOrders(@User() user?: JwtUser) {
    return this.orderService.findAll(undefined, undefined, user);
  }

  @Get('orders/:id')
  async getTestOrder(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Post('orders/:id/complete')
  async completeTestOrder(@Param('id') id: string) {
    return this.orderService.update(id, { status: OrderStatus.COMPLETED });
  }

  @Post('orders/:id/ready')
  async readyTestOrder(@Param('id') id: string) {
    return this.orderService.update(id, { status: OrderStatus.READY });
  }

  @Post('orders/:id/preparing')
  async preparingTestOrder(@Param('id') id: string) {
    return this.orderService.update(id, { status: OrderStatus.PREPARING });
  }

  // Data endpoints for testing
  @Get('branches')
  async getBranches() {
    return this.prisma.branch.findMany({
      select: {
        id: true,
        name: true,
        address: true,
      },
    });
  }

  @Get('desks')
  async getDesks() {
    return this.prisma.desk.findMany({
      select: {
        id: true,
        number: true,
        capacity: true,
        branchId: true,
        branch: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  @Get('menu-items')
  async getMenuItems() {
    return this.prisma.menuItem.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  @Get('users')
  async getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }
}
