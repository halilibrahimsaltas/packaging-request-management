import { IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}