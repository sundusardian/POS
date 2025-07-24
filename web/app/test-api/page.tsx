"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function ApiTestPage() {
  const [apiUrl, setApiUrl] = useState('http://localhost:3001');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (test: string, success: boolean, data?: any, error?: string) => {
    setTestResults(prev => [...prev, {
      test,
      success,
      data,
      error,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testConnection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/health`);
      if (response.ok) {
        const data = await response.json();
        addResult('Health Check', true, data);
      } else {
        addResult('Health Check', false, null, `HTTP ${response.status}`);
      }
    } catch (error) {
      addResult('Health Check', false, null, error instanceof Error ? error.message : 'Unknown error');
    }
    setIsLoading(false);
  };

  const testAuth = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@restaurant.com',
          password: 'admin123'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        addResult('Login Test', true, data);
      } else {
        const errorData = await response.text();
        addResult('Login Test', false, null, `HTTP ${response.status}: ${errorData}`);
      }
    } catch (error) {
      addResult('Login Test', false, null, error instanceof Error ? error.message : 'Unknown error');
    }
    setIsLoading(false);
  };

  const testBranches = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/branches`);
      if (response.ok) {
        const data = await response.json();
        addResult('Branches API', true, data);
      } else {
        addResult('Branches API', false, null, `HTTP ${response.status}`);
      }
    } catch (error) {
      addResult('Branches API', false, null, error instanceof Error ? error.message : 'Unknown error');
    }
    setIsLoading(false);
  };

  const testOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/orders`);
      if (response.ok) {
        const data = await response.json();
        addResult('Orders API', true, data);
      } else {
        addResult('Orders API', false, null, `HTTP ${response.status}`);
      }
    } catch (error) {
      addResult('Orders API', false, null, error instanceof Error ? error.message : 'Unknown error');
    }
    setIsLoading(false);
  };

  const testTestData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/test/data`);
      if (response.ok) {
        const data = await response.json();
        addResult('Test Data API', true, data);
      } else {
        addResult('Test Data API', false, null, `HTTP ${response.status}`);
      }
    } catch (error) {
      addResult('Test Data API', false, null, error instanceof Error ? error.message : 'Unknown error');
    }
    setIsLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">API Integration Test</h1>
        <p className="text-muted-foreground">Test the connection between frontend and backend</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>Configure the backend API URL</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="api-url">API URL</Label>
            <Input
              id="api-url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://localhost:3001"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Tests</CardTitle>
          <CardDescription>Run tests to verify API connectivity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            <Button onClick={testConnection} disabled={isLoading} variant="outline">
              Health Check
            </Button>
            <Button onClick={testAuth} disabled={isLoading} variant="outline">
              Login Test
            </Button>
            <Button onClick={testBranches} disabled={isLoading} variant="outline">
              Branches
            </Button>
            <Button onClick={testOrders} disabled={isLoading} variant="outline">
              Orders
            </Button>
            <Button onClick={testTestData} disabled={isLoading} variant="outline">
              Test Data
            </Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={clearResults} variant="destructive" size="sm">
              Clear Results
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Results ({testResults.length})</CardTitle>
          <CardDescription>Results from API tests</CardDescription>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No tests run yet</p>
          ) : (
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{result.test}</h4>
                      <Badge variant={result.success ? "default" : "destructive"}>
                        {result.success ? "Success" : "Failed"}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">{result.timestamp}</span>
                  </div>
                  
                  {result.error && (
                    <div className="text-sm text-red-600 mb-2">
                      <strong>Error:</strong> {result.error}
                    </div>
                  )}
                  
                  {result.data && (
                    <details className="text-sm">
                      <summary className="cursor-pointer text-muted-foreground">
                        View Response Data
                      </summary>
                      <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
