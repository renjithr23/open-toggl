import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';

import HomeScreen from './src/screens/HomeScreen'

const App = () => (
  <View
    style={{
      backgroundColor: '#fffff4',
    }}>
    <StatusBar style="dark" />
    <HomeScreen></HomeScreen>
  </View>
);

export default App

