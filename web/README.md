# POS Web Application

Next.js-based web application providing customer-facing pages and admin dashboard for the POS system.

## Features

### Customer Interface
- **Home Page**: Restaurant introduction and branding
- **Menu Page**: Browse menu items by category with QR code integration
- **Cart Page**: Review items, update quantities, and remove items
- **Checkout Page**: Complete orders with multiple payment options

### Admin Dashboard
- **Real-time Dashboard**: Live metrics with WebSocket integration
- **Desk Management**: QR code generation and table management
- **Menu Management**: CRUD operations for menu items and categories
- **Staff Management**: Employee management and role assignment
- **Branch Management**: Multi-location support

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + Shadcn UI components
- **State Management**: React Context + SWR for data fetching
- **Real-time**: Socket.IO client for WebSocket connections
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: Sonner (toast notifications)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Navigate to web directory
cd web

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# WebSocket Configuration
NEXT_PUBLIC_WS_URL=http://localhost:3001

# App Configuration
NEXT_PUBLIC_APP_NAME="POS System"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# Development Mode
NODE_ENV=development
```

## Project Structure

```
web/
├── app/                    # Next.js App Router
│   ├── (customer)/        # Customer-facing pages
│   │   ├── page.tsx       # Home page
│   │   ├── menu/          # Menu browsing
│   │   ├── cart/          # Shopping cart
│   │   └── checkout/      # Order completion
│   └── admin/             # Admin dashboard
│       ├── dashboard/     # Main dashboard
│       ├── desks/         # Desk management
│       ├── menu/          # Menu management
│       ├── staff/         # Staff management
│       └── branches/      # Branch management
├── components/            # Reusable UI components
│   ├── ui/               # Shadcn UI components
│   ├── admin/            # Admin-specific components
│   └── customer/         # Customer-specific components
├── lib/                  # Utilities and configurations
│   ├── api-client.ts     # API client
│   ├── websocket/        # WebSocket contexts
│   ├── hooks.ts          # Custom React hooks
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Linting
npm run lint

# Type checking
npm run type-check
```

## Key Features

### Real-time Integration
- WebSocket connections for live updates
- Real-time order status changes
- Live inventory alerts
- Staff activity monitoring

### QR Code Integration
- Table-specific QR codes
- Automatic desk/branch detection
- Seamless customer experience

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interfaces

### Performance
- Server-side rendering (SSR)
- Static generation where possible
- Optimized images and fonts
- Code splitting and lazy loading

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow Next.js best practices
- Use Tailwind CSS for styling
- Implement proper error handling

### Component Structure
- Keep components small and focused
- Use custom hooks for logic
- Implement proper loading states
- Handle error boundaries

### API Integration
- Use SWR for data fetching
- Implement proper caching
- Handle loading and error states
- Use TypeScript interfaces

## Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Environment Variables for Production
Update `.env.production` with production URLs:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_WS_URL=https://your-api-domain.com
```

### Vercel Deployment
The application is optimized for Vercel deployment:
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch
