import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { apiClient } from '../../lib/api';
import { useAuthStore } from '../../lib/auth/store';

export default function ApiTestScreen() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, token } = useAuthStore();

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnection = async () => {
    setIsLoading(true);
    try {
      const result = await apiClient.testConnection();
      addResult(`✅ Connection test successful: ${result.message}`);
    } catch (error) {
      addResult(`❌ Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setIsLoading(false);
  };

  const testTokenValidation = async () => {
    setIsLoading(true);
    try {
      const user = await apiClient.auth.validateToken();
      addResult(`✅ Token validation successful: ${user.name} (${user.email})`);
    } catch (error) {
      addResult(`❌ Token validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setIsLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>API Integration Test</Text>
        <Text style={styles.subtitle}>Test the connection to the backend API</Text>
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.sectionTitle}>Current User</Text>
        {user ? (
          <View style={styles.userCard}>
            <Text style={styles.userText}>Name: {user.name}</Text>
            <Text style={styles.userText}>Email: {user.email}</Text>
            <Text style={styles.userText}>Role: {user.role}</Text>
            <Text style={styles.userText}>Token: {token ? '✅ Present' : '❌ Missing'}</Text>
          </View>
        ) : (
          <Text style={styles.noUser}>No user logged in</Text>
        )}
      </View>

      <View style={styles.testSection}>
        <Text style={styles.sectionTitle}>API Tests</Text>
        
        <TouchableOpacity
          style={[styles.testButton, isLoading && styles.buttonDisabled]}
          onPress={testConnection}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Test Connection</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.testButton, isLoading && styles.buttonDisabled]}
          onPress={testTokenValidation}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Test Token Validation</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.clearButton]}
          onPress={clearResults}
        >
          <Text style={styles.clearButtonText}>Clear Results</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resultsSection}>
        <Text style={styles.sectionTitle}>Test Results</Text>
        <View style={styles.resultsContainer}>
          {testResults.length === 0 ? (
            <Text style={styles.noResults}>No test results yet</Text>
          ) : (
            testResults.map((result, index) => (
              <Text key={index} style={styles.resultText}>
                {result}
              </Text>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  userInfo: {
    margin: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  userCard: {
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  userText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  noUser: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  testSection: {
    margin: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsSection: {
    margin: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    minHeight: 100,
  },
  noResults: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  resultText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
});
