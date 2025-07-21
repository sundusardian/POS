import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Prisma } from '@prisma/client';

type IngredientWithDetails = Prisma.IngredientGetPayload<{
  include: {
    stocks: {
      include: {
        branch: true;
      };
    };
    menuItems: {
      include: {
        menuItem: true;
      };
    };
    suppliers: {
      include: {
        supplier: true;
      };
    };
  };
}>;

@Injectable()
export class IngredientService {
  constructor(private prisma: PrismaService) {}

  async create(createIngredientDto: CreateIngredientDto): Promise<IngredientWithDetails> {
    try {
      return await this.prisma.ingredient.create({
        data: createIngredientDto,
        include: {
          stocks: {
            include: {
              branch: true,
            },
          },
          menuItems: {
            include: {
              menuItem: true,
            },
          },
          suppliers: {
            include: {
              supplier: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Ingredient with this name already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<IngredientWithDetails[]> {
    return this.prisma.ingredient.findMany({
      include: {
        stocks: {
          include: {
            branch: true,
          },
        },
        menuItems: {
          include: {
            menuItem: true,
          },
        },
        suppliers: {
          include: {
            supplier: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string): Promise<IngredientWithDetails> {
    const ingredient = await this.prisma.ingredient.findUnique({
      where: { id },
      include: {
        stocks: {
          include: {
            branch: true,
          },
        },
        menuItems: {
          include: {
            menuItem: true,
          },
        },
        suppliers: {
          include: {
            supplier: true,
          },
        },
      },
    });

    if (!ingredient) {
      throw new NotFoundException('Ingredient not found');
    }

    return ingredient;
  }

  async update(id: string, updateIngredientDto: UpdateIngredientDto): Promise<IngredientWithDetails> {
    await this.findOne(id); // Check if exists

    try {
      return await this.prisma.ingredient.update({
        where: { id },
        data: updateIngredientDto,
        include: {
          stocks: {
            include: {
              branch: true,
            },
          },
          menuItems: {
            include: {
              menuItem: true,
            },
          },
          suppliers: {
            include: {
              supplier: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Ingredient with this name already exists');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Check if exists

    // Check if ingredient is used in any menu items
    const menuItemCount = await this.prisma.menuItemIngredient.count({
      where: { ingredientId: id },
    });

    if (menuItemCount > 0) {
      throw new ConflictException('Cannot delete ingredient that is used in menu items');
    }

    await this.prisma.ingredient.delete({
      where: { id },
    });
  }

  async findByCategory(category: string): Promise<IngredientWithDetails[]> {
    return this.prisma.ingredient.findMany({
      where: { category },
      include: {
        stocks: {
          include: {
            branch: true,
          },
        },
        menuItems: {
          include: {
            menuItem: true,
          },
        },
        suppliers: {
          include: {
            supplier: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getLowStockIngredients(branchId?: string): Promise<any[]> {
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
          ingredient: {
            name: 'asc',
          },
        },
      ],
    });
  }
}
