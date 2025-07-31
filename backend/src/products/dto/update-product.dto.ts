import { PartialType, OmitType } from '@nestjs/mapped-types';
import { IsOptional, IsBoolean } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDto, ['isActive'] as const)
) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
