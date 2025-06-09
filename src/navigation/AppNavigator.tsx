import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

// Define the type for route parameters
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Group: { groupId: string; groupName: string };
  CreateGroup: undefined;
  Chat: { groupId: string; groupName: string; chatName?: string };
  Thread: { groupId: string; messageId: string; parentMessage: any };
};

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import GroupScreen from '../screens/GroupScreen';
import CreateGroupScreen from '../screens/CreateGroupScreen';
import ChatScreen from '../screens/ChatScreen';
import ThreadScreen from '../screens/ThreadScreen';

// Stack Navigator
const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Groups' }} />
        <Stack.Screen name="Group" component={GroupScreen} options={({ route }) => ({ title: route.params.groupName || 'Group' })} />
        <Stack.Screen name="CreateGroup" component={CreateGroupScreen} options={{ title: 'Create Group' }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={({ route }) => ({ title: route.params.chatName || route.params.groupName || 'Chat' })} />
        <Stack.Screen name="Thread" component={ThreadScreen} options={{ title: 'Thread' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;