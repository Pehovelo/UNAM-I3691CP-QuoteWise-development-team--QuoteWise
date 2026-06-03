import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADII, rs } from '../constants/designTokens';

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
import QuotationFormScreen from '../screens/QuotationFormScreen';
import QuotationDetailScreen from '../screens/QuotationDetailScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ComposePostScreen from '../screens/ComposePostScreen';
import QuoteResponsesScreen from '../screens/QuoteResponsesScreen';
import SubmitQuotationScreen from '../screens/SubmitQuotationScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom tab navigator for the main app
function MainTabs({ user }) {
  const userRole = user?.role || 'client';
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          const iconSize = rs(22);
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Quotations') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Compose') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Saved') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          }
          return <Ionicons name={iconName} size={iconSize} color={color} />;
        },
        tabBarActiveTintColor: COLORS.brand,
        tabBarInactiveTintColor: COLORS.inkFaint,
        tabBarLabelStyle: {
          fontSize: rs(10),
          fontFamily: FONTS.body,
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.cardBorder,
          borderTopWidth: 1,
          // Ensure tab bar never goes under system navigation bar
          height: rs(56) + Math.max(insets.bottom, rs(8)),
          paddingBottom: Math.max(insets.bottom, rs(8)),
          paddingTop: rs(4),
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      })}
    >
      <Tab.Screen name="Home">
        {(props) => <HomeScreen {...props} user={user} />}
      </Tab.Screen>
      <Tab.Screen name="Quotations">
        {(props) => <QuotationsScreen {...props} user={user} />}
      </Tab.Screen>
      <Tab.Screen name="Compose">
        {(props) => <ComposePostScreen {...props} user={user} />}
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
            <Stack.Screen name="QuotationForm" component={QuotationFormScreen} />
            <Stack.Screen name="QuotationDetail">
              {(props) => <QuotationDetailScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="QuoteResponses">
              {(props) => <QuoteResponsesScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="SubmitQuotation">
              {(props) => <SubmitQuotationScreen {...props} user={user} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
