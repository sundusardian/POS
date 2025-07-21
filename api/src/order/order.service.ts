import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Prisma } from '@prisma/client';

type OrderWithDetails = Prisma.OrderGetPayload<{
  include: {
    orderItems: {
      include: {
        menuItem: {
          include: {
            category: true;
          };
        };
      };
    };
    desk: true;
    branch: true;
    staff: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
    payment: true;
  };
}>;

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto): Promise<OrderWithDetails> {
    // Generate unique order number
    const orderNumber = await this.generateOrderNumber();

    // Validate branch exists
    const branch = await this.prisma.branch.findUnique({
      where: { id: createOrderDto.branchId },
    });

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    // Validate desk exists if provided
    if (createOrderDto.deskId) {
      const desk = await this.prisma.desk.findUnique({
        where: { id: createOrderDto.deskId },
      });

      if (!desk || desk.branchId !== createOrderDto.branchId) {
        throw new BadRequestException('Desk not found or does not belong to the specified branch');
      }
    }

    // Validate staff exists if provided
    if (createOrderDto.staffId) {
      const staff = await this.prisma.user.findUnique({
        where: { id: createOrderDto.staffId },
      });

      if (!staff || (staff.role !== 'STAFF' && staff.role !== 'MANAGER' && staff.role !== 'ADMIN')) {
        throw new BadRequestException('Invalid staff member');
      }
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItemsData: Prisma.OrderItemCreateWithoutOrderInput[] = [];

    for (const item of createOrderDto.items) {
      const menuItem = await this.prisma.menuItem.findUnique({
        where: { id: item.menuItemId },
      });

      if (!menuItem) {
        throw new NotFoundException(`Menu item with ID ${item.menuItemId} not found`);
      }

      if (!menuItem.isAvailable) {
        throw new BadRequestException(`Menu item "${menuItem.name}" is not available`);
      }

      const itemTotal = Number(menuItem.price) * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        menuItem: {
          connect: { id: item.menuItemId },
        },
        quantity: item.quantity,
        unitPrice: menuItem.price,
        totalPrice: new Prisma.Decimal(itemTotal),
        notes: item.notes,
      });
    }

    // Create order with order items
    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        customerName: createOrderDto.customerName,
        customerPhone: createOrderDto.customerPhone,
        notes: createOrderDto.notes,
        deskId: createOrderDto.deskId,
        branchId: createOrderDto.branchId,
        staffId: createOrderDto.staffId,
        totalAmount,
        orderItems: {
          create: orderItemsData,
        },
      },
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
        desk: true,
        branch: true,
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payment: true,
      },
    });

    return order;
  }

  async findAll(branchId?: string, status?: string): Promise<OrderWithDetails[]> {
    const where: Prisma.OrderWhereInput = {};

    if (branchId) {
      where.branchId = branchId;
    }

    if (status) {
      where.status = status as any;
    }

    return this.prisma.order.findMany({
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
        desk: true,
        branch: true,
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<OrderWithDetails> {
    const order = await this.prisma.order.findUnique({
      where: { id },
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
        desk: true,
        branch: true,
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payment: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<OrderWithDetails> {
    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new NotFoundException('Order not found');
    }

    // Prevent updating completed or cancelled orders
    if (existingOrder.status === 'COMPLETED' || existingOrder.status === 'CANCELLED') {
      throw new BadRequestException('Cannot update completed or cancelled orders');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        customerName: updateOrderDto.customerName,
        customerPhone: updateOrderDto.customerPhone,
        notes: updateOrderDto.notes,
        status: updateOrderDto.status,
      },
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
        desk: true,
        branch: true,
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payment: true,
      },
    });

    return updatedOrder;
  }

  async cancel(id: string): Promise<OrderWithDetails> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === 'COMPLETED' || order.status === 'CANCELLED') {
      throw new BadRequestException('Order is already completed or cancelled');
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
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
        desk: true,
        branch: true,
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payment: true,
      },
    });
  }

  async createPayment(createPaymentDto: CreatePaymentDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: createPaymentDto.orderId },
      include: { payment: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.payment) {
      throw new BadRequestException('Payment already exists for this order');
    }

    if (order.status === 'CANCELLED') {
      throw new BadRequestException('Cannot create payment for cancelled order');
    }

    const totalAmount = Number(order.totalAmount);
    const paidAmount = createPaymentDto.paidAmount;
    const changeAmount = Math.max(0, paidAmount - totalAmount);

    let paymentStatus: 'PENDING' | 'PAID' | 'PARTIAL' = 'PENDING';
    if (paidAmount >= totalAmount) {
      paymentStatus = 'PAID';
    } else if (paidAmount > 0) {
      paymentStatus = 'PARTIAL';
    }

    const payment = await this.prisma.payment.create({
      data: {
        orderId: createPaymentDto.orderId,
        amount: totalAmount,
        paidAmount: paidAmount,
        changeAmount: changeAmount,
        paymentMethod: createPaymentDto.paymentMethod,
        status: paymentStatus,
        receiptNumber: createPaymentDto.receiptNumber,
      },
    });

    // Update order status if payment is complete
    if (paymentStatus === 'PAID') {
      await this.prisma.order.update({
        where: { id: createPaymentDto.orderId },
        data: { status: 'COMPLETED' },
      });
    }

    return payment;
  }

  async getOrdersByDesk(deskId: string): Promise<OrderWithDetails[]> {
    return this.prisma.order.findMany({
      where: {
        deskId,
        status: {
          not: 'COMPLETED',
        },
      },
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
        desk: true,
        branch: true,
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  private async generateOrderNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    
    // Get the count of orders created today
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const orderCount = await this.prisma.order.count({
      where: {
        createdAt: {
          gte: todayStart,
          lt: todayEnd,
        },
      },
    });

    const orderNumber = `ORD-${dateStr}-${String(orderCount + 1).padStart(4, '0')}`;
    return orderNumber;
  }
}
