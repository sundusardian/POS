# POS Mobile Application

Expo React Native mobile application for staff to manage orders and operations on tablets and mobile devices.

## Features

### Staff Interface
- **Menu Page**: Browse and select menu items for orders
- **Cart Page**: Review selected items and quantities
- **Checkout Page**: Process payments, calculate change, print receipts
- **Incoming Orders**: Monitor and manage incoming customer orders
- **Landscape Mode**: Optimized for tablet use in landscape orientation

### Key Capabilities
- **Order Management**: Create and process customer orders
- **Payment Processing**: Handle cash, card, and digital wallet payments
- **Receipt Printing**: Generate and print order receipts
- **Real-time Updates**: Live order status and kitchen notifications
- **Offline Support**: Continue operations during network interruptions

## Tech Stack

- **Framework**: Expo (React Native)
- **Navigation**: Expo Router with file-based routing
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: React Context + Zustand
- **API Integration**: Custom API client with retry logic
- **Real-time**: Socket.IO client for WebSocket connections

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start the development server
npx expo start
```

### Running on Devices

```bash
# Start development server
npx expo start

# Run on Android device/emulator
npx expo start --android

# Run on iOS device/simulator (macOS only)
npx expo start --ios

# Run on web (for testing)
npx expo start --web
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:3001/api
EXPO_PUBLIC_API_URL_ANDROID=http://10.0.2.2:3001/api

# WebSocket Configuration
EXPO_PUBLIC_WS_URL=http://localhost:3001
EXPO_PUBLIC_WS_URL_ANDROID=http://10.0.2.2:3001

# App Configuration
EXPO_PUBLIC_APP_NAME="POS Mobile"
EXPO_PUBLIC_APP_VERSION="1.0.0"

# Development Configuration
NODE_ENV=development
```

## Project Structure

```
mobile/
├── app/                    # Expo Router pages
│   ├── (app)/             # Main app screens
│   │   ├── menu/          # Menu browsing
│   │   ├── cart/          # Shopping cart
│   │   ├── checkout/      # Payment processing
│   │   └── orders/        # Order management
│   ├── (auth)/            # Authentication screens
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── pos/              # POS-specific components
│   └── ui/               # UI components
├── lib/                  # Utilities and configurations
│   ├── api/              # API client
│   ├── store/            # State management
│   └── utils/            # Utility functions
├── assets/               # Images, fonts, etc.
└── .env.example          # Environment template
```

## Development Features

### Device Orientation
- **Landscape Mode**: Optimized for tablet use
- **Portrait Support**: Compatible with mobile devices
- **Responsive Design**: Adapts to different screen sizes

### Performance
- **Native Performance**: Expo's optimized runtime
- **Offline Capabilities**: Local data caching
- **Background Sync**: Queue orders when offline
- **Memory Management**: Efficient resource usage

### Development Tools
- **Hot Reload**: Instant code updates
- **Remote Debugging**: Chrome DevTools integration
- **Error Boundaries**: Graceful error handling
- **Logging**: Comprehensive debug logging

## Building for Production

### Development Build
```bash
# Create development build
npx expo install --fix
npx expo prebuild
npx expo run:android
npx expo run:ios
```

### Production Build
```bash
# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Build for both platforms
eas build --platform all
```

## Deployment

### EAS (Expo Application Services)
1. Install EAS CLI: `npm install -g eas-cli`
2. Configure EAS: `eas build:configure`
3. Build: `eas build --platform all`
4. Submit: `eas submit --platform all`

### Environment Variables for Production
Update production environment variables:
```env
EXPO_PUBLIC_API_URL=https://your-api-domain.com/api
EXPO_PUBLIC_WS_URL=https://your-api-domain.com
```
