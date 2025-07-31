import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
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
}
