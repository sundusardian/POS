import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { CategoryService } from '../../menu/category.service';
import { MenuService } from '../../menu/menu.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    const categoryService = app.get(CategoryService);
    const menuService = app.get(MenuService);
    
    // Create categories
    console.log('Creating categories...');
    
    const foodCategory = await categoryService.create({
      name: 'Food',
      description: 'Delicious food items',
    });
    
    const beverageCategory = await categoryService.create({
      name: 'Beverages',
      description: 'Refreshing drinks',
    });
    
    const dessertCategory = await categoryService.create({
      name: 'Desserts',
      description: 'Sweet treats',
    });
    
    // Create menu items
    console.log('Creating menu items...');
    
    // Food items
    await menuService.create({
      name: 'Nasi Goreng',
      description: 'Indonesian fried rice with vegetables and egg',
      price: 35000,
      categoryId: foodCategory.id,
      imageUrl: 'https://example.com/images/nasi-goreng.jpg',
    });
    
    await menuService.create({
      name: 'Mie Goreng',
      description: 'Indonesian fried noodles with vegetables',
      price: 30000,
      categoryId: foodCategory.id,
      imageUrl: 'https://example.com/images/mie-goreng.jpg',
    });
    
    await menuService.create({
      name: 'Sate Ayam',
      description: 'Chicken satay with peanut sauce',
      price: 40000,
      categoryId: foodCategory.id,
      imageUrl: 'https://example.com/images/sate-ayam.jpg',
    });
    
    // Beverages
    await menuService.create({
      name: 'Es Teh',
      description: 'Indonesian iced tea',
      price: 10000,
      categoryId: beverageCategory.id,
      imageUrl: 'https://example.com/images/es-teh.jpg',
    });
    
    await menuService.create({
      name: 'Es Jeruk',
      description: 'Fresh orange juice',
      price: 15000,
      categoryId: beverageCategory.id,
      imageUrl: 'https://example.com/images/es-jeruk.jpg',
    });
    
    // Desserts
    await menuService.create({
      name: 'Es Krim',
      description: 'Ice cream with various flavors',
      price: 20000,
      categoryId: dessertCategory.id,
      imageUrl: 'https://example.com/images/es-krim.jpg',
    });
    
    await menuService.create({
      name: 'Pisang Goreng',
      description: 'Fried banana with honey',
      price: 15000,
      categoryId: dessertCategory.id,
      imageUrl: 'https://example.com/images/pisang-goreng.jpg',
    });
    
    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
