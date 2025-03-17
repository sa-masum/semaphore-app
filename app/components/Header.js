import { Text, View, TouchableOpacity, Animated } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setIsLoggedIn(!!token);
    };
    checkLoginStatus();
  }, []);

  const toggleMenu = () => {
    const newIsOpen = !isMenuOpen;
    setIsMenuOpen(newIsOpen);
    Animated.spring(animatedValue, {
      toValue: newIsOpen ? 1 : 0,
      useNativeDriver: true,
      bounciness: 4,
      speed: 12
    }).start();
  };

  const handleHomePress = () => {
    router.push('/(home)');
    setIsMenuOpen(false);
  };

  const slideIn = {
    transform: [{
      translateX: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [200, 0]
      })
    }],
    opacity: animatedValue
  };

  return (
    <>
      <View className="flex-row justify-between items-center p-4 bg-white shadow-sm relative z-30">
        <View className="ml-2">
          <Text className="text-3xl font-bold">Semaphore</Text>
        </View>
        
        <TouchableOpacity 
          className="md:hidden" 
          onPress={toggleMenu}
          style={{ zIndex: 60 }}
        >
          <Text style={{ fontSize: 32 }} className="text-gray-700">
            {isMenuOpen ? '×' : '☰'}
          </Text>
        </TouchableOpacity>

        <View className="hidden md:flex flex-row items-center">
          <TouchableOpacity onPress={() => router.push('/(home)')}>
            <Text className="mx-2 text-base">Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(about)')}>
            <Text className="mx-2 text-base">About</Text>
          </TouchableOpacity>
          {isLoggedIn ? (
            <>
              <TouchableOpacity onPress={() => router.push('/(dashboard)')}>
                <Text className="mx-2 text-base">Dashboard</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-blue-600 px-4 py-2 rounded-lg ml-2"
                onPress={() => router.push('/(profile)')}
              >
                <Text className="text-white">Profile</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              className="bg-blue-600 px-4 py-2 rounded-lg ml-2"
              onPress={() => router.push('/(signin)')}
            >
              <Text className="text-white">Sign In</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isMenuOpen && (
        <>
          <View 
            className="md:hidden absolute inset-0 bg-black/50" 
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 40 }}
          >
            <TouchableOpacity 
              style={{ width: '100%', height: '100%' }}
              onPress={toggleMenu}
            />
          </View>
          <Animated.View 
            className="md:hidden bg-white border-l absolute top-16 right-4 w-48 rounded-lg shadow-xl"
            style={[
              slideIn, 
              { 
                maxHeight: 200, 
                zIndex: 50,
                elevation: 5, 
                backgroundColor: '#ffffff' 
              }
            ]}
          >
            <View className="py-2">
              <TouchableOpacity className="px-6 py-3 hover:bg-gray-50" onPress={handleHomePress}>
                <Text className="text-lg font-medium">Home</Text>
              </TouchableOpacity>
              <TouchableOpacity className="px-6 py-3 hover:bg-gray-50" onPress={() => router.push('/(about)')}>
                <Text className="text-lg font-medium">About</Text>
              </TouchableOpacity>
              {isLoggedIn ? (
                <>
                  <TouchableOpacity className="px-6 py-3 hover:bg-gray-50" onPress={() => router.push('/(dashboard)')}>
                    <Text className="text-lg font-medium">Dashboard</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="px-6 py-3 hover:bg-gray-50"
                    onPress={() => router.push('/(profile)')}
                  >
                    <Text className="text-lg font-medium text-blue-600">Profile</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity 
                  className="px-6 py-3 hover:bg-gray-50"
                  onPress={() => router.push('/(signin)')}
                >
                  <Text className="text-lg font-medium text-blue-600">Sign In</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </>
      )}
    </>
  );
}
