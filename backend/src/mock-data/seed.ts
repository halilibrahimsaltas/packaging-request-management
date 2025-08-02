import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { SupplierInterest } from '../supplier-interests/entities/supplier-interest.entity';
import * as bcrypt from 'bcrypt';

export async function seedDatabase() {
  const app = await NestFactory.create(AppModule);
  
  try {
    const dataSource = app.get('DataSource') as DataSource;
    
    if (!dataSource) {
      console.error('DataSource not found');
      return;
    }

    console.log('Starting database seeding...');

    // Read mock data
    const mockDataPath = path.join(__dirname, 'dummydata.json');
    console.log('Looking for mock data at:', mockDataPath);
    
    let mockData;
    if (!fs.existsSync(mockDataPath)) {
      console.error('Mock data file not found at:', mockDataPath);
      // Try alternative path
      const altPath = path.join(__dirname, '..', 'mock-data', 'dummydata.json');
      console.log('Trying alternative path:', altPath);
      if (!fs.existsSync(altPath)) {
        console.error('Mock data file not found at alternative path either');
        return;
      }
      mockData = JSON.parse(fs.readFileSync(altPath, 'utf8'));
    } else {
      mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));
    }

    // Clear existing data
    await dataSource.getRepository(SupplierInterest).clear();
    await dataSource.getRepository(OrderItem).clear();
    await dataSource.getRepository(Order).clear();
    await dataSource.getRepository(Product).clear();
    await dataSource.getRepository(User).clear();

    console.log('Existing data cleared');

    // Seed Users
    console.log('Seeding users...');
    const userRepository = dataSource.getRepository(User);
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    for (const userData of mockData.users) {
      const user = userRepository.create({
        ...userData,
        password: hashedPassword
      });
      await userRepository.save(user);
    }
    console.log(`${mockData.users.length} users created`);

    // Seed Products
    console.log('Seeding products...');
    const productRepository = dataSource.getRepository(Product);
    
    for (const productData of mockData.products) {
      const product = productRepository.create(productData);
      await productRepository.save(product);
    }
    console.log(`${mockData.products.length} products created`);

    // Seed Orders and OrderItems
    console.log('Seeding orders...');
    const orderRepository = dataSource.getRepository(Order);
    const orderItemRepository = dataSource.getRepository(OrderItem);
    
    for (const orderData of mockData.orders) {
      const customer = await userRepository.findOne({ where: { id: orderData.customerId } });
      if (!customer) continue;

      const order = orderRepository.create({
        customer,
        createdAt: new Date(orderData.createdAt)
      });
      const savedOrder = await orderRepository.save(order);

      // Create order items
      for (const itemData of orderData.items) {
        const product = await productRepository.findOne({ where: { id: itemData.productId } });
        if (!product) continue;

        const orderItem = orderItemRepository.create({
          order: savedOrder,
          product,
          quantity: itemData.quantity
        });
        await orderItemRepository.save(orderItem);
      }
    }
    console.log(`${mockData.orders.length} orders created`);

    // Seed Supplier Interests
    console.log('Seeding supplier interests...');
    const supplierInterestRepository = dataSource.getRepository(SupplierInterest);
    
    for (const interestData of mockData.supplierInterests) {
      const supplier = await userRepository.findOne({ where: { id: interestData.supplierId } });
      const order = await orderRepository.findOne({ where: { id: interestData.orderId } });
      
      if (!supplier || !order) continue;

      const supplierInterest = supplierInterestRepository.create({
        supplier,
        order,
        isInterested: interestData.isInterested,
        notes: interestData.notes,
        createdAt: new Date(interestData.createdAt),
        updatedAt: new Date(interestData.updatedAt)
      });
      await supplierInterestRepository.save(supplierInterest);
    }
    console.log(`${mockData.supplierInterests.length} supplier interests created`);

    console.log('Database seeding completed successfully!');
    console.log('\nDemo Accounts:');
    console.log('Admin: admin@example.com / password123');
    console.log('Customer 1: ahmet@example.com / password123');
    console.log('Customer 2: fatma@example.com / password123');
    console.log('Customer 3: mehmet@example.com / password123');
    console.log('Supplier 1: ali@paketleme.com / password123');
    console.log('Supplier 2: ayse@ambalaj.com / password123');
    console.log('Supplier 3: can@kutu.com / password123');

  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await app.close();
  }
}

// Standalone seed function for npm run seed
async function seed() {
  await seedDatabase();
}

seed(); 