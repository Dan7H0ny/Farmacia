import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const CustomCarga = ({ color, size }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size={size} color={color} />
  </View>
);

export default CustomCarga;
