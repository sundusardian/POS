import { IsString, IsOptional, IsArray, ValidateNested, IsNotEmpty, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'Menu item ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  menuItemId: string;

  @ApiProperty({
    description: 'Quantity of the menu item',
    example: 2,
    minimum: 1,
  })
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    description: 'Special notes for the item',
    example: 'Extra spicy',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Customer name',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiProperty({
    description: 'Customer phone number',
    example: '+62812345678',
    required: false,
  })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiProperty({
    description: 'Order notes',
    example: 'Please prepare quickly',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Desk/Table ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  deskId?: string;

  @ApiProperty({
    description: 'Branch ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  branchId: string;

  @ApiProperty({
    description: 'Staff member ID who took the order',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  staffId?: string;

  @ApiProperty({
    description: 'Order items',
    type: [CreateOrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
