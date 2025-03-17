import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Header from '../components/Header';
import { Ionicons } from '@expo/vector-icons';

export default function Dashboard() {
  const baseURL = 'http://192.168.0.105:8000';
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          router.replace('/(signin)');
          return;
        }

        const response = await axios.get(`${baseURL}/api/v1/user/customer-count`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setIsAuthenticated(true);
        setCustomerCount(response.data.count);
      } catch (err) {
        console.error('Error fetching customer count:', err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('userInfo');
          setIsAuthenticated(false);
          router.replace('/(signin)');
        }
      }
    };

    fetchData();

    // Setup axios interceptor for token expiration
    const interceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('userInfo');
          router.replace('/(signin)');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const handleAddCustomer = () => {
    router.push('/(addCustomer)');
  };

  const handleCustomerList = () => {
    router.push('/(customerList)');
  };

  if (!isAuthenticated) return null;

  return (
    <View className="flex-1 bg-gray-50">
      <Header />
      <View className="p-4">
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <Text className="text-2xl font-bold text-gray-900 mb-4">Dashboard</Text>
          <View className="flex-col space-y-2">
            <TouchableOpacity 
              onPress={handleAddCustomer}
              className="flex-row items-center justify-center px-4 py-3 bg-blue-600 rounded-md w-full"
            >
              <Ionicons name="add" size={24} color="white" />
              <Text className="text-white ml-2 text-lg font-medium">Add Customer</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleCustomerList}
              className="flex-row items-center justify-center px-4 py-3 bg-white border border-gray-300 rounded-md w-full"
            >
              <Ionicons name="list" size={24} color="gray" />
              <Text className="text-gray-700 ml-2 text-lg font-medium">Customer List</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-white rounded-lg p-4 shadow-sm">
          <View className="bg-blue-500 rounded-lg p-6">
            <Text className="text-xl font-semibold text-white mb-3 text-center">Total Customers</Text>
            <Text className="text-4xl font-bold text-white text-center">{customerCount}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
