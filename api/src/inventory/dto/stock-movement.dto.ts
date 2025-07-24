import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum, IsUUID, Min } from 'class-validator';

export enum StockMovementType {
  PURCHASE = 'PURCHASE',
  USAGE = 'USAGE',
  ADJUSTMENT = 'ADJUSTMENT',
  WASTE = 'WASTE',
  TRANSFER = 'TRANSFER',
}

export class CreateStockMovementDto {
  @IsNotEmpty()
  @IsUUID()
  stockId: string;

  @IsNotEmpty()
  @IsEnum(StockMovementType)
  type: StockMovementType;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity: number;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;
}
