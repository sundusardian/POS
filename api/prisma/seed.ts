import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Use explicit typing for the PrismaClient instance
const prisma = new PrismaClient();

async function main(): Promise<void> {
  try {
    console.log('Starting seed process...');
    
    // Create admin user
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    
    // Create a manager user
    await prisma.user.create({
      data: {
        name: 'Manager User',
        email: 'manager@example.com',
        password: await bcrypt.hash('manager123', 10),
        role: 'MANAGER',
      },
    });
    
    // Create a staff user
    await prisma.user.create({
      data: {
        name: 'Staff User',
        email: 'staff@example.com',
        password: await bcrypt.hash('staff123', 10),
        role: 'STAFF',
      },
    });

    // Create categories
    console.log('Creating categories...');
    
    // Use explicit type annotations for created entities
    const foodCategory = await prisma.category.create({
      data: {
        name: 'Food',
        description: 'Delicious food items',
      },
    });
    
    const beverageCategory = await prisma.category.create({
      data: {
        name: 'Beverages',
        description: 'Refreshing drinks',
      },
    });
    
    const dessertCategory = await prisma.category.create({
      data: {
        name: 'Desserts',
        description: 'Sweet treats',
      },
    });
    
    // Create menu items
    console.log('Creating menu items...');
    
    // Food items
    await prisma.menuItem.create({
      data: {
        name: 'Nasi Goreng',
        description: 'Indonesian fried rice with vegetables and egg',
        price: 35000,
        categoryId: foodCategory.id,
        imageUrl: 'https://example.com/images/nasi-goreng.jpg',
      },
    });
    
    await prisma.menuItem.create({
      data: {
        name: 'Mie Goreng',
        description: 'Indonesian fried noodles with vegetables',
        price: 30000,
        categoryId: foodCategory.id,
        imageUrl: 'https://example.com/images/mie-goreng.jpg',
      },
    });
    
    await prisma.menuItem.create({
      data: {
        name: 'Sate Ayam',
        description: 'Chicken satay with peanut sauce',
        price: 40000,
        categoryId: foodCategory.id,
        imageUrl: 'https://example.com/images/sate-ayam.jpg',
      },
    });
    
    // Beverages
    await prisma.menuItem.create({
      data: {
        name: 'Es Teh',
        description: 'Indonesian iced tea',
        price: 10000,
        categoryId: beverageCategory.id,
        imageUrl: 'https://example.com/images/es-teh.jpg',
      },
    });
    
    await prisma.menuItem.create({
      data: {
        name: 'Es Jeruk',
        description: 'Fresh orange juice',
        price: 15000,
        categoryId: beverageCategory.id,
        imageUrl: 'https://example.com/images/es-jeruk.jpg',
      },
    });
    
    // Desserts
    await prisma.menuItem.create({
      data: {
        name: 'Es Krim',
        description: 'Ice cream with various flavors',
        price: 20000,
        categoryId: dessertCategory.id,
        imageUrl: 'https://example.com/images/es-krim.jpg',
      },
    });
    
    await prisma.menuItem.create({
      data: {
        name: 'Pisang Goreng',
        description: 'Fried banana with honey',
        price: 15000,
        categoryId: dessertCategory.id,
        imageUrl: 'https://example.com/images/pisang-goreng.jpg',
      },
    });
    
    // Create branches
    console.log('Creating branches...');
    
    const mainBranch = await prisma.branch.create({
      data: {
        name: 'Main Branch',
        address: '123 Main Street, City Center',
        phone: '+62 123-456-7890',
      },
    });
    
    const downtownBranch = await prisma.branch.create({
      data: {
        name: 'Downtown Branch',
        address: '456 Downtown Avenue, Downtown',
        phone: '+62 098-765-4321',
      },
    });
    
    // Create desks
    console.log('Creating desks...');
    
    // Main branch desks
    for (let i = 1; i <= 10; i++) {
      await prisma.desk.create({
        data: {
          number: `A${i}`,
          capacity: 4,
          branchId: mainBranch.id,
          qrCode: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==`, // Placeholder QR code
        },
      });
    }
    
    // Downtown branch desks
    for (let i = 1; i <= 8; i++) {
      await prisma.desk.create({
        data: {
          number: `B${i}`,
          capacity: i % 3 === 0 ? 6 : 4, // Some tables with capacity 6
          branchId: downtownBranch.id,
          qrCode: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==`, // Placeholder QR code
        },
      });
    }

    console.log('✅ Desks seeded successfully');

    // Seed sample orders
    console.log('🛒 Seeding sample orders...');
    
    const menuItems = await prisma.menuItem.findMany();
    const desks = await prisma.desk.findMany();
    const staffUser = await prisma.user.findFirst({ where: { role: 'STAFF' } });
    
    // Create a few sample orders
    const sampleOrders = [
      {
        customerName: 'John Doe',
        customerPhone: '+62812345678',
        notes: 'Extra spicy please',
        status: 'PREPARING' as const,
        items: [
          { menuItemId: menuItems[0].id, quantity: 2 },
          { menuItemId: menuItems[1].id, quantity: 1 },
        ],
      },
      {
        customerName: 'Jane Smith',
        customerPhone: '+62887654321',
        notes: 'No ice',
        status: 'READY' as const,
        items: [
          { menuItemId: menuItems[2].id, quantity: 1 },
          { menuItemId: menuItems[3].id, quantity: 2 },
        ],
      },
      {
        customerName: 'Bob Wilson',
        status: 'PENDING' as const,
        items: [
          { menuItemId: menuItems[4].id, quantity: 1 },
        ],
      },
    ];

    for (let i = 0; i < sampleOrders.length; i++) {
      const orderData = sampleOrders[i];
      const desk = desks[i % desks.length];
      
      // Calculate total amount
      let totalAmount = 0;
      const orderItemsData: any[] = [];
      
      for (const item of orderData.items) {
        const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
        if (menuItem) {
          const itemTotal = Number(menuItem.price) * item.quantity;
          totalAmount += itemTotal;
          
          orderItemsData.push({
            menuItem: {
              connect: { id: item.menuItemId },
            },
            quantity: item.quantity,
            unitPrice: menuItem.price,
            totalPrice: new Prisma.Decimal(itemTotal),
          });
        }
      }
      
      const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(i + 1).padStart(4, '0')}`;
      
      await prisma.order.create({
        data: {
          orderNumber,
          customerName: orderData.customerName,
          customerPhone: orderData.customerPhone,
          notes: orderData.notes,
          status: orderData.status,
          totalAmount,
          desk: {
            connect: { id: desk.id },
          },
          branch: {
            connect: { id: desk.branchId },
          },
          staff: staffUser ? {
            connect: { id: staffUser.id },
          } : undefined,
          orderItems: {
            create: orderItemsData,
          },
        },
      });
    }
    
    console.log('✅ Sample orders seeded successfully');
    console.log('🎉 Seed completed successfully!');
  } catch (error) {
    console.error('Seed failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
