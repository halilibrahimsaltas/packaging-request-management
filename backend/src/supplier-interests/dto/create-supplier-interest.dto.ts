import { IsNumber, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateSupplierInterestDto {
  @IsNumber()
  orderId: number;

  @IsBoolean()
  isInterested: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
