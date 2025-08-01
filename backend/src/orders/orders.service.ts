import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { SupplierInterest } from '../supplier-interests/entities/supplier-interest.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import type { PaginationParams } from '../common/interfaces/pagination.interface';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(SupplierInterest)
    private readonly supplierInterestRepository: Repository<SupplierInterest>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Check if customer exists
    const customer = await this.userRepository.findOne({
      where: { id: createOrderDto.customerId }
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Check if all products exist and are active
    for (const item of createOrderDto.items) {
      const product = await this.productRepository.findOne({
        where: { id: item.productId, isActive: true }
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found or inactive`);
      }
    }

    // Create order
    const order = this.orderRepository.create({
      customer
    });

    const savedOrder = await this.orderRepository.save(order);

    // Create order items
    const orderItems = createOrderDto.items.map(item => 
      this.orderItemRepository.create({
        order: savedOrder,
        product: { id: item.productId } as Product,
        quantity: item.quantity
      })
    );

    await this.orderItemRepository.save(orderItems);

    return this.findOne(savedOrder.id);
  }

  async findAll(paginationParams?: PaginationParams): Promise<Order[]> {
    const { page = 1, limit = 10, sort = 'id', order = 'DESC' } = paginationParams || {};
    const offset = (page - 1) * limit;

    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .orderBy(`order.${sort}`, order.toUpperCase() as 'ASC' | 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();

    return orders;
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .where('order.id = :id', { id })
      .getOne();

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async findByCustomer(customerId: number, paginationParams?: PaginationParams): Promise<Order[]> {
    const { page = 1, limit = 10, sort = 'id', order = 'DESC' } = paginationParams || {};
    const offset = (page - 1) * limit;

    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .where('order.customer.id = :customerId', { customerId })
      .orderBy(`order.${sort}`, order.toUpperCase() as 'ASC' | 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();

    return orders;
  }

  async findByProductType(productType: string, paginationParams?: PaginationParams): Promise<Order[]> {
    const { page = 1, limit = 10, sort = 'id', order = 'DESC' } = paginationParams || {};
    const offset = (page - 1) * limit;

    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .where('product.type = :productType', { productType })
      .orderBy(`order.${sort}`, order.toUpperCase() as 'ASC' | 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();

    return orders;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Update order properties if provided
    if (updateOrderDto.customerId) {
      const customer = await this.userRepository.findOne({
        where: { id: updateOrderDto.customerId }
      });
      if (!customer) {
        throw new NotFoundException('Customer not found');
      }
      order.customer = customer;
    }

    // Save updated order
    await this.orderRepository.save(order);

    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    await this.orderRepository.remove(order);
    return { message: 'Order deleted successfully' };
  }

  async findAllWithSupplierInterests(paginationParams?: PaginationParams): Promise<any[]> {
    const { page = 1, limit = 10, sort = 'id', order = 'DESC' } = paginationParams || {};
    const offset = (page - 1) * limit;

    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .orderBy(`order.${sort}`, order.toUpperCase() as 'ASC' | 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();

    // every order with supplier interests
    const ordersWithInterests = await Promise.all(
      orders.map(async (order) => {
        const supplierInterests = await this.supplierInterestRepository.find({
          where: { order: { id: order.id } },
          relations: ['supplier'],
        });

        return {
          ...order,
          supplierInterests,
          interestedSuppliersCount: supplierInterests.filter(si => si.isInterested).length,
          totalSuppliersCount: supplierInterests.length,
        };
      })
    );

    return ordersWithInterests;
  }

  async findOneWithSupplierInterests(id: number): Promise<any> {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .where('order.id = :id', { id })
      .getOne();

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // get supplier interests
    const supplierInterests = await this.supplierInterestRepository.find({
      where: { order: { id: order.id } },
      relations: ['supplier'],
    });

    return {
      ...order,
      supplierInterests,
      interestedSuppliersCount: supplierInterests.filter(si => si.isInterested).length,
      totalSuppliersCount: supplierInterests.length,
    };
  }

  async findOrdersBySupplierInterest(supplierId: number, paginationParams?: PaginationParams): Promise<any[]> {
    const { page = 1, limit = 10, sort = 'id', order = 'DESC' } = paginationParams || {};
    const offset = (page - 1) * limit;

    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .innerJoin('supplier_interest', 'si', 'si.orderId = order.id')
      .where('si.supplierId = :supplierId', { supplierId })
      .orderBy(`order.${sort}`, order.toUpperCase() as 'ASC' | 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();

    return orders;
  }

  // get customer's orders
  async findMyOrders(customerId: number, paginationParams?: PaginationParams): Promise<Order[]> {
    const { page = 1, limit = 10, sort = 'id', order = 'DESC' } = paginationParams || {};
    const offset = (page - 1) * limit;

    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .where('order.customer.id = :customerId', { customerId })
      .orderBy(`order.${sort}`, order.toUpperCase() as 'ASC' | 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();

    return orders;
  }

  // get customer's order with masked suppliers
  async findMyOrderWithMaskedSuppliers(customerId: number, orderId: number): Promise<any> {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .where('order.id = :orderId', { orderId })
      .andWhere('order.customer.id = :customerId', { customerId })
      .getOne();

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found or you don't have access`);
    }

    // get supplier interests
    const supplierInterests = await this.supplierInterestRepository.find({
      where: { order: { id: order.id } },
      relations: ['supplier'],
    });

    // mask supplier names
    const maskedSupplierInterests = supplierInterests.map(si => ({
      id: si.id,
      supplierId: si.supplier.id,
      supplierName: this.maskSupplierName(si.supplier.username),
      isInterested: si.isInterested,
      notes: si.notes,
      createdAt: si.createdAt,
      updatedAt: si.updatedAt,
    }));

    return {
      ...order,
      supplierInterests: maskedSupplierInterests,
      interestedSuppliersCount: supplierInterests.filter(si => si.isInterested).length,
      totalSuppliersCount: supplierInterests.length,
    };
  }

  // mask supplier name 
  private maskSupplierName(name: string): string {
    if (!name || name.length < 2) return name;
    
    const words = name.split(' ');
    const maskedWords = words.map(word => {
      if (word.length <= 2) return word;
      return word.charAt(0) + '*'.repeat(word.length - 2) + word.charAt(word.length - 1);
    });
    
    return maskedWords.join(' ');
  }
}
