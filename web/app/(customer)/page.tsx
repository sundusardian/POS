"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Utensils, Clock, Star, ShoppingBag } from "lucide-react";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        <Image 
          src="/images/restaurant-hero.jpg" 
          alt="Restaurant atmosphere" 
          fill 
          className="object-cover"
          priority
        />
        
        {/* Hero Content */}
        <div className="relative z-20 container mx-auto h-full flex flex-col justify-center items-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Welcome to <span className="text-primary">Our Restaurant</span>
            </h1>
            <p className="mt-6 max-w-3xl text-lg text-white/90">
              Explore our delicious menu and place your order online.
              We offer a wide variety of dishes prepared with the freshest ingredients.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row justify-center">
              <Button 
                asChild
                size="lg" 
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-medium px-8 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 gap-2"
              >
                <Link href="/menu">
                  View Menu <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="lg" 
                className="border-primary/20 text-primary hover:bg-primary/10 hover:text-primary rounded-full transition-all duration-300 gap-2"
              >
                <Link href="/cart">
                  View Cart <ShoppingBag className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        </motion.div>
        
        <motion.div 
          className="grid gap-8 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="group">
            <Card className="flex flex-col items-center text-center p-6 border-primary/10 hover:border-primary/30 transition-all duration-300 overflow-hidden hover:shadow-md">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-70"></div>
              <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors duration-300">
                <Utensils className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-primary">Quality Ingredients</h3>
              <p className="mt-2 text-muted-foreground">
                We use only the freshest and highest quality ingredients in all our dishes.
              </p>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants} className="group">
            <Card className="flex flex-col items-center text-center p-6 border-secondary/10 hover:border-secondary/30 transition-all duration-300 overflow-hidden hover:shadow-md">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-accent opacity-70"></div>
              <div className="rounded-full bg-secondary/10 p-4 group-hover:bg-secondary/20 transition-colors duration-300">
                <Clock className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-secondary">Fast Delivery</h3>
              <p className="mt-2 text-muted-foreground">
                We ensure your food is delivered promptly while still hot and fresh.
              </p>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants} className="group">
            <Card className="flex flex-col items-center text-center p-6 border-accent/10 hover:border-accent/30 transition-all duration-300 overflow-hidden hover:shadow-md">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-primary opacity-70"></div>
              <div className="rounded-full bg-accent/10 p-4 group-hover:bg-accent/20 transition-colors duration-300">
                <Star className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-accent">Satisfaction Guaranteed</h3>
              <p className="mt-2 text-muted-foreground">
                We&apos;re committed to ensuring you&apos;re completely satisfied with your meal.
              </p>
            </Card>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Featured Categories */}
      <div className="container py-16 bg-muted/30">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Featured Categories</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-secondary to-primary mx-auto rounded-full"></div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category, index) => (
            <motion.div 
              key={category.id} 
              variants={itemVariants}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/menu?category=${category.id}`} className="block">
                <Card className="overflow-hidden border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-md">
                  <div className="relative h-40">
                    <Image 
                      src={category.image} 
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                      <h3 className="text-white font-bold text-lg">{category.name}</h3>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Special Offers */}
      <div className="container py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Special Offers</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-accent to-secondary mx-auto rounded-full"></div>
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {offers.map((offer, index) => (
            <motion.div 
              key={offer.id} 
              variants={itemVariants}
              transition={{ delay: index * 0.2 }}
              className="group"
            >
              <Card className="overflow-hidden border-accent/10 hover:border-accent/30 transition-all duration-300 hover:shadow-lg">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-secondary opacity-70"></div>
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative h-48 md:h-auto md:w-1/3">
                      <Image 
                        src={offer.image} 
                        alt={offer.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 md:w-2/3">
                      <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent mb-4">
                        {offer.tag}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                      <p className="text-muted-foreground mb-4">{offer.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-accent">Rp {offer.price.toLocaleString('id-ID')}</span>
                          {offer.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through ml-2">
                              Rp {offer.originalPrice.toLocaleString('id-ID')}
                            </span>
                          )}
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-accent to-secondary hover:opacity-90 text-white rounded-full transition-all duration-300 hover:shadow-md"
                        >
                          Order Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// Mock data for categories
const categories = [
  {
    id: 1,
    name: "Main Dishes",
    image: "/images/main-dishes.jpg"
  },
  {
    id: 2,
    name: "Appetizers",
    image: "/images/appetizers.jpg"
  },
  {
    id: 3,
    name: "Desserts",
    image: "/images/desserts.jpg"
  },
  {
    id: 4,
    name: "Beverages",
    image: "/images/beverages.jpg"
  }
];

// Mock data for special offers
const offers = [
  {
    id: 1,
    title: "Family Feast Bundle",
    description: "Perfect for family gatherings. Includes 4 main dishes, 2 sides, and drinks for 4 people.",
    price: 250000,
    originalPrice: 320000,
    image: "/images/family-bundle.jpg",
    tag: "Limited Time"
  },
  {
    id: 2,
    title: "Lunch Special",
    description: "Get a main dish, side, and drink at a special price. Available weekdays from 11am to 2pm.",
    price: 75000,
    originalPrice: 95000,
    image: "/images/lunch-special.jpg",
    tag: "Best Value"
  }
]
