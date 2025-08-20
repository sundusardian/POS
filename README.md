# POS System

A full-featured Point of Sale (POS) application with customer-facing web pages, admin dashboard, API, and mobile staff app.

## Tech Stack

- **Frontend Web**: Next.js (for both customer and admin interfaces)
- **Mobile App**: Expo (React Native), designed in landscape mode
- **Backend/API**: NestJS
- **Database**: SQLite (development) / PostgreSQL (production)
- **Real-time**: WebSocket integration with Socket.IO
- **Currency**: All transactions and display use IDR only
- **UI Components**: Shadcn UI

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd POS
   ```

2. **Set up environment variables**
   
   Copy the example environment files and configure them:
   
   ```bash
   # API Environment
   cp api/.env.example api/.env.development
   
   # Web Environment  
   cp web/.env.example web/.env.local
   
   # Mobile Environment
   cp mobile/.env.example mobile/.env.local
   ```

3. **Install dependencies and start all services**
   
   ```bash
   # Install root dependencies
   npm install
   
   # Start all services in development mode
   npm run dev
   ```
   
   This will start:
   - API server on http://localhost:3001
   - Web application on http://localhost:3000
   - Mobile app (Expo) on http://localhost:8081

### Individual Service Setup

#### API Server
```bash
cd api
npm install
cp .env.example .env.development
npm run dev
```

#### Web Application
```bash
cd web
npm install  
cp .env.example .env.local
npm run dev
```

#### Mobile Application
```bash
cd mobile
npm install
cp .env.example .env.local
npm start
```

## Development Stages

### 1. Customer-facing Web Pages ✅

The customer-facing web pages have been implemented with the following features:

- **Home Page**: Introduction to the restaurant
- **Menu Page**: Browse menu items by category and add them to cart
- **Cart Page**: Review items in cart, update quantities, and remove items
- **Checkout Page**: Complete order with various payment options (Credit Card, Bank Transfer, E-Wallet)

### 2. Admin Dashboard 

The admin dashboard includes:

- **Real-time Dashboard** 
  - Live order monitoring with status updates
  - Real-time sales figures and revenue tracking
  - Inventory alerts and low stock notifications
  - Staff activity monitoring
  - Branch performance metrics
  - WebSocket integration with connection status indicators

- Menu management
- Staff management
- Branch management
- Ingredient/stock management
- Accounting & purchasing page
- Desk management (including ability to print QR code linking to the customer menu page for each desk)
- Settings page

### 3. API

A centralized API with NestJS to serve data for all modules:

- Authentication and authorization
- Menu and order management
- Staff and branch management
- Inventory management

### 4. Mobile Staff App

A mobile app for staff with the following features:

- Menu page
- Cart page
- Checkout page (shows total, calculates change, option to print receipt)
- Incoming order page

## Environment Variables

### API (.env.development)
```bash
NODE_ENV=development
DATABASE_TYPE=sqlite
DATABASE_NAME=pos_dev.sqlite
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRATION=1d
FRONTEND_URL=http://localhost:3000
PORT=3001
```

### Web (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME="POS System"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NODE_ENV=development
```

### Mobile (.env.local)
```bash
EXPO_PUBLIC_API_URL=http://localhost:3001/api
EXPO_PUBLIC_API_URL_ANDROID=http://10.0.2.2:3001/api
EXPO_PUBLIC_WS_URL=http://localhost:3001
EXPO_PUBLIC_WS_URL_ANDROID=http://10.0.2.2:3001
EXPO_PUBLIC_APP_NAME="POS Mobile"
EXPO_PUBLIC_APP_VERSION="1.0.0"
NODE_ENV=development
```

## Project Structure

```
/
├── api/                    # NestJS API Server
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── branch/        # Branch management
│   │   ├── config/        # Configuration files
│   │   ├── desk/          # Desk & QR code management
│   │   ├── websocket/     # Real-time WebSocket gateways
│   │   └── prisma/        # Database schema & migrations
│   ├── .env.example       # Environment template
│   └── package.json
├── web/                   # Next.js Web Application
│   ├── app/
│   │   ├── (customer)/    # Customer-facing pages
│   │   └── admin/         # Admin dashboard
│   ├── components/        # Reusable UI components
│   ├── lib/              # Utilities, API clients, contexts
│   ├── .env.example      # Environment template
│   └── package.json
├── mobile/               # Expo React Native App
│   ├── app/             # App screens
│   ├── components/      # Mobile components
│   ├── lib/            # Mobile utilities
│   ├── .env.example    # Environment template
│   └── package.json
└── package.json         # Root package.json for scripts
```

## Features

### ✅ Completed Features

#### Customer Web Interface
- **Home Page**: Restaurant introduction
- **Menu Page**: Browse items by category, add to cart, QR code integration
- **Cart Page**: Review items, update quantities
- **Checkout Page**: Complete orders with payment options

#### Admin Dashboard
- **Real-time Dashboard** with WebSocket integration
  - Live order monitoring and status updates
  - Real-time sales figures and revenue tracking
  - Inventory alerts and low stock notifications
  - Staff activity monitoring
  - Branch performance metrics
- **Desk Management** with QR code generation and regeneration
- **Menu Management**: CRUD operations for menu items
- **Staff Management**: Employee management
- **Branch Management**: Multi-location support

#### API Server
- **Authentication**: JWT-based auth system
- **Real-time WebSocket**: Multi-namespace event system
- **Database**: Prisma ORM with SQLite/PostgreSQL support
- **QR Code Generation**: Desk-specific customer menu links

### 🚧 In Development
- Mobile staff application
- Payment gateway integration
- Advanced reporting features

## Development Notes

- **Database**: Uses SQLite for development, PostgreSQL for production
- **Real-time**: WebSocket integration with room-based subscriptions
- **QR Codes**: Generate customer menu links with desk/branch context
- **Currency**: All transactions use IDR formatting
- **Authentication**: JWT tokens with role-based access control