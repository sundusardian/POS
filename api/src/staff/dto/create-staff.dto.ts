import { IsString, IsEmail, IsOptional, IsBoolean, MinLength } from 'class-validator';

export class CreateStaffDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
