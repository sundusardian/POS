import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { CreateStockMovementDto, StockMovementType } from './dto/stock-movement.dto';
import { Prisma } from '@prisma/client';

type StockWithDetails = Prisma.StockGetPayload<{
  include: {
    ingredient: true;
    branch: true;
    movements: {
      include: {
        user: {
          select: {
            id: true;
            name: true;
            email: true;
          };
        };
      };
    };
  };
}>;

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async create(createStockDto: CreateStockDto): Promise<StockWithDetails> {
    // Validate ingredient exists
    const ingredient = await this.prisma.ingredient.findUnique({
      where: { id: createStockDto.ingredientId },
    });

    if (!ingredient) {
      throw new NotFoundException('Ingredient not found');
    }

    // Validate branch exists
    const branch = await this.prisma.branch.findUnique({
      where: { id: createStockDto.branchId },
    });

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    try {
      const stock = await this.prisma.stock.create({
        data: {
          ...createStockDto,
          expiryDate: createStockDto.expiryDate ? new Date(createStockDto.expiryDate) : null,
        },
        include: {
          ingredient: true,
          branch: true,
          movements: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      // Create initial stock movement
      if (createStockDto.quantity > 0) {
        await this.createStockMovement({
          stockId: stock.id,
          type: StockMovementType.IN,
          quantity: createStockDto.quantity,
          reason: 'Initial stock',
        });
      }

      return stock;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Stock already exists for this ingredient and branch');
      }
      throw error;
    }
  }

  async findAll(branchId?: string): Promise<StockWithDetails[]> {
    const where: Prisma.StockWhereInput = {};

    if (branchId) {
      where.branchId = branchId;
    }

    return this.prisma.stock.findMany({
      where,
      include: {
        ingredient: true,
        branch: true,
        movements: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5, // Only show last 5 movements
        },
      },
      orderBy: [
        {
          ingredient: {
            name: 'asc',
          },
        },
      ],
    });
  }

  async findOne(id: string): Promise<StockWithDetails> {
    const stock = await this.prisma.stock.findUnique({
      where: { id },
      include: {
        ingredient: true,
        branch: true,
        movements: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!stock) {
      throw new NotFoundException('Stock not found');
    }

    return stock;
  }

  async updateQuantity(id: string, quantity: number, userId?: string): Promise<StockWithDetails> {
    const stock = await this.findOne(id);
    const currentQuantity = Number(stock.quantity);
    const newQuantity = quantity;
    const difference = newQuantity - currentQuantity;

    if (newQuantity < 0) {
      throw new BadRequestException('Stock quantity cannot be negative');
    }

    // Update stock quantity
    const updatedStock = await this.prisma.stock.update({
      where: { id },
      data: { quantity: newQuantity },
      include: {
        ingredient: true,
        branch: true,
        movements: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    // Create stock movement record
    if (difference !== 0) {
      await this.createStockMovement({
        stockId: id,
        type: difference > 0 ? StockMovementType.IN : StockMovementType.OUT,
        quantity: Math.abs(difference),
        reason: 'Manual adjustment',
        userId,
      });
    }

    return updatedStock;
  }

  async createStockMovement(createStockMovementDto: CreateStockMovementDto) {
    const stock = await this.prisma.stock.findUnique({
      where: { id: createStockMovementDto.stockId },
    });

    if (!stock) {
      throw new NotFoundException('Stock not found');
    }

    const currentQuantity = Number(stock.quantity);
    let newQuantity = currentQuantity;

    // Calculate new quantity based on movement type
    switch (createStockMovementDto.type) {
      case StockMovementType.IN:
        newQuantity += createStockMovementDto.quantity;
        break;
      case StockMovementType.OUT:
      case StockMovementType.EXPIRED:
      case StockMovementType.DAMAGED:
        newQuantity -= createStockMovementDto.quantity;
        break;
      case StockMovementType.ADJUSTMENT:
        // For adjustments, the quantity represents the final amount
        newQuantity = createStockMovementDto.quantity;
        break;
    }

    if (newQuantity < 0) {
      throw new BadRequestException('Insufficient stock quantity');
    }

    // Create movement record
    const movement = await this.prisma.stockMovement.create({
      data: createStockMovementDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Update stock quantity if not an adjustment (adjustment handles quantity separately)
    if (createStockMovementDto.type !== StockMovementType.ADJUSTMENT) {
      await this.prisma.stock.update({
        where: { id: createStockMovementDto.stockId },
        data: { quantity: newQuantity },
      });
    }

    return movement;
  }

  async getStockMovements(stockId: string) {
    return this.prisma.stockMovement.findMany({
      where: { stockId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getLowStockAlerts(branchId?: string) {
    const where: Prisma.StockWhereInput = {
      quantity: {
        lte: this.prisma.stock.fields.minQuantity,
      },
    };

    if (branchId) {
      where.branchId = branchId;
    }

    return this.prisma.stock.findMany({
      where,
      include: {
        ingredient: true,
        branch: true,
      },
      orderBy: [
        {
          quantity: 'asc',
        },
        {
          ingredient: {
            name: 'asc',
          },
        },
      ],
    });
  }

  async getExpiringStock(branchId?: string, daysAhead: number = 7) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const where: Prisma.StockWhereInput = {
      expiryDate: {
        lte: futureDate,
        gte: new Date(),
      },
    };

    if (branchId) {
      where.branchId = branchId;
    }

    return this.prisma.stock.findMany({
      where,
      include: {
        ingredient: true,
        branch: true,
      },
      orderBy: {
        expiryDate: 'asc',
      },
    });
  }
}
