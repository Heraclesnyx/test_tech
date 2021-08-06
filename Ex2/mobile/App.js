import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';

import { AuthScreen } from './screens';
import {globalStyles} from "./styles/global";


export default function App() {
  return (
    <View style={globalStyles.container}>
      <AuthScreen />
      <StatusBar style="auto" />
    </View>
  );
}

