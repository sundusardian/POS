import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Set global prefix for all routes
  app.setGlobalPrefix('api');
  
  // Enable CORS for web and mobile clients
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:8081'],
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
  
  // Start the server
  await app.listen(configService.get('PORT') || 3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
