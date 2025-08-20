# 🏪 POS System API

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

<p align="center">
  A comprehensive Point of Sale (POS) system backend API built with NestJS and Prisma ORM, featuring real-time order updates, inventory management, and multi-branch support.
</p>
## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with role-based access control
- User roles: ADMIN, MANAGER, STAFF, CUSTOMER
- Secure password hashing with bcrypt
- Protected endpoints with guards and decorators

### 📦 Order Management
- Complete order lifecycle management
- Order status tracking (PENDING → CONFIRMED → PREPARING → READY → SERVED → COMPLETED)
- Unique order number generation
- Payment processing with multiple methods (CASH, CARD, DIGITAL_WALLET)
- Order cancellation and refund handling

### 📊 Inventory Management
- Real-time stock tracking across multiple branches
- Ingredient management with categories and units
- Stock movement history and audit trails
- Low stock and expiry date alerts
- Supplier management with pricing
- Automatic stock deduction on orders

### 🏢 Multi-Branch Support
- Branch and desk management
- QR code generation for table ordering
- Branch-specific inventory and staff
- Location-based order routing

### 🔄 Real-time Updates
- WebSocket-based real-time notifications
- Kitchen display system integration
- Customer order status updates
- Inventory alerts and notifications
- Role-based event broadcasting

### 📚 API Documentation
- Comprehensive Swagger/OpenAPI documentation
- Interactive API testing interface
- Detailed request/response schemas
- Authentication examples and guides

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- SQLite (for development) or PostgreSQL (for production)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd POS/api

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.development
# Edit .env.development with your configuration

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database with sample data (optional)
npx prisma db seed
```

### Running the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

The API will be available at `http://localhost:3001`

## 📖 API Documentation

### Swagger UI
Access the interactive API documentation at:
- **Development**: http://localhost:3001/api/docs
- **Production**: https://your-domain.com/api/docs

### WebSocket Test Client
Test real-time features at:
- **Development**: http://localhost:3001/websocket-test.html

### Authentication

1. **Login** to get JWT token:
```bash
POST /auth/login
{
  "email": "admin@pos.com",
  "password": "admin123"
}
```

2. **Use token** in subsequent requests:
```bash
Authorization: Bearer <your-jwt-token>
```

### Key Endpoints

#### Orders
- `POST /orders` - Create new order
- `GET /orders` - List orders with filters
- `GET /orders/:id` - Get order details
- `PATCH /orders/:id` - Update order status
- `POST /orders/:id/cancel` - Cancel order
- `POST /orders/payment` - Process payment

#### Inventory
- `GET /inventory/overview` - Dashboard overview
- `GET /inventory/report` - Detailed inventory report
- `GET /ingredients` - List ingredients
- `GET /stock` - Stock levels by branch
- `GET /stock/alerts` - Low stock alerts

#### Menu Management
- `GET /categories` - Menu categories
- `GET /menu-items` - Menu items
- `POST /menu-items` - Create menu item

## 🏗️ Architecture

### Technology Stack
- **Framework**: NestJS (Node.js)
- **Database**: Prisma ORM with SQLite/PostgreSQL
- **Authentication**: JWT with Passport
- **Real-time**: Socket.IO WebSockets
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator
- **Testing**: Jest

### Project Structure
```bash
src/
├── auth/              # Authentication module
├── order/             # Order management
├── inventory/         # Inventory system
│   ├── ingredient.service.ts
│   ├── stock.service.ts
│   └── supplier.service.ts
├── menu/              # Menu management
├── staff/             # Staff management
├── branch/            # Branch management
├── websocket/         # Real-time updates
├── prisma/            # Database service
└── main.ts            # Application bootstrap
```

### Database Schema
- **Users & Staff**: Authentication and role management
- **Branches & Desks**: Multi-location support
- **Menu & Categories**: Product catalog
- **Orders & Payments**: Transaction management
- **Inventory**: Stock tracking and supplier management

## 🔄 Real-time Features

### WebSocket Events
- `orderCreated` - New order notifications
- `orderStatusChanged` - Order progress updates
- `orderCancelled` - Cancellation alerts
- `paymentReceived` - Payment confirmations
- `kitchenAlert` - Kitchen display notifications
- `inventoryAlert` - Stock level warnings

### Room Management
- Role-based rooms (`role:STAFF`, `role:MANAGER`)
- Branch-specific rooms (`branch:branch-id`)
- Order tracking rooms (`order:order-id`)
- Customer desk rooms (`desk:desk-id`)

## 🧪 Testing

```bash
# Unit tests
npm run test

# Integration tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 🚀 Deployment

### Environment Variables
```env
# Environment
NODE_ENV=development

# Database Configuration
DATABASE_TYPE=sqlite
DATABASE_NAME=pos_dev.sqlite

# For PostgreSQL (production)
# DATABASE_TYPE=postgres
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
# DATABASE_USERNAME=postgres
# DATABASE_PASSWORD=your_password_here
# DATABASE_NAME=pos_prod

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRATION=1d

# Frontend URL (for QR code generation)
FRONTEND_URL=http://localhost:3000

# Server Configuration
PORT=3001
```

### Docker Deployment
```bash
# Build image
docker build -t pos-api .

# Run container
docker run -p 3001:3001 --env-file .env pos-api
```

### Production Checklist
- [ ] Set strong JWT secret
- [ ] Configure production database
- [ ] Set up SSL/HTTPS
- [ ] Configure CORS origins
- [ ] Set up monitoring and logging
- [ ] Run database migrations
- [ ] Set up backup strategy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the [API documentation](http://localhost:3001/api/docs)
- Review the [WebSocket test client](http://localhost:3001/websocket-test.html)

## 🗺️ Roadmap

- [ ] Advanced reporting and analytics
- [ ] Mobile app integration
- [ ] Payment gateway integration
- [ ] Multi-currency support
- [ ] Loyalty program features
- [ ] Advanced inventory forecasting
- [ ] Kitchen display system
- [ ] Customer feedback system

---
**Built with ❤️ using NestJS and Prisma**
