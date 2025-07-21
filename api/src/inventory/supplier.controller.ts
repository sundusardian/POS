import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Roles(Role.ADMIN, Role.MANAGER)
  @Post()
  async create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.supplierService.create(createSupplierDto);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  @Get()
  async findAll() {
    return this.supplierService.findAll();
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.supplierService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSupplierDto: UpdateSupplierDto) {
    return this.supplierService.update(id, updateSupplierDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.supplierService.remove(id);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Post(':supplierId/ingredients/:ingredientId')
  async addIngredient(
    @Param('supplierId') supplierId: string,
    @Param('ingredientId') ingredientId: string,
    @Body() data: {
      unitPrice: number;
      minOrderQty?: number;
      leadTimeDays?: number;
      isPreferred?: boolean;
    },
  ) {
    return this.supplierService.addIngredient(supplierId, ingredientId, data);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Patch(':supplierId/ingredients/:ingredientId')
  async updateIngredientRelation(
    @Param('supplierId') supplierId: string,
    @Param('ingredientId') ingredientId: string,
    @Body() data: {
      unitPrice?: number;
      minOrderQty?: number;
      leadTimeDays?: number;
      isPreferred?: boolean;
    },
  ) {
    return this.supplierService.updateIngredientRelation(supplierId, ingredientId, data);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Delete(':supplierId/ingredients/:ingredientId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeIngredient(
    @Param('supplierId') supplierId: string,
    @Param('ingredientId') ingredientId: string,
  ) {
    await this.supplierService.removeIngredient(supplierId, ingredientId);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  @Get('ingredients/:ingredientId/suppliers')
  async getIngredientSuppliers(@Param('ingredientId') ingredientId: string) {
    return this.supplierService.getIngredientSuppliers(ingredientId);
  }
}
