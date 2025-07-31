import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import type { PaginationParams } from '../common/interfaces/pagination.interface';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  async findAll(@Query() paginationParams: PaginationParams): Promise<ProductResponseDto[]> {
    return this.productsService.findAll(paginationParams);
  }

  @Get('active')
  async findActiveProducts(@Query() paginationParams: PaginationParams): Promise<ProductResponseDto[]> {
    return this.productsService.findActiveProducts(paginationParams);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateProductDto: UpdateProductDto
  ): Promise<ProductResponseDto> {
    return this.productsService.update(+id, updateProductDto);
  }

  @Patch(':id/toggle')
  async toggleActive(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.productsService.toggleActive(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.productsService.remove(+id);
  }
}
