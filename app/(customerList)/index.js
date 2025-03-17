import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (searchText) {
      const filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.phone1.includes(searchText)
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchText, customers]);

  const fetchCustomers = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('No token found');
        return;
      }

      const baseURL = 'http://192.168.0.105:8000';
      const response = await axios.get(
        `${baseURL}/api/v1/user/customers`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setCustomers(response.data.customers);
        setFilteredCustomers(response.data.customers);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View className="p-4 border-b border-gray-200">
      <Text className="text-lg font-semibold">{item.name}</Text>
      <Text className="text-gray-600">Phone: {item.phone1}</Text>
      <Text className="text-gray-600">Address: {item.billingAddress}</Text>
      <Text className="text-gray-600">Zone: {item.zone}</Text>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Header />
      <View className="px-4 py-2">
        <TextInput
          className="h-12 px-4 border border-gray-300 rounded-lg"
          placeholder="Search by name or phone"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <FlatList
        data={filteredCustomers}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        className="flex-1"
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-gray-500">No customers found</Text>
          </View>
        }
      />
    </View>
  );
}
