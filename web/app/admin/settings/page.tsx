"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth-context";

export default function SettingsPage() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div className="flex items-center justify-between animate-slideInTop">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent pb-1">
            Settings
          </h1>
          <p className="text-foreground/80 text-lg">
            Manage your restaurant&apos;s settings and <span className="text-primary font-medium">preferences</span>.
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="general" className="w-full animate-fadeIn">
        <TabsList className="border border-primary/20 bg-background/50 p-1">
          <TabsTrigger value="general" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-300 hover:text-primary/80">General</TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-secondary/10 data-[state=active]:text-secondary transition-all duration-300 hover:text-secondary/80">Appearance</TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-accent/10 data-[state=active]:text-accent transition-all duration-300 hover:text-accent/80">Notifications</TabsTrigger>
          <TabsTrigger value="payment" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-300 hover:text-primary/80">Payment</TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-secondary/10 data-[state=active]:text-secondary transition-all duration-300 hover:text-secondary/80">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6 space-y-6 animate-fadeIn">
          <Card className="border-primary/10 hover:border-primary/30 transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-secondary to-accent opacity-70"></div>
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2 text-xl">
                Restaurant Information
              </CardTitle>
              <CardDescription className="text-foreground/70">
                Update your restaurant&apos;s basic information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-2 animate-fadeIn" style={{ animationDelay: '100ms' }}>
                <Label htmlFor="restaurant-name" className="text-primary font-medium">Restaurant Name</Label>
                <Input 
                  id="restaurant-name" 
                  defaultValue="POS Restaurant" 
                  className="border-primary/20 focus:border-primary/50 focus:ring-primary/30 transition-all duration-300 hover:border-primary/30"
                />
              </div>
              <div className="grid gap-2 animate-fadeIn" style={{ animationDelay: '200ms' }}>
                <Label htmlFor="restaurant-description" className="text-primary font-medium">Description</Label>
                <Textarea
                  id="restaurant-description"
                  defaultValue="A modern restaurant with delicious Indonesian cuisine."
                  className="border-primary/20 focus:border-primary/50 focus:ring-primary/30 transition-all duration-300 hover:border-primary/30 min-h-[100px]"
                />
              </div>
              <div className="grid gap-2 animate-fadeIn" style={{ animationDelay: '300ms' }}>
                <Label htmlFor="contact-email" className="text-primary font-medium">Contact Email</Label>
                <Input 
                  id="contact-email" 
                  type="email" 
                  defaultValue="contact@posrestaurant.com" 
                  className="border-primary/20 focus:border-primary/50 focus:ring-primary/30 transition-all duration-300 hover:border-primary/30"
                />
              </div>
              <div className="grid gap-2 animate-fadeIn" style={{ animationDelay: '400ms' }}>
                <Label htmlFor="contact-phone" className="text-primary font-medium">Contact Phone</Label>
                <Input 
                  id="contact-phone" 
                  defaultValue="+62 21 5551234" 
                  className="border-primary/20 focus:border-primary/50 focus:ring-primary/30 transition-all duration-300 hover:border-primary/30"
                />
              </div>
              <div className="grid gap-2 animate-fadeIn" style={{ animationDelay: '500ms' }}>
                <Label htmlFor="website" className="text-primary font-medium">Website</Label>
                <Input 
                  id="website" 
                  type="url" 
                  defaultValue="https://posrestaurant.com" 
                  className="border-primary/20 focus:border-primary/50 focus:ring-primary/30 transition-all duration-300 hover:border-primary/30"
                />
              </div>
              <div className="flex justify-end animate-fadeIn" style={{ animationDelay: '600ms' }}>
                <Button className="bg-primary hover:bg-primary/90 hover-lift transition-all duration-300 shadow-md hover:shadow-lg">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-secondary/10 hover:border-secondary/30 transition-all duration-300 overflow-hidden group animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-secondary to-accent opacity-70"></div>
            <CardHeader>
              <CardTitle className="text-secondary flex items-center gap-2 text-xl">
                Restaurant Logo
              </CardTitle>
              <CardDescription className="text-foreground/70">
                Upload your restaurant&apos;s logo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-6 animate-fadeIn" style={{ animationDelay: '400ms' }}>
                <Avatar className="h-24 w-24 ring-2 ring-secondary/30 hover:ring-secondary/60 transition-all duration-300 shadow-md hover:shadow-lg hover-scale">
                  <AvatarImage src="/logo.png" alt="Restaurant Logo" />
                  <AvatarFallback className="bg-secondary/10 text-secondary font-bold">LOGO</AvatarFallback>
                </Avatar>
                <div className="grid gap-2 flex-1">
                  <Label htmlFor="logo" className="text-secondary font-medium">Select New Logo</Label>
                  <Input 
                    id="logo" 
                    type="file" 
                    className="border-secondary/20 focus:border-secondary/50 focus:ring-secondary/30 transition-all duration-300 hover:border-secondary/30"
                  />
                  <p className="text-xs text-foreground/60 flex items-center gap-1">
                    <span className="text-secondary font-medium">Recommended:</span> 512x512 pixels. Max file size: 2MB.
                  </p>
                </div>
              </div>
              <div className="flex justify-end animate-fadeIn" style={{ animationDelay: '500ms' }}>
                <Button className="bg-secondary hover:bg-secondary/90 hover-lift transition-all duration-300 shadow-md hover:shadow-lg">Upload Logo</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-accent/10 hover:border-accent/30 transition-all duration-300 overflow-hidden group animate-fadeIn" style={{ animationDelay: '600ms' }}>
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent to-primary opacity-70"></div>
            <CardHeader>
              <CardTitle className="text-accent flex items-center gap-2 text-xl">
                Business Hours
              </CardTitle>
              <CardDescription className="text-foreground/70">
                Set your restaurant&apos;s operating hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => (
                <div 
                  key={day} 
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/5 transition-all duration-300 animate-fadeIn" 
                  style={{ animationDelay: `${700 + index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <Switch 
                      id={`${day.toLowerCase()}-open`} 
                      defaultChecked={day !== "Sunday"} 
                      className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground hover:data-[state=checked]:bg-accent/90 transition-colors duration-300"
                    />
                    <Label 
                      htmlFor={`${day.toLowerCase()}-open`} 
                      className={`font-medium ${day !== "Sunday" ? 'text-accent' : 'text-muted-foreground'} transition-colors duration-300`}
                    >
                      {day}
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Select defaultValue="09:00">
                      <SelectTrigger className="w-[100px] border-accent/20 focus:border-accent/50 focus:ring-accent/30 transition-all duration-300 hover:border-accent/30">
                        <SelectValue placeholder="Open" className="text-accent" />
                      </SelectTrigger>
                      <SelectContent className="border-accent/20">
                        {Array.from({ length: 24 }).map((_, i) => (
                          <SelectItem 
                            key={i} 
                            value={`${i.toString().padStart(2, '0')}:00`}
                            className="hover:bg-accent/10 hover:text-accent transition-colors duration-300"
                          >
                            {`${i.toString().padStart(2, '0')}:00`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-accent font-medium">to</span>
                    <Select defaultValue="21:00">
                      <SelectTrigger className="w-[100px] border-accent/20 focus:border-accent/50 focus:ring-accent/30 transition-all duration-300 hover:border-accent/30">
                        <SelectValue placeholder="Close" className="text-accent" />
                      </SelectTrigger>
                      <SelectContent className="border-accent/20">
                        {Array.from({ length: 24 }).map((_, i) => (
                          <SelectItem 
                            key={i} 
                            value={`${i.toString().padStart(2, '0')}:00`}
                            className="hover:bg-accent/10 hover:text-accent transition-colors duration-300"
                          >
                            {`${i.toString().padStart(2, '0')}:00`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
              <div className="flex justify-end animate-fadeIn" style={{ animationDelay: '1200ms' }}>
                <Button className="bg-accent hover:bg-accent/90 hover-lift transition-all duration-300 shadow-md hover:shadow-lg">Save Hours</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="mt-6 space-y-6 animate-fadeIn">
          <Card className="border-secondary/10 hover:border-secondary/30 transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-secondary to-primary opacity-70"></div>
            <CardHeader>
              <CardTitle className="text-secondary flex items-center gap-2 text-xl">
                Theme Settings
              </CardTitle>
              <CardDescription className="text-foreground/70">
                Customize the appearance of your restaurant&apos;s interfaces.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 animate-fadeIn" style={{ animationDelay: '100ms' }}>
                <Label className="text-secondary font-medium">Color Theme</Label>
                <div className="flex flex-wrap gap-3">
                  {["Default", "Dark", "Light", "System"].map((theme, index) => (
                    <Button
                      key={theme}
                      variant={theme === "Default" ? "default" : "outline"}
                      className={`flex-1 hover-lift transition-all duration-300 animate-fadeIn ${theme === "Default" ? 'bg-secondary hover:bg-secondary/90' : 'border-secondary/20 hover:border-secondary/50 hover:text-secondary'}`}
                      style={{ animationDelay: `${200 + index * 100}ms` }}
                    >
                      {theme}
                    </Button>
                  ))}
                </div>
              </div>
              <Separator className="my-2 bg-gradient-to-r from-secondary/20 via-secondary/40 to-secondary/20 h-0.5 rounded-full animate-fadeIn" style={{ animationDelay: '600ms' }} />
              
              <div className="grid gap-3 animate-fadeIn" style={{ animationDelay: '700ms' }}>
                <Label className="text-secondary font-medium">Menu Layout</Label>
                <div className="flex flex-wrap gap-3">
                  {["Grid", "List", "Compact"].map((layout, index) => (
                    <Button
                      key={layout}
                      variant={layout === "Grid" ? "default" : "outline"}
                      className={`flex-1 hover-lift transition-all duration-300 animate-fadeIn ${layout === "Grid" ? 'bg-secondary hover:bg-secondary/90' : 'border-secondary/20 hover:border-secondary/50 hover:text-secondary'}`}
                      style={{ animationDelay: `${800 + index * 100}ms` }}
                    >
                      {layout}
                    </Button>
                  ))}
                </div>
              </div>
              <Separator className="my-2 bg-gradient-to-r from-secondary/20 via-secondary/40 to-secondary/20 h-0.5 rounded-full animate-fadeIn" style={{ animationDelay: '1100ms' }} />
              
              <div className="space-y-4 animate-fadeIn" style={{ animationDelay: '1200ms' }}>
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/5 transition-all duration-300">
                  <Label htmlFor="show-images" className="text-secondary font-medium cursor-pointer">Show Food Images</Label>
                  <Switch 
                    id="show-images" 
                    defaultChecked 
                    className="data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground hover:data-[state=checked]:bg-secondary/90 transition-colors duration-300"
                  />
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/5 transition-all duration-300">
                  <Label htmlFor="show-descriptions" className="text-secondary font-medium cursor-pointer">Show Food Descriptions</Label>
                  <Switch 
                    id="show-descriptions" 
                    defaultChecked 
                    className="data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground hover:data-[state=checked]:bg-secondary/90 transition-colors duration-300"
                  />
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/5 transition-all duration-300">
                  <Label htmlFor="animations" className="text-secondary font-medium cursor-pointer">Enable Animations</Label>
                  <Switch 
                    id="animations" 
                    defaultChecked 
                    className="data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground hover:data-[state=checked]:bg-secondary/90 transition-colors duration-300"
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-6 animate-fadeIn" style={{ animationDelay: '1500ms' }}>
                <Button className="bg-secondary hover:bg-secondary/90 hover-lift transition-all duration-300 shadow-md hover:shadow-lg">Save Appearance</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-primary/10 hover:border-primary/30 transition-all duration-300 overflow-hidden group animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-accent to-secondary opacity-70"></div>
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2 text-xl">
                Customer Interface
              </CardTitle>
              <CardDescription className="text-foreground/70">
                Customize the customer-facing web interface.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-2 animate-fadeIn" style={{ animationDelay: '400ms' }}>
                <Label htmlFor="welcome-message" className="text-primary font-medium">Welcome Message</Label>
                <Textarea
                  id="welcome-message"
                  defaultValue="Welcome to POS Restaurant! Enjoy our delicious Indonesian cuisine and excellent service."
                  className="border-primary/20 focus:border-primary/50 focus:ring-primary/30 transition-all duration-300 hover:border-primary/30 min-h-[100px]"
                />
              </div>
              <div className="grid gap-2 animate-fadeIn" style={{ animationDelay: '500ms' }}>
                <Label className="text-primary font-medium">Hero Image</Label>
                <div className="h-40 rounded-md border-2 border-dashed border-primary/30 bg-primary/5 p-4 transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 group-hover:shadow-md">
                  <div className="flex h-full items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-sm text-foreground/70 text-center">
                        Drag and drop an image here or <span className="text-primary font-medium">click to browse</span>
                      </p>
                      <Input 
                        id="hero-image" 
                        type="file" 
                        className="max-w-[250px] border-primary/20 focus:border-primary/50 focus:ring-primary/30 transition-all duration-300 hover:border-primary/30" 
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end animate-fadeIn" style={{ animationDelay: '600ms' }}>
                <Button className="bg-primary hover:bg-primary/90 hover-lift transition-all duration-300 shadow-md hover:shadow-lg">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6 space-y-6 animate-fadeIn">
          <Card className="border-accent/10 hover:border-accent/30 transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent to-primary opacity-70"></div>
            <CardHeader>
              <CardTitle className="text-accent flex items-center gap-2 text-xl">
                Notification Settings
              </CardTitle>
              <CardDescription className="text-foreground/70">
                Configure how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-4 animate-fadeIn" style={{ animationDelay: '100ms' }}>
                <h3 className="text-lg font-medium text-accent flex items-center gap-2">
                  Email Notifications
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse"></span>
                </h3>
                <div className="space-y-3 pl-1">
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/5 transition-all duration-300">
                    <Label htmlFor="email-orders" className="text-accent/90 font-medium cursor-pointer">New Orders</Label>
                    <Switch 
                      id="email-orders" 
                      defaultChecked 
                      className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground hover:data-[state=checked]:bg-accent/90 transition-colors duration-300"
                    />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/5 transition-all duration-300">
                    <Label htmlFor="email-inventory" className="text-accent/90 font-medium cursor-pointer">Low Inventory Alerts</Label>
                    <Switch 
                      id="email-inventory" 
                      defaultChecked 
                      className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground hover:data-[state=checked]:bg-accent/90 transition-colors duration-300"
                    />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/5 transition-all duration-300">
                    <Label htmlFor="email-reports" className="text-accent/90 font-medium cursor-pointer">Daily Reports</Label>
                    <Switch 
                      id="email-reports" 
                      defaultChecked 
                      className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground hover:data-[state=checked]:bg-accent/90 transition-colors duration-300"
                    />
                  </div>
                </div>
              </div>
              <Separator className="my-2 bg-gradient-to-r from-accent/20 via-accent/40 to-accent/20 h-0.5 rounded-full animate-fadeIn" style={{ animationDelay: '600ms' }} />
              
              <div className="space-y-4 animate-fadeIn" style={{ animationDelay: '700ms' }}>
                <h3 className="text-lg font-medium text-accent flex items-center gap-2">
                  Push Notifications
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse"></span>
                </h3>
                <div className="space-y-3 pl-1">
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/5 transition-all duration-300">
                    <Label htmlFor="push-orders" className="text-accent/90 font-medium cursor-pointer">New Orders</Label>
                    <Switch 
                      id="push-orders" 
                      defaultChecked 
                      className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground hover:data-[state=checked]:bg-accent/90 transition-colors duration-300"
                    />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/5 transition-all duration-300">
                    <Label htmlFor="push-inventory" className="text-accent/90 font-medium cursor-pointer">Low Inventory Alerts</Label>
                    <Switch 
                      id="push-inventory" 
                      defaultChecked 
                      className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground hover:data-[state=checked]:bg-accent/90 transition-colors duration-300"
                    />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/5 transition-all duration-300">
                    <Label htmlFor="push-staff" className="text-accent/90 font-medium cursor-pointer">Staff Check-ins</Label>
                    <Switch 
                      id="push-staff" 
                      className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground hover:data-[state=checked]:bg-accent/90 transition-colors duration-300"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end animate-fadeIn" style={{ animationDelay: '900ms' }}>
                <Button className="bg-accent hover:bg-accent/90 hover-lift transition-all duration-300 shadow-md hover:shadow-lg">Save Notification Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment" className="mt-6 space-y-6 animate-fadeIn">
          <Card className="border-primary/10 hover:border-primary/30 transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-secondary to-accent opacity-70"></div>
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2 text-xl">
                Payment Methods
              </CardTitle>
              <CardDescription className="text-foreground/70">
                Configure payment methods for your restaurant.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-4 animate-fadeIn" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition-all duration-300 border border-transparent hover:border-primary/20">
                  <div>
                    <Label className="text-base text-primary font-medium">Cash</Label>
                    <p className="text-sm text-foreground/70">Accept cash payments in IDR</p>
                  </div>
                  <Switch 
                    id="cash-payment" 
                    defaultChecked 
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground hover:data-[state=checked]:bg-primary/90 transition-colors duration-300"
                  />
                </div>
                <Separator className="bg-gradient-to-r from-transparent via-primary/20 to-transparent h-px" />
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition-all duration-300 border border-transparent hover:border-primary/20 animate-fadeIn" style={{ animationDelay: '200ms' }}>
                  <div>
                    <Label className="text-base text-primary font-medium">Credit Card</Label>
                    <p className="text-sm text-foreground/70">Accept credit card payments in IDR</p>
                  </div>
                  <Switch 
                    id="credit-card-payment" 
                    defaultChecked 
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground hover:data-[state=checked]:bg-primary/90 transition-colors duration-300"
                  />
                </div>
                <Separator className="bg-gradient-to-r from-transparent via-primary/20 to-transparent h-px" />
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition-all duration-300 border border-transparent hover:border-primary/20 animate-fadeIn" style={{ animationDelay: '300ms' }}>
                  <div>
                    <Label className="text-base text-primary font-medium">Bank Transfer</Label>
                    <p className="text-sm text-foreground/70">Accept bank transfer payments in IDR</p>
                  </div>
                  <Switch 
                    id="bank-transfer-payment" 
                    defaultChecked 
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground hover:data-[state=checked]:bg-primary/90 transition-colors duration-300"
                  />
                </div>
                <Separator className="bg-gradient-to-r from-transparent via-primary/20 to-transparent h-px" />
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition-all duration-300 border border-transparent hover:border-primary/20 animate-fadeIn" style={{ animationDelay: '400ms' }}>
                  <div>
                    <Label className="text-base text-primary font-medium">E-Wallet</Label>
                    <p className="text-sm text-foreground/70">Accept e-wallet payments in IDR</p>
                  </div>
                  <Switch 
                    id="e-wallet-payment" 
                    defaultChecked 
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground hover:data-[state=checked]:bg-primary/90 transition-colors duration-300"
                  />
                </div>
              </div>
              <div className="flex justify-end animate-fadeIn" style={{ animationDelay: '500ms' }}>
                <Button className="bg-primary hover:bg-primary/90 hover-lift transition-all duration-300 shadow-md hover:shadow-lg">Save Payment Settings</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-secondary/10 hover:border-secondary/30 transition-all duration-300 overflow-hidden group animate-fadeIn" style={{ animationDelay: '200ms' }}>
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-secondary to-primary opacity-70"></div>
            <CardHeader>
              <CardTitle className="text-secondary flex items-center gap-2 text-xl">
                Tax Settings
              </CardTitle>
              <CardDescription className="text-foreground/70">
                Configure tax rates for your restaurant.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 animate-fadeIn" style={{ animationDelay: '300ms' }}>
                <Label htmlFor="tax-rate" className="text-secondary font-medium">Tax Rate (%)</Label>
                <Input 
                  id="tax-rate" 
                  type="number" 
                  defaultValue="10" 
                  min="0" 
                  max="100" 
                  className="border-secondary/20 focus:border-secondary/50 focus:ring-secondary/30 transition-all duration-300 hover:border-secondary/30"
                />
                <p className="text-xs text-foreground/70 italic">
                  This tax rate will be applied to all orders in IDR currency.
                </p>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/5 transition-all duration-300 animate-fadeIn" style={{ animationDelay: '400ms' }}>
                <Switch 
                  id="include-tax" 
                  defaultChecked 
                  className="data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground hover:data-[state=checked]:bg-secondary/90 transition-colors duration-300"
                />
                <Label htmlFor="include-tax" className="text-secondary/90 font-medium cursor-pointer">Include tax in displayed prices</Label>
              </div>
              <div className="flex justify-end animate-fadeIn" style={{ animationDelay: '500ms' }}>
                <Button className="bg-secondary hover:bg-secondary/90 hover-lift transition-all duration-300 shadow-md hover:shadow-lg">Save Tax Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-6 space-y-6 animate-fadeIn">
          <Card className="border-accent/10 hover:border-accent/30 transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent via-secondary to-primary opacity-70"></div>
            <CardHeader>
              <CardTitle className="text-accent flex items-center gap-2 text-xl">
                Account Security
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse"></span>
              </CardTitle>
              <CardDescription className="text-foreground/70">
                Manage your account security settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-2 animate-fadeIn" style={{ animationDelay: '100ms' }}>
                <Label htmlFor="current-password" className="text-accent font-medium">Current Password</Label>
                <Input 
                  id="current-password" 
                  type="password" 
                  className="border-accent/20 focus:border-accent/50 focus:ring-accent/30 transition-all duration-300 hover:border-accent/30"
                />
              </div>
              <div className="grid gap-2 animate-fadeIn" style={{ animationDelay: '200ms' }}>
                <Label htmlFor="new-password" className="text-accent font-medium">New Password</Label>
                <Input 
                  id="new-password" 
                  type="password" 
                  className="border-accent/20 focus:border-accent/50 focus:ring-accent/30 transition-all duration-300 hover:border-accent/30"
                />
                <p className="text-xs text-foreground/70 italic">Password must be at least 8 characters long</p>
              </div>
              <div className="grid gap-2 animate-fadeIn" style={{ animationDelay: '300ms' }}>
                <Label htmlFor="confirm-password" className="text-accent font-medium">Confirm New Password</Label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  className="border-accent/20 focus:border-accent/50 focus:ring-accent/30 transition-all duration-300 hover:border-accent/30"
                />
              </div>
              <div className="flex justify-end animate-fadeIn" style={{ animationDelay: '400ms' }}>
                <Button className="bg-accent hover:bg-accent/90 hover-lift transition-all duration-300 shadow-md hover:shadow-lg">Change Password</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-secondary/10 hover:border-secondary/30 transition-all duration-300 overflow-hidden group animate-fadeIn" style={{ animationDelay: '200ms' }}>
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-secondary via-accent to-primary opacity-70"></div>
            <CardHeader>
              <CardTitle className="text-secondary flex items-center gap-2 text-xl">
                Current User Information
              </CardTitle>
              <CardDescription className="text-foreground/70">
                Details about the currently authenticated admin user.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center space-x-4 animate-fadeIn" style={{ animationDelay: '300ms' }}>
                <Avatar className="h-14 w-14 ring-2 ring-secondary/50 ring-offset-2 ring-offset-background transition-all duration-300 hover:scale-105 hover:ring-secondary">
                  <AvatarImage src={user?.avatar || "/avatars/admin.png"} alt={user?.name || "Admin"} />
                  <AvatarFallback className="bg-gradient-to-br from-secondary to-accent text-white">
                    {user?.name?.substring(0, 2) || "AD"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-lg text-secondary">{user?.name || "Admin User"}</p>
                  <p className="text-sm text-foreground/70">{user?.email || "admin@example.com"}</p>
                  <p className="text-xs text-foreground/60 mt-1 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Last login: {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
              <Separator className="bg-gradient-to-r from-transparent via-secondary/20 to-transparent h-px animate-fadeIn" style={{ animationDelay: '400ms' }} />
              <div className="space-y-2 animate-fadeIn" style={{ animationDelay: '500ms' }}>
                <Label className="text-secondary font-medium">Account Type</Label>
                <div className="flex items-center space-x-2">
                  <div className="rounded-full bg-gradient-to-r from-secondary to-accent px-3 py-1 text-xs font-medium text-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                    Administrator
                  </div>
                </div>
              </div>
              <div className="flex justify-end animate-fadeIn" style={{ animationDelay: '600ms' }}>
                <Button variant="outline" className="border-secondary/30 text-secondary hover:bg-secondary/10 hover:text-secondary hover:border-secondary hover-lift transition-all duration-300">Update Profile</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-primary/10 hover:border-primary/30 transition-all duration-300 overflow-hidden group animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent opacity-70"></div>
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2 text-xl">
                Two-Factor Authentication
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              </CardTitle>
              <CardDescription className="text-foreground/70">
                Add an extra layer of security to your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition-all duration-300 border border-transparent hover:border-primary/20 animate-fadeIn" style={{ animationDelay: '400ms' }}>
                <div>
                  <p className="font-medium text-primary">Two-Factor Authentication</p>
                  <p className="text-sm text-foreground/70">
                    Protect your account with two-factor authentication.
                  </p>
                </div>
                <Switch 
                  id="enable-2fa" 
                  className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground hover:data-[state=checked]:bg-primary/90 transition-colors duration-300"
                />
              </div>
              <div className="flex justify-end animate-fadeIn" style={{ animationDelay: '500ms' }}>
                <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary hover:border-primary hover-lift transition-all duration-300">Set Up 2FA</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-accent/10 hover:border-accent/30 transition-all duration-300 overflow-hidden group animate-fadeIn" style={{ animationDelay: '400ms' }}>
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent via-primary to-secondary opacity-70"></div>
            <CardHeader>
              <CardTitle className="text-accent flex items-center gap-2 text-xl">
                Staff Access Control
              </CardTitle>
              <CardDescription className="text-foreground/70">
                Manage access permissions for staff members.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3 animate-fadeIn" style={{ animationDelay: '500ms' }}>
                <Label className="text-accent font-medium text-lg">Default Role Permissions</Label>
                <div className="space-y-2">
                  <div className="grid grid-cols-5 gap-4 rounded-lg border border-accent/20 p-5 bg-accent/5 shadow-sm hover:shadow-md transition-all duration-300 hover:border-accent/30">
                    <div className="font-medium text-accent">Role</div>
                    <div className="font-medium text-accent">Menu</div>
                    <div className="font-medium text-accent">Orders</div>
                    <div className="font-medium text-accent">Inventory</div>
                    <div className="font-medium text-accent">Reports</div>
                    
                    <div className="font-medium text-foreground/80 animate-fadeIn" style={{ animationDelay: '600ms' }}>Manager</div>
                    <div className="animate-fadeIn" style={{ animationDelay: '650ms' }}>
                      <Switch defaultChecked className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground hover:data-[state=checked]:bg-accent/90 transition-colors duration-300" />
                    </div>
                    <div className="animate-fadeIn" style={{ animationDelay: '700ms' }}>
                      <Switch defaultChecked className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground hover:data-[state=checked]:bg-accent/90 transition-colors duration-300" />
                    </div>
                    <div className="animate-fadeIn" style={{ animationDelay: '750ms' }}>
                      <Switch defaultChecked className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground hover:data-[state=checked]:bg-accent/90 transition-colors duration-300" />
                    </div>
                    <div className="animate-fadeIn" style={{ animationDelay: '800ms' }}>
                      <Switch defaultChecked className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground hover:data-[state=checked]:bg-accent/90 transition-colors duration-300" />
                    </div>
                    
                    <div className="font-medium text-foreground/80 animate-fadeIn" style={{ animationDelay: '850ms' }}>Cashier</div>
                    <div className="animate-fadeIn" style={{ animationDelay: '900ms' }}>
                      <Switch defaultChecked className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground hover:data-[state=checked]:bg-accent/90 transition-colors duration-300" />
                    </div>
                    <div className="animate-fadeIn" style={{ animationDelay: '950ms' }}>
                      <Switch defaultChecked className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground hover:data-[state=checked]:bg-accent/90 transition-colors duration-300" />
                    </div>
                    <div className="animate-fadeIn" style={{ animationDelay: '1000ms' }}>
                      <Switch className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground hover:data-[state=checked]:bg-accent/90 transition-colors duration-300" />
                    </div>
                    <div className="animate-fadeIn" style={{ animationDelay: '1050ms' }}>
                      <Switch className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground hover:data-[state=checked]:bg-accent/90 transition-colors duration-300" />
                    </div>
                    
                    <div className="font-medium text-foreground/80 animate-fadeIn" style={{ animationDelay: '1100ms' }}>Waiter</div>
                    <div className="animate-fadeIn" style={{ animationDelay: '1150ms' }}>
                      <Switch defaultChecked className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground hover:data-[state=checked]:bg-accent/90 transition-colors duration-300" />
                    </div>
                    <div className="animate-fadeIn" style={{ animationDelay: '1200ms' }}>
                      <Switch defaultChecked className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground hover:data-[state=checked]:bg-accent/90 transition-colors duration-300" />
                    </div>
                    <div className="animate-fadeIn" style={{ animationDelay: '1250ms' }}>
                      <Switch className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground hover:data-[state=checked]:bg-accent/90 transition-colors duration-300" />
                    </div>
                    <div className="animate-fadeIn" style={{ animationDelay: '1300ms' }}>
                      <Switch className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground hover:data-[state=checked]:bg-accent/90 transition-colors duration-300" />
                    </div>
                    
                    <div className="font-medium text-foreground/80 animate-fadeIn" style={{ animationDelay: '1350ms' }}>Chef</div>
                    <div className="animate-fadeIn" style={{ animationDelay: '1400ms' }}>
                      <Switch defaultChecked className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground hover:data-[state=checked]:bg-accent/90 transition-colors duration-300" />
                    </div>
                    <div className="animate-fadeIn" style={{ animationDelay: '1450ms' }}>
                      <Switch defaultChecked className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground hover:data-[state=checked]:bg-accent/90 transition-colors duration-300" />
                    </div>
                    <div className="animate-fadeIn" style={{ animationDelay: '1500ms' }}>
                      <Switch defaultChecked className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground hover:data-[state=checked]:bg-accent/90 transition-colors duration-300" />
                    </div>
                    <div className="animate-fadeIn" style={{ animationDelay: '1550ms' }}>
                      <Switch className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground hover:data-[state=checked]:bg-accent/90 transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end animate-fadeIn" style={{ animationDelay: '1600ms' }}>
                <Button className="bg-accent hover:bg-accent/90 hover-lift transition-all duration-300 shadow-md hover:shadow-lg">Save Permissions</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
