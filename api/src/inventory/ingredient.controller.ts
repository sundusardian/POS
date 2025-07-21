import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('ingredients')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Roles(Role.ADMIN, Role.MANAGER)
  @Post()
  async create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.ingredientService.create(createIngredientDto);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  @Get()
  async findAll(@Query('category') category?: string) {
    if (category) {
      return this.ingredientService.findByCategory(category);
    }
    return this.ingredientService.findAll();
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  @Get('low-stock')
  async getLowStockIngredients(@Query('branchId') branchId?: string) {
    return this.ingredientService.getLowStockIngredients(branchId);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ingredientService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateIngredientDto: UpdateIngredientDto) {
    return this.ingredientService.update(id, updateIngredientDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.ingredientService.remove(id);
  }
}
