import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "POS System",
  description: "Point of Sale System with customer and admin interfaces",
};

import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import { WebSocketProvider } from "@/lib/websocket-context";
import { Toaster } from "@/components/ui/sonner";
import { SWRConfig } from 'swr';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <SWRConfig 
            value={{
              refreshInterval: 30000, // Refresh data every 30 seconds
              revalidateOnFocus: false,
              errorRetryCount: 3,
            }}
          >
            <WebSocketProvider>
              <CartProvider>
                {children}
                <Toaster />
              </CartProvider>
            </WebSocketProvider>
          </SWRConfig>
        </AuthProvider>
      </body>
    </html>
  );
}
