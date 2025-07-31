import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import type { PaginationParams, PaginatedResult } from '../common/interfaces/pagination.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    const existingProduct = await this.productRepository.findOne({
      where: { name: createProductDto.name }
    });

    if (existingProduct) {
      throw new ConflictException('Product with this name already exists');
    }

    const newProduct = this.productRepository.create({
      ...createProductDto,
      isActive: createProductDto.isActive ?? true
    });

    const savedProduct = await this.productRepository.save(newProduct);
    return plainToInstance(ProductResponseDto, savedProduct);
  }

  async findAll(paginationParams?: PaginationParams): Promise<ProductResponseDto[]> {
    const { page = 1, limit = 10, sort = 'id', order = 'ASC' } = paginationParams || {};
    const offset = (page - 1) * limit;
    
    const products = await this.productRepository
      .createQueryBuilder('product')
      .orderBy(`product.${sort}`, order.toUpperCase() as 'ASC' | 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();
    
    return plainToInstance(ProductResponseDto, products);
  }

  async findActiveProducts(paginationParams?: PaginationParams): Promise<ProductResponseDto[]> {
    const { page = 1, limit = 10, sort = 'id', order = 'ASC' } = paginationParams || {};
    const offset = (page - 1) * limit;
    
    const products = await this.productRepository
      .createQueryBuilder('product')
      .where('product.isActive = :isActive', { isActive: true })
      .orderBy(`product.${sort}`, order.toUpperCase() as 'ASC' | 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();
    
    return plainToInstance(ProductResponseDto, products);
  }

  async findOne(id: number): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({ where: { id } });
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return plainToInstance(ProductResponseDto, product);
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({ where: { id } });
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Check if name is being updated and if it conflicts with existing product
    if (updateProductDto.name && updateProductDto.name !== product.name) {
      const existingProduct = await this.productRepository.findOne({
        where: { name: updateProductDto.name }
      });

      if (existingProduct) {
        throw new ConflictException('Product with this name already exists');
      }
    }

    Object.assign(product, updateProductDto);
    const savedProduct = await this.productRepository.save(product);
    
    return plainToInstance(ProductResponseDto, savedProduct);
  }

  async toggleActive(id: number): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({ where: { id } });
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    product.isActive = !product.isActive;
    const savedProduct = await this.productRepository.save(product);
    
    return plainToInstance(ProductResponseDto, savedProduct);
  }

  async remove(id: number): Promise<{ message: string }> {
    const product = await this.productRepository.findOne({ where: { id } });
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productRepository.remove(product);
    return { message: 'Product deleted successfully' };
  }
}
