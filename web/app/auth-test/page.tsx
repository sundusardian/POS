"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";

export default function AuthTestPage() {
  const { user, isLoading, error, login, logout, isAuthenticated, token } = useAuth();
  const [email, setEmail] = useState('admin@restaurant.com');
  const [password, setPassword] = useState('admin123');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Authentication Test</h1>
        <p className="text-muted-foreground">Test authentication and refresh handling</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
            <CardDescription>Current authentication state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Label>Status:</Label>
              <Badge variant={isAuthenticated ? "default" : "secondary"}>
                {isAuthenticated ? "Authenticated" : "Not Authenticated"}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Label>Loading:</Label>
              <Badge variant={isLoading ? "destructive" : "outline"}>
                {isLoading ? "Loading..." : "Ready"}
              </Badge>
            </div>

            {error && (
              <div className="text-sm text-red-600">
                <strong>Error:</strong> {error}
              </div>
            )}

            {user && (
              <div className="space-y-2">
                <div><strong>User ID:</strong> {user.id}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Name:</strong> {user.name}</div>
                <div><strong>Role:</strong> {user.role}</div>
                {user.primaryBranchId && (
                  <div><strong>Primary Branch:</strong> {user.primaryBranchId}</div>
                )}
                {user.branches && user.branches.length > 0 && (
                  <div><strong>Branches:</strong> {user.branches.join(', ')}</div>
                )}
              </div>
            )}

            {token && (
              <details className="text-sm">
                <summary className="cursor-pointer text-muted-foreground">
                  View Token
                </summary>
                <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto break-all">
                  {token}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Authentication Actions</CardTitle>
            <CardDescription>Login, logout, and test refresh</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isAuthenticated ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={isSubmitting || isLoading} className="w-full">
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <Button onClick={handleLogout} variant="destructive" className="w-full">
                  Logout
                </Button>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline" 
                  className="w-full"
                >
                  Test Refresh (Reload Page)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
          <CardDescription>How to test authentication persistence</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Login with the provided credentials (admin@restaurant.com / admin123)</li>
            <li>Once logged in, click "Test Refresh" to reload the page</li>
            <li>The authentication should persist after refresh</li>
            <li>Try opening a new tab and navigating to /admin/dashboard</li>
            <li>You should remain logged in without needing to login again</li>
            <li>Test logout and verify the token is cleared</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
