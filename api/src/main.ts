import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  
  // Serve static files for WebSocket test client and landing page
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/',
    index: 'index.html',
  });
  
  // Set global prefix for API routes only
  app.setGlobalPrefix('api', {
    exclude: ['/websocket-test', '/test', '/'],
  });
  
  // Enable CORS for frontend applications and WebSocket test client
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:8081', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });
  
  // Enable validation pipes globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw errors if non-whitelisted properties are present
      transform: true, // Auto-transform payloads to DTO instances
    }),
  );

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('POS System API')
    .setDescription('A comprehensive Point of Sale system API with order management, inventory control, and staff management')
    .setVersion('1.0')
    .addTag('auth', 'Authentication and authorization')
    .addTag('users', 'User management')
    .addTag('staff', 'Staff management')
    .addTag('branches', 'Branch management')
    .addTag('desks', 'Desk and table management')
    .addTag('categories', 'Menu category management')
    .addTag('menu-items', 'Menu item management')
    .addTag('orders', 'Order management and processing')
    .addTag('inventory', 'Inventory overview and reporting')
    .addTag('ingredients', 'Ingredient management')
    .addTag('stock', 'Stock management and tracking')
    .addTag('suppliers', 'Supplier management')
    .addTag('reports', 'Sales reports and analytics')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
  
  // Start the server
  await app.listen(configService.get('PORT') || 3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
