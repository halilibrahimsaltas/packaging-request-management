import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
// import { seedDatabase } from './mock-data/seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: true, // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
  });

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global response interceptor
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  // Seed database on startup (only in development)
  // Temporarily disabled - will be enabled later
  // if (process.env.NODE_ENV !== 'production') {
  //   try {
  //     await seedDatabase();
  //     console.log('Database seeded successfully!');
  //   } catch (error) {
  //     console.log('Database seeding failed:', error.message);
  //   }
  // }

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
