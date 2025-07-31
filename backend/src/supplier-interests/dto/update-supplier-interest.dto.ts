import { PartialType } from '@nestjs/mapped-types';
import { CreateSupplierInterestDto } from './create-supplier-interest.dto';

export class UpdateSupplierInterestDto extends PartialType(CreateSupplierInterestDto) {}
