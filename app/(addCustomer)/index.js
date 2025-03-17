import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Platform } from 'react-native';
import React, { useState } from 'react';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const AddCustomer = () => {
  const branches = ['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Sylhet'];
  const zones = ['Zone 1', 'Zone 2', 'Zone 3'];
  const areas = ['Area 1', 'Area 2', 'Area 3'];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);
  const [customerData, setCustomerData] = useState({
    createDate: new Date().toISOString().split('T')[0],
    branch: '',
    area: '',
    zone: '',
    name: '',
    customerCode: '',
    phone1: '',
    phone2: '',
    email: '',
    birthDate: '',
    website: '',
    billingAddress: '',
    deliveryAddress: '',
    city: '',
    zipCode: '',
    country: '',
    salesPerson: '',
    customerType: 'Wholesale',
    contactname: '',
    contactphone: '',
    contactmobile: '',
    contactemail: '',
    creditLimit: '0',
    parentAccHead: '',
    remarks: '',
  });
  const router = useRouter();

  const handleDateChange = (selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setCustomerData({
        ...customerData,
        createDate: selectedDate.toISOString().split('T')[0]
      });
    }
  };

  const handleBirthDateChange = (selectedDate) => {
    setShowBirthDatePicker(false);
    if (selectedDate) {
      setCustomerData({
        ...customerData,
        birthDate: selectedDate.toISOString().split('T')[0]
      });
    }
  };

  const handleAddCustomer = async () => {
    if (!customerData.name.trim() || !customerData.phone1.trim()) {
      setError('Name and primary phone are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        router.push('/(signin)');
        return;
      }

      const { data } = await axios.post(
        "http://192.168.0.105:8000/api/v1/customers/add",
        customerData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (data.success) {
        router.push('/(home)');
      }
    } catch (err) {
      console.error('Error adding customer:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to add customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <Header />
      <ScrollView className="flex-1 px-3 py-4">
        <Text className="text-2xl font-bold text-center text-gray-800 mb-4">Add New Customer</Text>
        {error && (
          <Text className="mb-3 text-red-500 text-center text-sm">{error}</Text>
        )}

        <View className="space-y-4">
          {/* Basic Information */}
          <Text className="text-sm font-semibold text-gray-600 mb-1 mt-2">Basic Information</Text>
          
          <TouchableOpacity 
            onPress={() => setShowDatePicker(true)}
            className="w-full h-11 px-3 border border-gray-300 rounded-lg bg-white justify-center"
          >
            <Text>{customerData.createDate || 'Select Create Date'}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={showDatePicker}
            mode="date"
            onConfirm={handleDateChange}
            onCancel={() => setShowDatePicker(false)}
          />

          <View className="w-full h-11 px-3 border border-gray-300 rounded-lg bg-white justify-center">
            <Picker
              selectedValue={customerData.branch}
              onValueChange={(value) => setCustomerData({...customerData, branch: value})}
              style={{ height: 44 }}
            >
              <Picker.Item label="Select Branch" value="" />
              {branches.map((branch) => (
                <Picker.Item key={branch} label={branch} value={branch} />
              ))}
            </Picker>
          </View>

          <View className="w-full h-11 px-3 border border-gray-300 rounded-lg bg-white justify-center">
            <Picker
              selectedValue={customerData.zone}
              onValueChange={(value) => setCustomerData({...customerData, zone: value})}
              style={{ height: 44 }}
            >
              <Picker.Item label="Select Zone" value="" />
              {zones.map((zone) => (
                <Picker.Item key={zone} label={zone} value={zone} />
              ))}
            </Picker>
          </View>

          <View className="w-full h-11 px-3 border border-gray-300 rounded-lg bg-white justify-center">
            <Picker
              selectedValue={customerData.area}
              onValueChange={(value) => setCustomerData({...customerData, area: value})}
              style={{ height: 44 }}
            >
              <Picker.Item label="Select Area" value="" />
              {areas.map((area) => (
                <Picker.Item key={area} label={area} value={area} />
              ))}
            </Picker>
          </View>

          <TextInput
            className="w-full h-11 px-3 border border-gray-300 rounded-lg bg-white text-base"
            placeholder="Customer Name*"
            value={customerData.name}
            onChangeText={(text) => setCustomerData({...customerData, name: text})}
          />

          <TextInput
            className="w-full h-11 px-3 border border-gray-300 rounded-lg bg-white text-base"
            placeholder="Customer Code"
            value={customerData.customerCode}
            onChangeText={(text) => setCustomerData({...customerData, customerCode: text})}
          />

          {/* Contact Information */}
          <Text className="text-sm font-semibold text-gray-600 mb-1 mt-4">Contact Information</Text>
          <TextInput
            className="w-full h-11 px-3 border border-gray-300 rounded-lg bg-white text-base"
            placeholder="Primary Phone*"
            value={customerData.phone1}
            onChangeText={(text) => setCustomerData({...customerData, phone1: text})}
            keyboardType="phone-pad"
          />

          <TextInput
            className="w-full h-11 px-3 border border-gray-300 rounded-lg bg-white text-base"
            placeholder="Secondary Phone"
            value={customerData.phone2}
            onChangeText={(text) => setCustomerData({...customerData, phone2: text})}
            keyboardType="phone-pad"
          />

          <TextInput
            className="w-full h-11 px-3 border border-gray-300 rounded-lg bg-white text-base"
            placeholder="Email"
            value={customerData.email}
            onChangeText={(text) => setCustomerData({...customerData, email: text})}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity 
            onPress={() => setShowBirthDatePicker(true)}
            className="w-full h-11 px-3 border border-gray-300 rounded-lg bg-white justify-center"
          >
            <Text>{customerData.birthDate || 'Select Birth Date'}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={showBirthDatePicker}
            mode="date"
            onConfirm={handleBirthDateChange}
            onCancel={() => setShowBirthDatePicker(false)}
          />

          <TextInput
            className="w-full h-11 px-3 border border-gray-300 rounded-lg bg-white text-base"
            placeholder="Website"
            value={customerData.website}
            onChangeText={(text) => setCustomerData({...customerData, website: text})}
          />

          {/* Address Information */}
          <Text className="text-sm font-semibold text-gray-600 mb-1 mt-4">Address Details</Text>
          <TextInput
            className="w-full h-11 px-3 border border-gray-300 rounded-lg bg-white text-base"
            placeholder="Billing Address"
            value={customerData.billingAddress}
            onChangeText={(text) => setCustomerData({...customerData, billingAddress: text})}
          />

          <TextInput
            className="w-full h-11 px-3 border border-gray-300 rounded-lg bg-white text-base"
            placeholder="Delivery Address"
            value={customerData.deliveryAddress}
            onChangeText={(text) => setCustomerData({...customerData, deliveryAddress: text})}
          />

          <TextInput
            className="w-full h-11 px-3 border border-gray-300 rounded-lg bg-white text-base"
            placeholder="City"
            value={customerData.city}
            onChangeText={(text) => setCustomerData({...customerData, city: text})}
          />

          <TextInput
            className="w-full h-11 px-3 border border-gray-300 rounded-lg bg-white text-base"
            placeholder="Zip Code"
            value={customerData.zipCode}
            onChangeText={(text) => setCustomerData({...customerData, zipCode: text})}
          />

          <TextInput
            className="w-full h-11 px-3 border border-gray-300 rounded-lg bg-white text-base"
            placeholder="Country"
            value={customerData.country}
            onChangeText={(text) => setCustomerData({...customerData, country: text})}
          />

          {/* Contact Person */}
          <Text className="text-sm font-semibold text-gray-600 mb-1 mt-4">Contact Person</Text>
          <TextInput
            className="w-full h-11 px-3 border border-gray-300 rounded-lg bg-white text-base"
            placeholder="Contact Name"
            value={customerData.contactname}
            onChangeText={(text) => setCustomerData({...customerData, contactname: text})}
          />

          <TextInput
            className="w-full h-11 px-3 border border-gray-300 rounded-lg bg-white text-base"
            placeholder="Contact Phone"
            value={customerData.contactphone}
            onChangeText={(text) => setCustomerData({...customerData, contactphone: text})}
          />

          <TextInput
            className="w-full h-11 px-3 border border-gray-300 rounded-lg bg-white text-base"
            placeholder="Contact Mobile"
            value={customerData.contactmobile}
            onChangeText={(text) => setCustomerData({...customerData, contactmobile: text})}
          />

          <TextInput
            className="w-full h-11 px-3 border border-gray-300 rounded-lg bg-white text-base"
            placeholder="Contact Email"
            value={customerData.contactemail}
            onChangeText={(text) => setCustomerData({...customerData, contactemail: text})}
          />

          {/* Account Information */}
          <Text className="text-sm font-semibold text-gray-600 mb-1 mt-4">Account Information</Text>
          <TextInput
            className="w-full h-11 px-3 border border-gray-300 rounded-lg bg-white text-base"
            placeholder="Credit Limit"
            value={customerData.creditLimit}
            onChangeText={(text) => setCustomerData({...customerData, creditLimit: text})}
            keyboardType="numeric"
          />

          <TextInput
            className="w-full h-11 px-3 border border-gray-300 rounded-lg bg-white text-base"
            placeholder="Parent Account Head"
            value={customerData.parentAccHead}
            onChangeText={(text) => setCustomerData({...customerData, parentAccHead: text})}
          />

          {/* Additional Information */}
          <Text className="text-sm font-semibold text-gray-600 mb-1 mt-4">Additional Details</Text>
          <TextInput
            className="w-full h-11 px-3 border border-gray-300 rounded-lg bg-white text-base"
            placeholder="Sales Person"
            value={customerData.salesPerson}
            onChangeText={(text) => setCustomerData({...customerData, salesPerson: text})}
          />

          <TextInput
            className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg bg-white text-base"
            placeholder="Remarks"
            value={customerData.remarks}
            onChangeText={(text) => setCustomerData({...customerData, remarks: text})}
            multiline
          />

          <TouchableOpacity
            className={`w-full h-12 rounded-lg flex items-center justify-center mt-6 ${loading ? 'bg-indigo-400' : 'bg-indigo-600'}`}
            onPress={handleAddCustomer}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-base">Add Customer</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddCustomer;
