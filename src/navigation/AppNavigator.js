import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADII } from '../constants/designTokens';

// Screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import QuotationsScreen from '../screens/QuotationsScreen';
import SavedScreen from '../screens/SavedScreen';
import DraftsScreen from '../screens/DraftsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom tab navigator for the main app
function MainTabs({ user }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: '🏠',
            Quotations: '🗂️',
            Drafts: '✏️',
            Saved: '🔖',
          };
          return <Text style={[s.tabIcon, { color }]}>{icons[route.name] || '📄'}</Text>;
        },
        tabBarActiveTintColor: COLORS.brand,
        tabBarInactiveTintColor: COLORS.inkFaint,
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: FONTS.body,
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.cardBorder,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
      })}
    >
      <Tab.Screen name="Home">
        {(props) => <HomeScreen {...props} user={user} />}
      </Tab.Screen>
      <Tab.Screen name="Quotations">
        {(props) => <QuotationsScreen {...props} user={user} />}
      </Tab.Screen>
      <Tab.Screen name="Drafts">
        {(props) => <DraftsScreen {...props} user={user} />}
      </Tab.Screen>
      <Tab.Screen name="Saved">
        {(props) => <SavedScreen {...props} user={user} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Root stack navigator
export default function AppNavigator({ user, showSplash, onSplashComplete }) {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {showSplash ? (
          <Stack.Screen name="Splash">
            {(props) => <SplashScreen {...props} onComplete={onSplashComplete} />}
          </Stack.Screen>
        ) : !user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs">
              {(props) => <MainTabs {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="Profile">
              {(props) => <ProfileScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="Settings">
              {(props) => <SettingsScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const s = StyleSheet.create({
  tabIcon: { fontSize: 22 },
});
