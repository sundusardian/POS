import { Controller, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { OrderService } from '../order/order.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('/test')
@UseGuards(JwtAuthGuard)
export class TestController {
  constructor(private readonly orderService: OrderService) {}

  @Post('orders')
  async createTestOrder(@Body() body) {
    // Adapt payload from test client to real DTO
    const dto = {
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      deskId: body.deskId,
      branchId: body.branchId,
      staffId: body.staffId,
      items: (body.orderItems || body.items || []).map(item => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        notes: item.notes,
      })),
      notes: body.notes,
    };
    return this.orderService.create(dto);
  }

  @Patch('orders/:id')
  async updateTestOrder(@Param('id') id: string, @Body() body) {
    // Only status update for test
    return this.orderService.update(id, { status: body.status });
  }

  @Post('orders/:id/cancel')
  async cancelTestOrder(@Param('id') id: string) {
    return this.orderService.cancel(id);
  }

  @Post('orders/payment')
  async testPayment(@Body() body) {
    return this.orderService.createPayment({
      orderId: body.orderId,
      paidAmount: body.paidAmount,
      paymentMethod: body.paymentMethod,
      receiptNumber: body.receiptNumber,
    });
  }
}
