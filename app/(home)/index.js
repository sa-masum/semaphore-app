import { Text, View } from 'react-native';
import React from 'react';
import '../../global.css';
import Header from '../components/Header';

export default function Home() {
  return (
    <View className="flex-1">
      <Header />
      <View className="p-7">
        <Text className="text-2xl text-red-500">Home Page...</Text>
      </View>
    </View>
  );
}
