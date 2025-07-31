import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../lib/auth/store';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            // Router will automatically redirect to login due to auth protection
          },
        },
      ]
    );
  };

  const navigateToProfile = () => {
    router.push('/(app)/profile');
  };

  const navigateToSettings = () => {
    router.push('/(app)/settings');
  };

  const navigateToApiTest = () => {
    router.push('./api-test');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>
            Hello, {user?.name || 'User'}!
          </Text>
          <Text style={styles.emailText}>{user?.email}</Text>
        </View>

        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Account Information</Text>
              <Ionicons name="person-circle" size={24} color="#007AFF" />
            </View>
            <Text style={styles.cardText}>
              Manage your profile, update personal details, and change your password.
            </Text>
            <TouchableOpacity 
              style={styles.cardButton}
              onPress={navigateToProfile}
            >
              <Text style={styles.cardButtonText}>View Profile</Text>
              <Ionicons name="chevron-forward" size={16} color="#007AFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>App Settings</Text>
              <Ionicons name="settings" size={24} color="#007AFF" />
            </View>
            <Text style={styles.cardText}>
              Configure app preferences, notifications, and privacy settings.
            </Text>
            <TouchableOpacity 
              style={styles.cardButton}
              onPress={navigateToSettings}
            >
              <Text style={styles.cardButtonText}>Open Settings</Text>
              <Ionicons name="chevron-forward" size={16} color="#007AFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>API Integration</Text>
              <Ionicons name="cloud" size={24} color="#007AFF" />
            </View>
            <Text style={styles.cardText}>
              Test the connection to the backend API and validate authentication.
            </Text>
            <TouchableOpacity 
              style={styles.cardButton}
              onPress={navigateToApiTest}
            >
              <Text style={styles.cardButtonText}>Test API</Text>
              <Ionicons name="chevron-forward" size={16} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    padding: 20,
  },
  welcomeContainer: {
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  emailText: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  cardsContainer: {
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  cardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cardButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});
