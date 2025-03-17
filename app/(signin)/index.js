import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setIsLoggedIn(!!token);
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      console.log("LoggedIn");
    } else {
      console.log("Not Logged In");
    }
  }, [isLoggedIn]);

  const handleSubmit = async () => {
    try {
      setError('');
      const baseURL = 'http://192.168.0.105:8000';
      const response = await axios.post(
        `${baseURL}/api/v1/user/signin`, 
        formData,
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      
      if (response.data.success) {
        // Store token and user info
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.user));
        console.log('Signin successful:', response.data);
        setIsLoggedIn(true);
        router.replace('/(home)');
      } else {
        setError('Invalid credentials');
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Signin error:', error);
      setError(error.response?.data?.error || 'Failed to sign in');
      setIsLoggedIn(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Header />
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-2xl font-bold mb-8">Sign In</Text>
        {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}
        <TextInput
          className="w-full h-12 px-4 mb-4 border border-gray-300 rounded"
          placeholder="Enter your email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          className="w-full h-12 px-4 mb-6 border border-gray-300 rounded"
          placeholder="Enter password"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry
        />
        <TouchableOpacity 
          className="w-full h-12 bg-indigo-600 rounded flex items-center justify-center"
          onPress={handleSubmit}
        >
          <Text className="text-white font-semibold">Sign In</Text>
        </TouchableOpacity>
        <View className="flex-row mt-4">
          <Text className="text-gray-600">Not registered yet? </Text>
          <TouchableOpacity onPress={() => router.push('/(signup)')}>
            <Text className="text-indigo-600 font-medium">Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
