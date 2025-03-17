import { View, Text, TextInput, Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [editForm, setEditForm] = useState({ username: '', email: '' });
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await AsyncStorage.getItem('userToken'); // Changed from 'authToken' to 'userToken'
      if (!token) {
        router.push('/(signin)');
        return;
      }

      try {
        const { data } = await axios.get("http://192.168.0.105:8000/api/v1/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setProfile(data.profile);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err.response?.data || err.message);
        if (err.response?.status === 401) {
          await AsyncStorage.removeItem('userToken');
          router.push('/(signin)');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch profile.');
        }
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken'); // Changed from 'authToken' to 'userToken'
    router.push('/(signin)');
  };

  const handleEditClick = () => {
    setEditForm({
      username: profile.username,
      email: profile.email
    });
    setIsEditing(true);
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    const token = await AsyncStorage.getItem('userToken');  // Changed from 'authToken'
    try {
      const { data } = await axios.put("http://192.168.0.105:8000/api/v1/user/edit-profile", {
        username: editForm.username,
        email: editForm.email
      }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (data.success) {
        setProfile(data.profile);
        setIsEditing(false);
        setError(null);
      }
    } catch (err) {
      console.error('Update error:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const token = await AsyncStorage.getItem('userToken');  // Changed from 'authToken'
    try {
      const { data } = await axios.put("http://192.168.0.105:8000/api/v1/user/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (data.success) {
        setIsChangingPassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setError(null);
        alert(data.message);
      }
    } catch (err) {
      console.error('Password change error:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={{ color: 'red' }}>{error}</Text>;
  }

  if (!profile) {
    return <Text>No profile data found.</Text>;
  }

  return (
    <View className="flex-1 bg-gray-100">
      <Header />
      <View className="flex-1 px-4 py-6">
        <Text className="text-3xl font-bold text-center text-gray-800 mb-8">My Profile</Text>
        
        {isEditing ? (
          <View className="bg-white p-6 rounded-2xl shadow-md">
            <TextInput
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg text-gray-700"
              placeholder="Name"
              value={editForm.username}
              onChangeText={(text) => setEditForm({ ...editForm, username: text })}
            />
            <TextInput
              className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg text-gray-700"
              placeholder="Email"
              value={editForm.email}
              onChangeText={(text) => setEditForm({ ...editForm, email: text })}
            />
            <View className="flex-row space-x-4">
              <TouchableOpacity 
                className="flex-1 bg-blue-500 py-3 rounded-lg"
                onPress={handleEditProfile}>
                <Text className="text-white text-center font-semibold">Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-1 bg-gray-300 py-3 rounded-lg"
                onPress={() => setIsEditing(false)}>
                <Text className="text-gray-700 text-center font-semibold">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : isChangingPassword ? (
          <View className="bg-white p-6 rounded-2xl shadow-md">
            <TextInput
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg text-gray-700"
              placeholder="Current Password"
              secureTextEntry
              value={passwordData.currentPassword}
              onChangeText={(text) => setPasswordData({ ...passwordData, currentPassword: text })}
            />
            <TextInput
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg text-gray-700"
              placeholder="New Password"
              secureTextEntry
              value={passwordData.newPassword}
              onChangeText={(text) => setPasswordData({ ...passwordData, newPassword: text })}
            />
            <TextInput
              className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg text-gray-700"
              placeholder="Confirm New Password"
              secureTextEntry
              value={passwordData.confirmPassword}
              onChangeText={(text) => setPasswordData({ ...passwordData, confirmPassword: text })}
            />
            <View className="flex-row space-x-4">
              <TouchableOpacity 
                className="flex-1 bg-blue-500 py-3 rounded-lg"
                onPress={handleChangePassword}>
                <Text className="text-white text-center font-semibold">Update Password</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-1 bg-gray-300 py-3 rounded-lg"
                onPress={() => setIsChangingPassword(false)}>
                <Text className="text-gray-700 text-center font-semibold">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="bg-white p-6 rounded-2xl shadow-md">
            <View className="items-center mb-6">
              <View className="w-24 h-24 bg-gray-300 rounded-full mb-4 justify-center items-center">
                <Text className="text-3xl text-gray-600">{profile.username.charAt(0).toUpperCase()}</Text>
              </View>
              <Text className="text-xl font-semibold text-gray-800">{profile.username}</Text>
              <Text className="text-gray-500">{profile.email}</Text>
            </View>
            
            <View className="space-y-3">
              <TouchableOpacity 
                className="w-full bg-blue-500 py-3 rounded-lg"
                onPress={handleEditClick}>
                <Text className="text-white text-center font-semibold">Edit Profile</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="w-full bg-gray-200 py-3 rounded-lg"
                onPress={() => setIsChangingPassword(true)}>
                <Text className="text-gray-700 text-center font-semibold">Change Password</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="w-full bg-red-500 py-3 rounded-lg mt-6"
                onPress={handleLogout}>
                <Text className="text-white text-center font-semibold">Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {error && (
          <Text className="mt-4 text-red-500 text-center">{error}</Text>
        )}
      </View>
    </View>
  );
}
