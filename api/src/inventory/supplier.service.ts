import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Prisma } from '@prisma/client';

type SupplierWithDetails = Prisma.SupplierGetPayload<{
  include: {
    ingredients: {
      include: {
        ingredient: true;
      };
    };
  };
}>;

@Injectable()
export class SupplierService {
  constructor(private prisma: PrismaService) {}

  async create(createSupplierDto: CreateSupplierDto): Promise<SupplierWithDetails> {
    return this.prisma.supplier.create({
      data: createSupplierDto,
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });
  }

  async findAll(): Promise<SupplierWithDetails[]> {
    return this.prisma.supplier.findMany({
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string): Promise<SupplierWithDetails> {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    return supplier;
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto): Promise<SupplierWithDetails> {
    await this.findOne(id); // Check if exists

    return this.prisma.supplier.update({
      where: { id },
      data: updateSupplierDto,
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Check if exists

    // Check if supplier has any ingredient relationships
    const ingredientCount = await this.prisma.supplierIngredient.count({
      where: { supplierId: id },
    });

    if (ingredientCount > 0) {
      throw new ConflictException('Cannot delete supplier that has ingredient relationships');
    }

    await this.prisma.supplier.delete({
      where: { id },
    });
  }

  async addIngredient(
    supplierId: string,
    ingredientId: string,
    data: {
      unitPrice: number;
      minOrderQty?: number;
      leadTimeDays?: number;
      isPreferred?: boolean;
    },
  ) {
    // Validate supplier exists
    await this.findOne(supplierId);

    // Validate ingredient exists
    const ingredient = await this.prisma.ingredient.findUnique({
      where: { id: ingredientId },
    });

    if (!ingredient) {
      throw new NotFoundException('Ingredient not found');
    }

    try {
      return await this.prisma.supplierIngredient.create({
        data: {
          supplierId,
          ingredientId,
          unitPrice: data.unitPrice,
          minOrderQty: data.minOrderQty || 1,
          leadTimeDays: data.leadTimeDays || 1,
          isPreferred: data.isPreferred || false,
        },
        include: {
          supplier: true,
          ingredient: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Supplier already supplies this ingredient');
      }
      throw error;
    }
  }

  async updateIngredientRelation(
    supplierId: string,
    ingredientId: string,
    data: {
      unitPrice?: number;
      minOrderQty?: number;
      leadTimeDays?: number;
      isPreferred?: boolean;
    },
  ) {
    const relation = await this.prisma.supplierIngredient.findUnique({
      where: {
        supplierId_ingredientId: {
          supplierId,
          ingredientId,
        },
      },
    });

    if (!relation) {
      throw new NotFoundException('Supplier-ingredient relationship not found');
    }

    return this.prisma.supplierIngredient.update({
      where: {
        supplierId_ingredientId: {
          supplierId,
          ingredientId,
        },
      },
      data,
      include: {
        supplier: true,
        ingredient: true,
      },
    });
  }

  async removeIngredient(supplierId: string, ingredientId: string) {
    const relation = await this.prisma.supplierIngredient.findUnique({
      where: {
        supplierId_ingredientId: {
          supplierId,
          ingredientId,
        },
      },
    });

    if (!relation) {
      throw new NotFoundException('Supplier-ingredient relationship not found');
    }

    await this.prisma.supplierIngredient.delete({
      where: {
        supplierId_ingredientId: {
          supplierId,
          ingredientId,
        },
      },
    });
  }

  async getIngredientSuppliers(ingredientId: string) {
    return this.prisma.supplierIngredient.findMany({
      where: { ingredientId },
      include: {
        supplier: true,
        ingredient: true,
      },
      orderBy: [
        { isPreferred: 'desc' },
        { unitPrice: 'asc' },
      ],
    });
  }
}
