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

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your restaurant&apos;s settings and preferences.
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Information</CardTitle>
              <CardDescription>
                Update your restaurant&apos;s basic information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="restaurant-name">Restaurant Name</Label>
                <Input id="restaurant-name" defaultValue="POS Restaurant" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="restaurant-description">Description</Label>
                <Textarea
                  id="restaurant-description"
                  defaultValue="A modern restaurant with delicious Indonesian cuisine."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input id="contact-email" type="email" defaultValue="contact@posrestaurant.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact-phone">Contact Phone</Label>
                <Input id="contact-phone" defaultValue="+62 21 5551234" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" type="url" defaultValue="https://posrestaurant.com" />
              </div>
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Logo</CardTitle>
              <CardDescription>
                Upload your restaurant&apos;s logo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/logo.png" alt="Restaurant Logo" />
                  <AvatarFallback>LOGO</AvatarFallback>
                </Avatar>
                <div className="grid gap-2">
                  <Input id="logo" type="file" />
                  <p className="text-xs text-muted-foreground">
                    Recommended size: 512x512 pixels. Max file size: 2MB.
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Upload Logo</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>
                Set your restaurant&apos;s operating hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <div key={day} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch id={`${day.toLowerCase()}-open`} defaultChecked={day !== "Sunday"} />
                    <Label htmlFor={`${day.toLowerCase()}-open`}>{day}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="09:00">
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Open" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }).map((_, i) => (
                          <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                            {`${i.toString().padStart(2, '0')}:00`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span>to</span>
                    <Select defaultValue="21:00">
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Close" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }).map((_, i) => (
                          <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                            {`${i.toString().padStart(2, '0')}:00`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <Button>Save Hours</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>
                Customize the appearance of your restaurant&apos;s interfaces.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Color Theme</Label>
                <div className="flex flex-wrap gap-2">
                  {["Default", "Dark", "Light", "System"].map((theme) => (
                    <Button
                      key={theme}
                      variant={theme === "Default" ? "default" : "outline"}
                      className="flex-1"
                    >
                      {theme}
                    </Button>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="grid gap-2">
                <Label>Menu Layout</Label>
                <div className="flex flex-wrap gap-2">
                  {["Grid", "List", "Compact"].map((layout) => (
                    <Button
                      key={layout}
                      variant={layout === "Grid" ? "default" : "outline"}
                      className="flex-1"
                    >
                      {layout}
                    </Button>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-images">Show Food Images</Label>
                  <Switch id="show-images" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-descriptions">Show Food Descriptions</Label>
                  <Switch id="show-descriptions" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="animations">Enable Animations</Label>
                  <Switch id="animations" defaultChecked />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save Appearance</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Customer Interface</CardTitle>
              <CardDescription>
                Customize the customer-facing web interface.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="welcome-message">Welcome Message</Label>
                <Textarea
                  id="welcome-message"
                  defaultValue="Welcome to POS Restaurant! Enjoy our delicious food and excellent service."
                />
              </div>
              <div className="grid gap-2">
                <Label>Hero Image</Label>
                <div className="h-40 rounded-md border border-dashed bg-muted/50 p-4">
                  <div className="flex h-full items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        Drag and drop an image here or click to browse
                      </p>
                      <Input id="hero-image" type="file" className="max-w-[250px]" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-orders">New Orders</Label>
                    <Switch id="email-orders" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-inventory">Low Inventory Alerts</Label>
                    <Switch id="email-inventory" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-reports">Daily Reports</Label>
                    <Switch id="email-reports" defaultChecked />
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Push Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-orders">New Orders</Label>
                    <Switch id="push-orders" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-inventory">Low Inventory Alerts</Label>
                    <Switch id="push-inventory" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-staff">Staff Check-ins</Label>
                    <Switch id="push-staff" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save Notification Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Configure payment methods for your restaurant.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Cash</Label>
                    <p className="text-sm text-muted-foreground">Accept cash payments</p>
                  </div>
                  <Switch id="cash-payment" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Credit Card</Label>
                    <p className="text-sm text-muted-foreground">Accept credit card payments</p>
                  </div>
                  <Switch id="credit-card-payment" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Bank Transfer</Label>
                    <p className="text-sm text-muted-foreground">Accept bank transfer payments</p>
                  </div>
                  <Switch id="bank-transfer-payment" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">E-Wallet</Label>
                    <p className="text-sm text-muted-foreground">Accept e-wallet payments</p>
                  </div>
                  <Switch id="e-wallet-payment" defaultChecked />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save Payment Settings</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tax Settings</CardTitle>
              <CardDescription>
                Configure tax rates for your restaurant.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                <Input id="tax-rate" type="number" defaultValue="10" min="0" max="100" />
                <p className="text-xs text-muted-foreground">
                  This tax rate will be applied to all orders.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="include-tax" defaultChecked />
                <Label htmlFor="include-tax">Include tax in displayed prices</Label>
              </div>
              <div className="flex justify-end">
                <Button>Save Tax Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Manage your account security settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <div className="flex justify-end">
                <Button>Change Password</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    Protect your account with two-factor authentication.
                  </p>
                </div>
                <Switch id="enable-2fa" />
              </div>
              <div className="flex justify-end">
                <Button variant="outline">Set Up 2FA</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Staff Access Control</CardTitle>
              <CardDescription>
                Manage access permissions for staff members.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default Role Permissions</Label>
                <div className="space-y-2">
                  <div className="grid grid-cols-5 gap-4 rounded-md border p-4">
                    <div className="font-medium">Role</div>
                    <div className="font-medium">Menu</div>
                    <div className="font-medium">Orders</div>
                    <div className="font-medium">Inventory</div>
                    <div className="font-medium">Reports</div>
                    
                    <div>Manager</div>
                    <div><Switch defaultChecked /></div>
                    <div><Switch defaultChecked /></div>
                    <div><Switch defaultChecked /></div>
                    <div><Switch defaultChecked /></div>
                    
                    <div>Cashier</div>
                    <div><Switch defaultChecked /></div>
                    <div><Switch defaultChecked /></div>
                    <div><Switch /></div>
                    <div><Switch /></div>
                    
                    <div>Waiter</div>
                    <div><Switch defaultChecked /></div>
                    <div><Switch defaultChecked /></div>
                    <div><Switch /></div>
                    <div><Switch /></div>
                    
                    <div>Chef</div>
                    <div><Switch defaultChecked /></div>
                    <div><Switch defaultChecked /></div>
                    <div><Switch defaultChecked /></div>
                    <div><Switch /></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save Permissions</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
