import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { mapOrderToDto } from './mappers/order.mapper';
import type { PaginationParams } from '../common/interfaces/pagination.interface';
import { JwtAuthGuard } from '../auth/roles/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(UserRole.CUSTOMER)
  async create(@Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    const order = await this.ordersService.create(createOrderDto);
    return mapOrderToDto(order);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(@Query() paginationParams: PaginationParams): Promise<OrderResponseDto[]> {
    const orders = await this.ordersService.findAll(paginationParams);
    return orders.map(order => mapOrderToDto(order));
  }

  @Get('customer/:customerId')
  @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
  async findByCustomer(
    @Param('customerId') customerId: string,
    @Query() paginationParams: PaginationParams
  ): Promise<OrderResponseDto[]> {
    const orders = await this.ordersService.findByCustomer(+customerId, paginationParams);
    return orders.map(order => mapOrderToDto(order));
  }

  @Get('product-type/:productType')
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN)
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
