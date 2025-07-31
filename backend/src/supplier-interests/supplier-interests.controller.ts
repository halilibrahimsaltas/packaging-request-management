import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { SupplierInterestsService } from './supplier-interests.service';
import { CreateSupplierInterestDto } from './dto/create-supplier-interest.dto';
import { UpdateSupplierInterestDto } from './dto/update-supplier-interest.dto';
import { JwtAuthGuard } from '../auth/roles/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { OwnerOrRolesGuard } from '../auth/roles/owner-or-roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('supplier-interests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SupplierInterestsController {
  constructor(private readonly supplierInterestsService: SupplierInterestsService) {}

  @Post()
  @Roles(UserRole.SUPPLIER)
  create(@Body() createSupplierInterestDto: CreateSupplierInterestDto, @Request() req: any) {
    const supplierId = req.user.sub; // JWT'den user ID
    return this.supplierInterestsService.create(createSupplierInterestDto, supplierId);
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
    const supplierId = req.user.sub; // JWT'den user ID
    return this.supplierInterestsService.findBySupplier(supplierId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.supplierInterestsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, OwnerOrRolesGuard)
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateSupplierInterestDto: UpdateSupplierInterestDto) {
    return this.supplierInterestsService.update(+id, updateSupplierInterestDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.supplierInterestsService.remove(+id);
  }
}
