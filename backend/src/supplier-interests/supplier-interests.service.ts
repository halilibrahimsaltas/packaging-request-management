import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSupplierInterestDto } from './dto/create-supplier-interest.dto';
import { UpdateSupplierInterestDto } from './dto/update-supplier-interest.dto';
import { SupplierInterest } from './entities/supplier-interest.entity';
import { Order } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { SupplierInterestMapper } from './mappers/supplierInterest.mapper';

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
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check if supplier exists and has SUPPLIER role
    const supplier = await this.userRepository.findOne({ 
      where: { id: supplierId, role: UserRole.SUPPLIER } 
    });
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    // Check if supplier already has interest in this order
    const existingInterest = await this.supplierInterestRepository.findOne({
      where: { supplier: { id: supplierId }, order: { id: orderId } }
    });

    if (existingInterest) {
      // Update existing interest
      existingInterest.isInterested = isInterested;
      existingInterest.notes = notes || null;
      return await this.supplierInterestRepository.save(existingInterest);
    }

    // Create new interest
    const supplierInterest = this.supplierInterestRepository.create({
      supplier,
      order,
      isInterested,
      notes,
    });

    return await this.supplierInterestRepository.save(supplierInterest);
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

  async update(id: number, updateSupplierInterestDto: UpdateSupplierInterestDto) {
    const supplierInterest = await this.findOne(id);
    
    Object.assign(supplierInterest, updateSupplierInterestDto);
    
    return await this.supplierInterestRepository.save(supplierInterest);
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

  

}
