import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSupplierInterestDto } from './dto/create-supplier-interest.dto';
import { UpdateSupplierInterestDto } from './dto/update-supplier-interest.dto';
import { SupplierInterest } from './entities/supplier-interest.entity';
import { Order } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { SupplierInterestMapper } from './mappers/supplierInterest.mapper';
import { OrderWithSupplierInterestDto } from './dto/supplier-interest-response.dto';
import type { PaginationParams } from '../common/interfaces/pagination.interface';

@Injectable()
export class SupplierInterestsService {
  constructor(
    @InjectRepository(SupplierInterest)
    private supplierInterestRepository: Repository<SupplierInterest>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createSupplierInterestDto: CreateSupplierInterestDto, supplierId: number) {
    const { orderId, isInterested, notes } = createSupplierInterestDto;

    // Check if order exists
    const order = await this.orderRepository.findOne({ 
      where: { id: orderId },
      relations: ['customer', 'items', 'items.product']
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    
    const supplier = await this.userRepository.findOne({ 
      where: { id: supplierId } 
    });
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    // Check if supplier already has interest in this order
    const existingInterest = await this.supplierInterestRepository.findOne({
      where: { supplier: { id: supplierId }, order: { id: orderId } },
      relations: ['supplier', 'order', 'order.customer', 'order.items', 'order.items.product']
    });

    if (existingInterest) {
      // Update existing interest
      existingInterest.isInterested = isInterested;
      existingInterest.notes = notes || null;
      const savedInterest = await this.supplierInterestRepository.save(existingInterest);
      return SupplierInterestMapper.toResponse(savedInterest);
    }

    // Create new interest
    const supplierInterest = this.supplierInterestRepository.create({
      supplier,
      order,
      isInterested,
      notes,
    });

    const savedInterest = await this.supplierInterestRepository.save(supplierInterest);
    
    // Fetch with relations for mapping
    const interestWithRelations = await this.supplierInterestRepository.findOne({
      where: { id: savedInterest.id },
      relations: ['supplier', 'order', 'order.customer', 'order.items', 'order.items.product']
    });

    if (!interestWithRelations) {
      throw new NotFoundException('Failed to create supplier interest');
    }

    return SupplierInterestMapper.toResponse(interestWithRelations);
  }

  async findAll() {
    const interests = await this.supplierInterestRepository.find({
      relations: ['supplier', 'order', 'order.items', 'order.items.product'],
    });
    
    return SupplierInterestMapper.toResponseArray(interests);
  }

  async findOne(id: number) {
    const supplierInterest = await this.supplierInterestRepository.findOne({
      where: { id },
      relations: ['supplier', 'order', 'order.items', 'order.items.product'],
    });

    if (!supplierInterest) {
      throw new NotFoundException('Supplier interest not found');
    }

    return SupplierInterestMapper.toResponse(supplierInterest);
  }

  async findByOrder(orderId: number) {
    const interests = await this.supplierInterestRepository.find({
      where: { order: { id: orderId } },
      relations: ['supplier', 'order'],
    });
    
    return SupplierInterestMapper.toResponseArray(interests);
  }

  async findBySupplier(supplierId: number) {
    const interests = await this.supplierInterestRepository.find({
      where: { supplier: { id: supplierId } },
      relations: ['order', 'order.items', 'order.items.product'],
    });
    
    return SupplierInterestMapper.toResponseArray(interests);
  }

  

  async remove(id: number) {
    const supplierInterest = await this.supplierInterestRepository.findOne({
      where: { id },
      relations: ['supplier', 'order'],
    });
    
    if (!supplierInterest) {
      throw new NotFoundException('Supplier interest not found');
    }
    
    return await this.supplierInterestRepository.remove(supplierInterest);
  }

  // get orders by product types
  async findOrdersByProductTypes(supplierId: number, productTypes: string[], paginationParams?: PaginationParams): Promise<OrderWithSupplierInterestDto[]> {
    const { page = 1, limit = 10, sort = 'id', order = 'DESC' } = paginationParams || {};
    const offset = (page - 1) * limit;

    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .orderBy(`order.${sort}`, order.toUpperCase() as 'ASC' | 'DESC')
      .skip(offset)
      .take(limit);

    // filter by product types
    if (productTypes && productTypes.length > 0) {
      queryBuilder.andWhere('product.type IN (:...productTypes)', { productTypes });
    }

    const orders = await queryBuilder.getMany();

    // check supplier interest status for each order using mapper
    const ordersWithInterestStatus = await Promise.all(
      orders.map(async (order) => {
        const existingInterest = await this.supplierInterestRepository.findOne({
          where: { 
            supplier: { id: supplierId }, 
            order: { id: order.id } 
          }
        });

        return SupplierInterestMapper.toOrderWithSupplierInterest(order, existingInterest);
      })
    );

    return ordersWithInterestStatus;
  }

  // get order detail for supplier
  async findOrderDetailForSupplier(supplierId: number, orderId: number): Promise<OrderWithSupplierInterestDto> {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .where('order.id = :orderId', { orderId })
      .getOne();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // check supplier interest status for this order
    const existingInterest = await this.supplierInterestRepository.findOne({
      where: { 
        supplier: { id: supplierId }, 
        order: { id: orderId } 
      }
    });

    return SupplierInterestMapper.toOrderWithSupplierInterest(order, existingInterest);
  }

  // update supplier interest status  
  async toggleInterest(supplierId: number, orderId: number, isInterested: boolean, notes?: string) {
    // Check if order exists
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    
    const supplier = await this.userRepository.findOne({ 
      where: { id: supplierId } 
    });
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    // Check if supplier already has interest in this order
    const existingInterest = await this.supplierInterestRepository.findOne({
      where: { supplier: { id: supplierId }, order: { id: orderId } },
      relations: ['supplier', 'order', 'order.customer', 'order.items', 'order.items.product']
    });

    if (existingInterest) {
      // Update existing interest
      existingInterest.isInterested = isInterested;
      existingInterest.notes = notes || existingInterest.notes;
      const savedInterest = await this.supplierInterestRepository.save(existingInterest);
      
      // Fetch with relations for mapping
      const interestWithRelations = await this.supplierInterestRepository.findOne({
        where: { id: savedInterest.id },
        relations: ['supplier', 'order', 'order.customer', 'order.items', 'order.items.product']
      });
      
      if (!interestWithRelations) {
        throw new NotFoundException('Failed to update supplier interest');
      }
      
      return SupplierInterestMapper.toResponse(interestWithRelations);
    }

    // Create new interest
    const supplierInterest = this.supplierInterestRepository.create({
      supplier,
      order,
      isInterested,
      notes: notes || null,
    });

    const savedInterest = await this.supplierInterestRepository.save(supplierInterest);
    
    // Fetch with relations for mapping
    const interestWithRelations = await this.supplierInterestRepository.findOne({
      where: { id: savedInterest.id },
      relations: ['supplier', 'order', 'order.customer', 'order.items', 'order.items.product']
    });
    
    if (!interestWithRelations) {
      throw new NotFoundException('Failed to create supplier interest');
    }
    
    return SupplierInterestMapper.toResponse(interestWithRelations);
  }

}
