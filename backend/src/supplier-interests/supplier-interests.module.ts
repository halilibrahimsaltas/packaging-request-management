import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierInterestsService } from './supplier-interests.service';
import { SupplierInterestsController } from './supplier-interests.controller';
import { SupplierInterest } from './entities/supplier-interest.entity';
import { Order } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { SupplierInterestMapper } from './mappers/supplierInterest.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([SupplierInterest, Order, User])],
  controllers: [SupplierInterestsController],
  providers: [SupplierInterestsService, SupplierInterestMapper],
  exports: [SupplierInterestsService, SupplierInterestMapper],
})
export class SupplierInterestsModule {}
