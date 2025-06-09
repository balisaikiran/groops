import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { GroupProvider } from './src/context/GroupContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AuthProvider>
          <GroupProvider>
            <AppNavigator />
            <StatusBar style="auto" />
          </GroupProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
