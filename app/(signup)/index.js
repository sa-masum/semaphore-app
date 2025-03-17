import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { router } from 'expo-router';

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
        const baseURL = 'http://192.168.0.105:8000';
        console.log(formData);
        const response = await axios.post(`${baseURL}/api/v1/user/signup`, formData);
        console.log('Response:', response.data);
        router.replace('/(signin)');
    } catch (error) {
        setError('Signup failed. Please try again.');
        console.error('Error:', error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Header />
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-2xl font-bold mb-8">Sign Up</Text>
        {error && (
          <Text className="text-red-500 mb-4">{error}</Text>
        )}
        <TextInput
          className="w-full h-12 px-4 mb-4 border border-gray-300 rounded"
          placeholder="Enter your name"
          value={formData.username}
          onChangeText={(text) => setFormData({ ...formData, username: text })}
          autoCapitalize="none"
        />
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
          <Text className="text-white font-semibold">Sign Up</Text>
        </TouchableOpacity>
        <View className="flex-row mt-4">
          <Text className="text-gray-600">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(signin)')}>
            <Text className="text-indigo-600 font-medium">Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
