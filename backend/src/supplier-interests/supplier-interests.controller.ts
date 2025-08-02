import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { SupplierInterestsService } from './supplier-interests.service';
import { CreateSupplierInterestDto } from './dto/create-supplier-interest.dto';
import { JwtAuthGuard } from '../auth/roles/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { OwnerOrRolesGuard } from '../auth/roles/owner-or-roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import type { PaginationParams } from '../common/interfaces/pagination.interface';

@Controller('supplier-interests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SupplierInterestsController {
  constructor(private readonly supplierInterestsService: SupplierInterestsService) {}

  @Post()
  @Roles(UserRole.SUPPLIER)
  create(@Body() createSupplierInterestDto: CreateSupplierInterestDto, @Request() req: any) {
    const supplierId = req.user.id; 
    return this.supplierInterestsService.create(createSupplierInterestDto, supplierId);
  }

  // get orders by product types
  @Get('orders/by-product-types')
  @Roles(UserRole.SUPPLIER)
  async findOrdersByProductTypes(
    @Request() req: any,
    @Query('productTypes') productTypes: string,
    @Query() paginationParams: PaginationParams
  ) {
    const supplierId = req.user.id;
    const productTypesArray = productTypes ? productTypes.split(',') : [];
    return this.supplierInterestsService.findOrdersByProductTypes(supplierId, productTypesArray, paginationParams);
  }

  // get order detail for supplier
  @Get('orders/:orderId/detail')
  @Roles(UserRole.SUPPLIER)
  async findOrderDetailForSupplier(
    @Request() req: any,
    @Param('orderId') orderId: string
  ) {
    const supplierId = req.user.id;
    return this.supplierInterestsService.findOrderDetailForSupplier(supplierId, +orderId);
  }

  // update supplier interest status
  @Post('orders/:orderId/toggle-interest')
  @Roles(UserRole.SUPPLIER)
  async toggleInterest(
    @Request() req: any,
    @Param('orderId') orderId: string,
    @Body() body: { isInterested: boolean; notes?: string }
  ) {
    const supplierId = req.user.id;
    return this.supplierInterestsService.toggleInterest(supplierId, +orderId, body.isInterested, body.notes);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.supplierInterestsService.findAll();
  }

  @Get('order/:orderId')
  @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
  findByOrder(@Param('orderId') orderId: string) {
    return this.supplierInterestsService.findByOrder(+orderId);
  }

  @Get('supplier/:supplierId')
  @UseGuards(JwtAuthGuard, OwnerOrRolesGuard)
  @Roles(UserRole.ADMIN)
  findBySupplier(@Param('supplierId') supplierId: string) {
    return this.supplierInterestsService.findBySupplier(+supplierId);
  }

  @Get('my-interests')
  @Roles(UserRole.SUPPLIER)
  findMyInterests(@Request() req: any) {
    const supplierId = req.user.id;
    
    if (!supplierId) {
      throw new Error('No supplier ID found in JWT token');
    }
    
    return this.supplierInterestsService.findMyInterests(supplierId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.supplierInterestsService.findOne(+id);
  }



  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.supplierInterestsService.remove(+id);
  }
}
