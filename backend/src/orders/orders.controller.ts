import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { mapOrderToDto } from './mappers/order.mapper';
import type { PaginationParams } from '../common/interfaces/pagination.interface';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    const order = await this.ordersService.create(createOrderDto);
    return mapOrderToDto(order);
  }

  @Get()
  async findAll(@Query() paginationParams: PaginationParams): Promise<OrderResponseDto[]> {
    const orders = await this.ordersService.findAll(paginationParams);
    return orders.map(order => mapOrderToDto(order));
  }

  @Get('customer/:customerId')
  async findByCustomer(
    @Param('customerId') customerId: string,
    @Query() paginationParams: PaginationParams
  ): Promise<OrderResponseDto[]> {
    const orders = await this.ordersService.findByCustomer(+customerId, paginationParams);
    return orders.map(order => mapOrderToDto(order));
  }

  @Get('product-type/:productType')
  async findByProductType(
    @Param('productType') productType: string,
    @Query() paginationParams: PaginationParams
  ): Promise<OrderResponseDto[]> {
    const orders = await this.ordersService.findByProductType(productType, paginationParams);
    return orders.map(order => mapOrderToDto(order));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<OrderResponseDto> {
    const order = await this.ordersService.findOne(+id);
    return mapOrderToDto(order);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateOrderDto: UpdateOrderDto
  ): Promise<OrderResponseDto> {
    const order = await this.ordersService.update(+id, updateOrderDto);
    return mapOrderToDto(order);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.ordersService.remove(+id);
  }
}
