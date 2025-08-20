# POS System

A full-featured Point of Sale (POS) application with customer-facing web pages, admin dashboard, API, and mobile staff app.

## Tech Stack

- **Frontend Web**: Next.js (for both customer and admin interfaces)
- **Mobile App**: Expo (React Native), designed in landscape mode
- **Backend/API**: NestJS
- **Currency**: All transactions and display use IDR only
- **UI Components**: Shadcn UI

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

## Getting Started

### Web Application

```bash
# Navigate to the web directory
cd web

# Install dependencies
npm install

# Run the development server
npm run dev
```

## Project Structure

```
/
├── api/            # NestJS API
├── mobile/         # Expo React Native mobile app
├── web/            # Next.js web application
│   ├── app/        # Next.js App Router
│   │   ├── (customer)/  # Customer-facing pages
│   │   └── (admin)/     # Admin dashboard pages (to be implemented)
│   ├── components/ # UI components
│   └── lib/        # Utility functions and context providers
└── guidelines.txt  # Project requirements and guidelines
```

## Current Status

The customer-facing web pages have been implemented with mock data. The next step is to develop the admin dashboard.