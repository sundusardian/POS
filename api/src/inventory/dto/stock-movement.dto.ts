import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum, IsUUID, Min } from 'class-validator';

export enum StockMovementType {
  IN = 'IN',
  OUT = 'OUT',
  ADJUSTMENT = 'ADJUSTMENT',
  EXPIRED = 'EXPIRED',
  DAMAGED = 'DAMAGED',
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
