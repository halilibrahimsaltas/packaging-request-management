import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  OrderResponseDto,
  OrderWithSupplierInterestsResponseDto,
} from './dto/order-response.dto';
import {
  mapOrderToDto,
  mapOrderWithSupplierInterestsToDto,
} from './mappers/order.mapper';
import type { PaginationParams } from '../common/interfaces/pagination.interface';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { OwnerOrRolesGuard } from '../auth/roles/owner-or-roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(UserRole.CUSTOMER)
  async create(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    const order = await this.ordersService.create(createOrderDto);
    return mapOrderToDto(order);
  }

  // get customer's orders
  @Get('my-orders')
  @Roles(UserRole.CUSTOMER)
  async findMyOrders(
    @Request() req,
    @Query() paginationParams: PaginationParams,
  ): Promise<OrderResponseDto[]> {
    const customerId = req.user.id;
    const orders = await this.ordersService.findMyOrders(
      customerId,
      paginationParams,
    );
    return orders.map((order) => mapOrderToDto(order));
  }

  // get customer's order with masked suppliers
  @Get('my-orders/:id')
  @Roles(UserRole.CUSTOMER)
  async findMyOrderWithMaskedSuppliers(
    @Request() req,
    @Param('id') id: string,
  ): Promise<OrderWithSupplierInterestsResponseDto> {
    const customerId = req.user.id;
    const order = await this.ordersService.findMyOrderWithMaskedSuppliers(
      customerId,
      +id,
    );
    return mapOrderWithSupplierInterestsToDto(order);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(
    @Query() paginationParams: PaginationParams,
  ): Promise<OrderResponseDto[]> {
    const orders = await this.ordersService.findAll(paginationParams);
    return orders.map((order) => mapOrderToDto(order));
  }

  // get all orders with supplier interests
  @Get('with-supplier-interests')
  @Roles(UserRole.ADMIN)
  async findAllWithSupplierInterests(
    @Query() paginationParams: PaginationParams,
  ): Promise<OrderWithSupplierInterestsResponseDto[]> {
    const orders =
      await this.ordersService.findAllWithSupplierInterests(paginationParams);
    return orders.map((order) => mapOrderWithSupplierInterestsToDto(order));
  }

  // get specific order with supplier interests
  @Get('with-supplier-interests/:id')
  @Roles(UserRole.ADMIN)
  async findOneWithSupplierInterests(
    @Param('id') id: string,
  ): Promise<OrderWithSupplierInterestsResponseDto> {
    const order = await this.ordersService.findOneWithSupplierInterests(+id);
    return mapOrderWithSupplierInterestsToDto(order);
  }

  // get specific supplier's interested orders
  @Get('by-supplier-interest/:supplierId')
  @Roles(UserRole.ADMIN)
  async findOrdersBySupplierInterest(
    @Param('supplierId') supplierId: string,
    @Query() paginationParams: PaginationParams,
  ): Promise<OrderResponseDto[]> {
    const orders = await this.ordersService.findOrdersBySupplierInterest(
      +supplierId,
      paginationParams,
    );
    return orders.map((order) => mapOrderToDto(order));
  }

  @Get('customer/:customerId')
  @UseGuards(JwtAuthGuard, OwnerOrRolesGuard)
  @Roles(UserRole.ADMIN)
  async findByCustomer(
    @Param('customerId') customerId: string,
    @Query() paginationParams: PaginationParams,
  ): Promise<OrderResponseDto[]> {
    const orders = await this.ordersService.findByCustomer(
      +customerId,
      paginationParams,
    );
    return orders.map((order) => mapOrderToDto(order));
  }

  @Get('product-type/:productType')
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN)
  async findByProductType(
    @Param('productType') productType: string,
    @Query() paginationParams: PaginationParams,
  ): Promise<OrderResponseDto[]> {
    const orders = await this.ordersService.findByProductType(
      productType,
      paginationParams,
    );
    return orders.map((order) => mapOrderToDto(order));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, OwnerOrRolesGuard)
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id') id: string): Promise<OrderResponseDto> {
    const order = await this.ordersService.findOne(+id);
    return mapOrderToDto(order);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, OwnerOrRolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderResponseDto> {
    const order = await this.ordersService.update(+id, updateOrderDto);
    return mapOrderToDto(order);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, OwnerOrRolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.ordersService.remove(+id);
  }
}
