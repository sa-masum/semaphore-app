import { View, Text } from 'react-native';
import React from 'react';
import Header from '../components/Header';

export default function About() {
  return (
    <View className="flex-1 bg-white">
      <Header />
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-3xl font-bold mb-4">About Us</Text>
        <Text className="text-lg text-center text-gray-600">
          Welcome to Semaphore! We are dedicated to providing innovative solutions
          for seamless communication and collaboration.
        </Text>
      </View>
    </View>
  );
}
