import { IsString, IsOptional, IsBoolean, IsInt, Min, IsUUID } from 'class-validator';

export class CreateDeskDto {
  @IsString()
  number: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  qrCode?: string;

  @IsUUID()
  branchId: string;
}
