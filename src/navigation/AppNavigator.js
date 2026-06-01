/**
 * QuoteWise App Navigator
 * Root navigation stack using React Navigation.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { QuotationProvider } from '../context/QuotationContext';
import WelcomeLoginScreen from '../screens/WelcomeLoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import QuotationsScreen from '../screens/QuotationsScreen';
import QuotationDetailScreen from '../screens/QuotationDetailScreen';
import DraftScreen from '../screens/DraftScreen';
import SavedQuotationsScreen from '../screens/SavedQuotationsScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
};

export default function AppNavigator() {
  return (
    <QuotationProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="WelcomeLogin"
          screenOptions={screenOptions}
        >
          <Stack.Screen
            name="WelcomeLogin"
            component={WelcomeLoginScreen}
          />
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
          />
          <Stack.Screen
            name="Quotations"
            component={QuotationsScreen}
          />
          <Stack.Screen
            name="QuotationDetail"
            component={QuotationDetailScreen}
          />
          <Stack.Screen
            name="Drafts"
            component={DraftScreen}
          />
          <Stack.Screen
            name="SavedQuotations"
            component={SavedQuotationsScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </QuotationProvider>
  );
}
