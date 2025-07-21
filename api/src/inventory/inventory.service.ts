import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IngredientService } from './ingredient.service';
import { StockService } from './stock.service';

@Injectable()
export class InventoryService {
  constructor(
    private prisma: PrismaService,
    private ingredientService: IngredientService,
    private stockService: StockService,
  ) {}

  async getInventoryOverview(branchId?: string) {
    const [
      totalIngredients,
      lowStockItems,
      expiringItems,
      totalStockValue,
    ] = await Promise.all([
      this.getTotalIngredients(),
      this.getLowStockCount(branchId),
      this.getExpiringItemsCount(branchId),
      this.getTotalStockValue(branchId),
    ]);

    return {
      totalIngredients,
      lowStockItems,
      expiringItems,
      totalStockValue,
    };
  }

  async getInventoryReport(branchId?: string) {
    const [
      ingredients,
      lowStockAlerts,
      expiringStock,
      recentMovements,
    ] = await Promise.all([
      this.ingredientService.findAll(),
      this.stockService.getLowStockAlerts(branchId),
      this.stockService.getExpiringStock(branchId),
      this.getRecentStockMovements(branchId),
    ]);

    return {
      ingredients: ingredients.length,
      lowStockAlerts: lowStockAlerts.length,
      expiringStock: expiringStock.length,
      recentMovements,
      details: {
        lowStockItems: lowStockAlerts,
        expiringItems: expiringStock,
      },
    };
  }

  private async getTotalIngredients(): Promise<number> {
    return this.prisma.ingredient.count({
      where: { isActive: true },
    });
  }

  private async getLowStockCount(branchId?: string): Promise<number> {
    const where: any = {
      quantity: {
        lte: this.prisma.stock.fields.minQuantity,
      },
    };

    if (branchId) {
      where.branchId = branchId;
    }

    return this.prisma.stock.count({ where });
  }

  private async getExpiringItemsCount(branchId?: string, daysAhead: number = 7): Promise<number> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const where: any = {
      expiryDate: {
        lte: futureDate,
        gte: new Date(),
      },
    };

    if (branchId) {
      where.branchId = branchId;
    }

    return this.prisma.stock.count({ where });
  }

  private async getTotalStockValue(branchId?: string): Promise<number> {
    const where: any = {};
    if (branchId) {
      where.branchId = branchId;
    }

    const stocks = await this.prisma.stock.findMany({
      where,
      select: {
        quantity: true,
        unitCost: true,
      },
    });

    return stocks.reduce((total, stock) => {
      return total + (Number(stock.quantity) * Number(stock.unitCost));
    }, 0);
  }

  private async getRecentStockMovements(branchId?: string, limit: number = 10) {
    const where: any = {};
    if (branchId) {
      where.stock = {
        branchId,
      };
    }

    return this.prisma.stockMovement.findMany({
      where,
      include: {
        stock: {
          include: {
            ingredient: true,
            branch: true,
          },
        },
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
      take: limit,
    });
  }
}
