import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { CategoryService } from './category.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(
    private prisma: PrismaService,
    private categoryService: CategoryService,
  ) {}

  async findAll() {
    return this.prisma.menuItem.findMany({
      include: {
        category: true,
      },
    });
  }

  async findOne(id: string) {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }

    return menuItem;
  }

  async findByCategory(categoryId: string) {
    return this.prisma.menuItem.findMany({
      where: { categoryId },
      include: {
        category: true,
      },
    });
  }

  async create(createMenuItemDto: CreateMenuItemDto) {
    // Verify that the category exists
    await this.categoryService.findOne(createMenuItemDto.categoryId);

    return this.prisma.menuItem.create({
      data: createMenuItemDto,
      include: {
        category: true,
      },
    });
  }

  async update(id: string, updateMenuItemDto: UpdateMenuItemDto) {
    // Check if menu item exists
    await this.findOne(id);

    // If updating category, verify that it exists
    if (updateMenuItemDto.categoryId) {
      await this.categoryService.findOne(updateMenuItemDto.categoryId);
    }

    return this.prisma.menuItem.update({
      where: { id },
      data: updateMenuItemDto,
      include: {
        category: true,
      },
    });
  }

  async remove(id: string): Promise<void> {
    // Check if menu item exists
    await this.findOne(id);
    
    await this.prisma.menuItem.delete({
      where: { id },
    });
  }
}
