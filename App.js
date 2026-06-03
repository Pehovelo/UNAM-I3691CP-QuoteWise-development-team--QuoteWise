import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { onAuthChange, wasUserLoggedIn } from './src/services/authService';
import { getUserProfile } from './src/services/firestoreService';

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [userRole, setUserRole] = useState('client');

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          if (profile?.role) setUserRole(profile.role);
        } catch (e) {
          // default to client
        }
      }
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, []);

  // Handle splash completion
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Enrich user object with role
  const enrichedUser = user ? { ...user, role: userRole } : null;

  // While initializing, show splash screen
  if (initializing && showSplash) {
    return (
      <>
        <StatusBar barStyle="light-content" />
        <AppNavigator
          user={null}
          showSplash={true}
          onSplashComplete={handleSplashComplete}
        />
      </>
    );
  }

  // After splash, show auth or main app
  return (
    <>
      <StatusBar barStyle={user ? "dark-content" : "light-content"} />
      <AppNavigator
        user={enrichedUser}
        showSplash={false}
        onSplashComplete={handleSplashComplete}
      />
    </>
  );
}
