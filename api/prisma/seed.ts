import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Use explicit typing for the PrismaClient instance
const prisma = new PrismaClient();

async function main(): Promise<void> {
  try {
    console.log('Starting seed process...');
    
    // Create branches first
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
    
    console.log('✅ Branches created successfully');
    
    // Create users
    console.log('Creating users...');
    
    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'ADMIN',
      },
    });
    
    // Create manager user
    const managerUser = await prisma.user.create({
      data: {
        name: 'Manager User',
        email: 'manager@example.com',
        password: await bcrypt.hash('manager123', 10),
        role: 'MANAGER',
      },
    });
    
    // Create staff user
    const staffUser = await prisma.user.create({
      data: {
        name: 'Staff User',
        email: 'staff@example.com',
        password: await bcrypt.hash('staff123', 10),
        role: 'STAFF',
      },
    });
    
    console.log('✅ Users created successfully');
    
    // Update users with primary branch using raw SQL
    console.log('Setting primary branches for users...');
    
    try {
      await prisma.$executeRaw`UPDATE "users" SET "primaryBranchId" = ${mainBranch.id} WHERE "email" = 'admin@example.com'`;
      await prisma.$executeRaw`UPDATE "users" SET "primaryBranchId" = ${mainBranch.id} WHERE "email" = 'manager@example.com'`;
      await prisma.$executeRaw`UPDATE "users" SET "primaryBranchId" = ${mainBranch.id} WHERE "email" = 'staff@example.com'`;
      
      console.log('✅ Primary branches set successfully');
    } catch (error) {
      console.error('Error setting primary branches:', error);
    }
    
    // Create user-branch assignments using raw SQL
    console.log('Creating user-branch assignments...');
    
    try {
      // Admin has access to all branches
      await prisma.userBranch.createMany({
        data: [
          {
            userId: adminUser.id,
            branchId: mainBranch.id,
          },
          {
            userId: adminUser.id,
            branchId: downtownBranch.id,
          },
        ],
      });
      
      // Manager has access to all branches
      await prisma.userBranch.createMany({
        data: [
          {
            userId: managerUser.id,
            branchId: mainBranch.id,
          },
          {
            userId: managerUser.id,
            branchId: downtownBranch.id,
          },
        ],
      });
      
      // Staff only has access to main branch
      await prisma.userBranch.create({
        data: {
          userId: staffUser.id,
          branchId: mainBranch.id,
        },
      });
      
      console.log('✅ User-branch assignments created successfully');
    } catch (error) {
      console.error('Error creating user-branch assignments:', error);
    }

    // Create categories
    console.log('Creating categories...');
    
    const foodCategory = await prisma.category.create({
      data: {
        name: 'Food',
        description: 'Main dishes and appetizers',
      },
    });
    
    const beverageCategory = await prisma.category.create({
      data: {
        name: 'Beverage',
        description: 'Drinks and refreshments',
      },
    });
    
    const dessertCategory = await prisma.category.create({
      data: {
        name: 'Dessert',
        description: 'Sweet treats and desserts',
      },
    });
    
    console.log('✅ Categories created successfully');
    
    // Create menu items
    console.log('Creating menu items...');
    
    // Food items
    await prisma.menuItem.create({
      data: {
        name: 'Nasi Goreng',
        description: 'Indonesian fried rice with sweet soy sauce',
        price: 25000,
        categoryId: foodCategory.id,
        imageUrl: 'https://example.com/images/nasi-goreng.jpg',
      },
    });
    
    await prisma.menuItem.create({
      data: {
        name: 'Mie Goreng',
        description: 'Indonesian fried noodles with vegetables',
        price: 23000,
        categoryId: foodCategory.id,
        imageUrl: 'https://example.com/images/mie-goreng.jpg',
      },
    });
    
    await prisma.menuItem.create({
      data: {
        name: 'Ayam Bakar',
        description: 'Grilled chicken with special sauce',
        price: 30000,
        categoryId: foodCategory.id,
        imageUrl: 'https://example.com/images/ayam-bakar.jpg',
      },
    });
    
    // Beverages
    await prisma.menuItem.create({
      data: {
        name: 'Es Teh',
        description: 'Indonesian iced tea',
        price: 8000,
        categoryId: beverageCategory.id,
        imageUrl: 'https://example.com/images/es-teh.jpg',
      },
    });
    
    await prisma.menuItem.create({
      data: {
        name: 'Es Jeruk',
        description: 'Fresh orange juice with ice',
        price: 10000,
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

    // Create ingredients
    console.log('Creating ingredients...');
    
    const ingredients = [
      { name: 'Rice', unit: 'kg', unitPrice: 15000 },
      { name: 'Chicken', unit: 'kg', unitPrice: 35000 },
      { name: 'Noodles', unit: 'kg', unitPrice: 20000 },
      { name: 'Cooking Oil', unit: 'liter', unitPrice: 25000 },
      { name: 'Sugar', unit: 'kg', unitPrice: 12000 },
      { name: 'Tea', unit: 'kg', unitPrice: 40000 },
      { name: 'Orange', unit: 'kg', unitPrice: 18000 },
      { name: 'Banana', unit: 'kg', unitPrice: 15000 },
      { name: 'Ice Cream Base', unit: 'liter', unitPrice: 30000 },
    ];
    
    for (const ingredient of ingredients) {
      await prisma.ingredient.create({
        data: ingredient,
      });
    }
    
    console.log('✅ Ingredients created successfully');
    
    // Create stock for each branch
    console.log('Creating stock...');
    
    const allIngredients = await prisma.ingredient.findMany();
    
    // Create stock for main branch
    for (const ingredient of allIngredients) {
      await prisma.stock.create({
        data: {
          ingredientId: ingredient.id,
          branchId: mainBranch.id,
          quantity: Math.floor(Math.random() * 50) + 10, // Random quantity between 10-60
          minQuantity: 5, // Using minQuantity instead of minimumLevel
          unitCost: ingredient.unitPrice.toNumber() * 0.7, // Cost is 70% of selling price
        },
      });
    }
    
    // Create stock for downtown branch
    for (const ingredient of allIngredients) {
      await prisma.stock.create({
        data: {
          ingredientId: ingredient.id,
          branchId: downtownBranch.id,
          quantity: Math.floor(Math.random() * 30) + 5, // Random quantity between 5-35
          minQuantity: 5, // Using minQuantity instead of minimumLevel
          unitCost: ingredient.unitPrice.toNumber() * 0.7, // Cost is 70% of selling price
        },
      });
    }
    
    console.log('✅ Stock created successfully');
    
    // Create menu item ingredient relationships
    console.log('Creating menu item ingredients...');
    
    // Map ingredients to menu items
    const menuItemIngredients = [
      { menuItemName: 'Nasi Goreng', ingredients: [
        { ingredientName: 'Rice', quantity: 0.2 },
        { ingredientName: 'Cooking Oil', quantity: 0.05 },
      ]},
      { menuItemName: 'Mie Goreng', ingredients: [
        { ingredientName: 'Noodles', quantity: 0.2 },
        { ingredientName: 'Cooking Oil', quantity: 0.05 },
      ]},
      { menuItemName: 'Ayam Bakar', ingredients: [
        { ingredientName: 'Chicken', quantity: 0.25 },
        { ingredientName: 'Cooking Oil', quantity: 0.03 },
      ]},
      { menuItemName: 'Es Teh', ingredients: [
        { ingredientName: 'Tea', quantity: 0.01 },
        { ingredientName: 'Sugar', quantity: 0.02 },
      ]},
      { menuItemName: 'Es Jeruk', ingredients: [
        { ingredientName: 'Orange', quantity: 0.3 },
        { ingredientName: 'Sugar', quantity: 0.02 },
      ]},
      { menuItemName: 'Es Krim', ingredients: [
        { ingredientName: 'Ice Cream Base', quantity: 0.1 },
        { ingredientName: 'Sugar', quantity: 0.01 },
      ]},
      { menuItemName: 'Pisang Goreng', ingredients: [
        { ingredientName: 'Banana', quantity: 0.2 },
        { ingredientName: 'Cooking Oil', quantity: 0.1 },
        { ingredientName: 'Sugar', quantity: 0.01 },
      ]},
    ];
    
    // Create the relationships
    for (const item of menuItemIngredients) {
      const menuItem = await prisma.menuItem.findFirst({
        where: { name: item.menuItemName },
      });
      
      if (menuItem) {
        for (const ingredientData of item.ingredients) {
          const ingredient = await prisma.ingredient.findFirst({
            where: { name: ingredientData.ingredientName },
          });
          
          if (ingredient) {
            await prisma.menuItemIngredient.create({
              data: {
                menuItemId: menuItem.id,
                ingredientId: ingredient.id,
                quantity: ingredientData.quantity,
              },
            });
          }
        }
      }
    }
    
    console.log('✅ Menu item ingredients created successfully');
    
    // Create sample orders with correct schema
    console.log('Creating sample orders...');
    
    const menuItems = await prisma.menuItem.findMany();
    const desks = await prisma.desk.findMany();
    
    // Generate a unique order number
    const generateOrderNumber = () => {
      const date = new Date();
      const year = date.getFullYear().toString().substr(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `ORD-${year}${month}${day}-${random}`;
    };
    
    // Create a sample order
    const createSampleOrder = async (status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED', desk: any) => {
      const orderItems = [] as any;
      const itemCount = Math.floor(Math.random() * 3) + 1; // 1-3 items per order
      
      // Select random menu items
      for (let i = 0; i < itemCount; i++) {
        const randomMenuItem = menuItems[Math.floor(Math.random() * menuItems.length)];
        const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity
        
        orderItems.push({
          menuItem: { connect: { id: randomMenuItem.id } },
          quantity: quantity,
          unitPrice: randomMenuItem.price,
          totalPrice: randomMenuItem.price.toNumber() * quantity,
          notes: Math.random() > 0.7 ? 'Special request' : '',
        });
      }
      
      // Calculate total amount
      const totalAmount = orderItems.reduce((sum, item) => sum + Number(item.totalPrice), 0);
      
      // Create the order
      const order = await prisma.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          status: status,
          totalAmount: totalAmount,
          customerName: ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown'][Math.floor(Math.random() * 4)],
          customerPhone: `+628${Math.floor(Math.random() * 100000000)}`,
          notes: Math.random() > 0.7 ? 'Please serve quickly' : '',
          desk: { connect: { id: desk.id } },
          branch: { connect: { id: desk.branchId } },
          staff: { connect: { id: staffUser.id } },
          orderItems: {
            create: orderItems
          }
        },
        include: {
          orderItems: true
        }
      });
      
      // Add payment for completed orders
      if (status === 'COMPLETED') {
        await prisma.payment.create({
          data: {
            amount: totalAmount,
            paymentMethod: Math.random() > 0.5 ? 'CASH' : 'CARD',
            status: 'PAID',
            order: { connect: { id: order.id } }
          }
        });
      }
      
      return order;
    };
    
    // Create orders for each status
    const statuses: Array<'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED'> = [
      'PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'
    ];
    
    for (const status of statuses) {
      // Create 1-3 orders for each status
      const orderCount = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < orderCount; i++) {
        // Pick a random desk
        const randomDesk = desks[Math.floor(Math.random() * desks.length)];
        await createSampleOrder(status, randomDesk);
      }
    }
    
    console.log('✅ Sample orders created successfully');
    
    console.log('✅ Seed completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
