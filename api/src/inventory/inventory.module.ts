import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { IngredientService } from './ingredient.service';
import { IngredientController } from './ingredient.controller';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    InventoryController,
    IngredientController,
    StockController,
    SupplierController,
  ],
  providers: [
    InventoryService,
    IngredientService,
    StockService,
    SupplierService,
  ],
  exports: [
    InventoryService,
    IngredientService,
    StockService,
    SupplierService,
  ],
})
export class InventoryModule {}
