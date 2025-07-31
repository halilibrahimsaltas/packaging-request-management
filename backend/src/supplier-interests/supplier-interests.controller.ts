import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { SupplierInterestsService } from './supplier-interests.service';
import { CreateSupplierInterestDto } from './dto/create-supplier-interest.dto';
import { UpdateSupplierInterestDto } from './dto/update-supplier-interest.dto';

@Controller('supplier-interests')
export class SupplierInterestsController {
  constructor(private readonly supplierInterestsService: SupplierInterestsService) {}

  @Post()
  create(@Body() createSupplierInterestDto: CreateSupplierInterestDto, @Request() req: any) {
    // TODO: Auth guard eklendiğinde req.user.id kullanılacak
    const supplierId = req.user?.id || 1; // Geçici olarak 1 kullanıyoruz
    return this.supplierInterestsService.create(createSupplierInterestDto, supplierId);
  }

  @Get()
  findAll() {
    return this.supplierInterestsService.findAll();
  }

  @Get('order/:orderId')
  findByOrder(@Param('orderId') orderId: string) {
    return this.supplierInterestsService.findByOrder(+orderId);
  }

  @Get('supplier/:supplierId')
  findBySupplier(@Param('supplierId') supplierId: string) {
    return this.supplierInterestsService.findBySupplier(+supplierId);
  }

  @Get('my-interests')
  findMyInterests(@Request() req: any) {
    const supplierId = req.user?.id || 1; // for now, using 1 as a placeholder
    return this.supplierInterestsService.findBySupplier(supplierId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supplierInterestsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSupplierInterestDto: UpdateSupplierInterestDto) {
    return this.supplierInterestsService.update(+id, updateSupplierInterestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supplierInterestsService.remove(+id);
  }
}
