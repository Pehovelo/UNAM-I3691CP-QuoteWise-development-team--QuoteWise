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
import ROUTES from '../constants/routes';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
};

export default function AppNavigator() {
  return (
    <QuotationProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={ROUTES.WELCOME_LOGIN}
          screenOptions={screenOptions}
        >
          <Stack.Screen
            name={ROUTES.WELCOME_LOGIN}
            component={WelcomeLoginScreen}
          />
          <Stack.Screen
            name={ROUTES.DASHBOARD}
            component={DashboardScreen}
          />
          <Stack.Screen
            name={ROUTES.QUOTATIONS}
            component={QuotationsScreen}
          />
          <Stack.Screen
            name={ROUTES.QUOTATION_DETAIL}
            component={QuotationDetailScreen}
          />
          <Stack.Screen
            name={ROUTES.DRAFTS}
            component={DraftScreen}
          />
          <Stack.Screen
            name={ROUTES.SAVED_QUOTATIONS}
            component={SavedQuotationsScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </QuotationProvider>
  );
}
