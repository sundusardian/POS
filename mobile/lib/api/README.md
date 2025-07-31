# API Client Architecture

This directory contains the modular API client architecture for the React Native mobile app, organized by features for better maintainability and separation of concerns.

## Directory Structure

```
lib/api/
├── index.ts              # Main API client that combines all features
├── base-client.ts        # Base API client with core functionality
├── token-manager.ts      # Token storage utilities
├── types.ts              # Shared TypeScript interfaces
├── auth-client.ts        # Authentication API endpoints
├── menu-client.ts        # Menu and category API endpoints
├── order-client.ts       # Order management API endpoints
├── branch-client.ts      # Branch and desk API endpoints
└── README.md            # This documentation file
```

## Usage

### Basic Usage
```typescript
import { apiClient } from '../lib/api';

// Authentication
await apiClient.auth.login({ email, password });
await apiClient.auth.register({ email, password, name });
await apiClient.auth.validateToken();

// Menu management
const categories = await apiClient.menu.getCategories();
const menuItems = await apiClient.menu.getMenuItems();

// Order management
const orders = await apiClient.orders.getOrders();
await apiClient.orders.createOrder(orderData);

// Branch management
const branches = await apiClient.branches.getBranches();
const desks = await apiClient.branches.getDesks();
```

### Token Management
```typescript
import { storeToken, getStoredToken, removeStoredToken } from '../lib/api';

// Store authentication token
await storeToken('your-jwt-token');

// Retrieve stored token
const token = await getStoredToken();

// Remove token (logout)
await removeStoredToken();
```

### Types
```typescript
import { User, Order, MenuItem, Branch } from '../lib/api';

const user: User = {
  id: '1',
  email: 'user@example.com',
  name: 'John Doe',
  role: 'STAFF'
};
```

## Features

### 1. Authentication Client (`auth-client.ts`)
- Login/register/logout
- Password reset
- Token validation and refresh
- User profile management

### 2. Menu Client (`menu-client.ts`)
- Category CRUD operations
- Menu item CRUD operations
- Category-based filtering

### 3. Order Client (`order-client.ts`)
- Order CRUD operations
- Order status management
- Order item management
- Filtering and search

### 4. Branch Client (`branch-client.ts`)
- Branch CRUD operations
- Desk/table management
- Branch-based filtering

### 5. Base Client (`base-client.ts`)
- Core HTTP request functionality
- Automatic token injection
- Error handling and logging
- Connection testing

### 6. Token Manager (`token-manager.ts`)
- Cross-platform token storage
- Secure storage using expo-secure-store
- Web localStorage fallback

## Migration from Old API Client

The old `api-client.ts` file has been replaced with this modular structure. Update your imports:

```typescript
// Old way
import { apiClient } from '../lib/api-client';
await apiClient.login(credentials);

// New way
import { apiClient } from '../lib/api';
await apiClient.auth.login(credentials);
```

## Benefits

1. **Separation of Concerns**: Each feature has its own client
2. **Better Organization**: Related endpoints are grouped together
3. **Type Safety**: Comprehensive TypeScript interfaces
4. **Maintainability**: Easier to add new features and endpoints
5. **Testability**: Each client can be tested independently
6. **Reusability**: Clients can be used across different parts of the app

## Adding New Features

To add a new feature (e.g., payments):

1. Create `payment-client.ts` with the PaymentApiClient class
2. Add payment-related types to `types.ts`
3. Add the payment client to the main ApiClient in `index.ts`
4. Export the new client and types from `index.ts`

Example:
```typescript
// payment-client.ts
export class PaymentApiClient extends BaseApiClient {
  async processPayment(data: PaymentDto): Promise<Payment> {
    return this.request<Payment>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// index.ts
export class ApiClient {
  public payments: PaymentApiClient;
  
  constructor(baseURL: string) {
    this.payments = new PaymentApiClient(baseURL);
  }
}
```
