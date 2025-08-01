import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { SupplierInterest } from '../supplier-interests/entities/supplier-interest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, SupplierInterest])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
