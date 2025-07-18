import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

// Define type for Category with included menu items
type CategoryWithMenuItems = Prisma.CategoryGetPayload<{
  include: { menuItems: true }
}>;

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll(): Promise<Prisma.CategoryGetPayload<{}>[]> {
    return this.prisma.category.findMany();
  }

  async findOne(id: string): Promise<CategoryWithMenuItems> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        menuItems: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async findByName(name: string): Promise<Prisma.CategoryGetPayload<{}> | null> {
    return this.prisma.category.findUnique({ where: { name } });
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Prisma.CategoryGetPayload<{}>> {
    // Check if category with this name already exists
    const existingCategory = await this.findByName(createCategoryDto.name);
    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Prisma.CategoryGetPayload<{}>> {
    const category = await this.findOne(id);
    
    // If name is being updated, check if it's already in use
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.findByName(updateCategoryDto.name);
      if (existingCategory) {
        throw new ConflictException('Category name is already in use');
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    
    // Check if category has menu items
    if (category.menuItems && category.menuItems.length > 0) {
      throw new ConflictException('Cannot delete category with associated menu items');
    }
    
    await this.prisma.category.delete({
      where: { id },
    });
  }
}
