import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { onAuthChange, wasUserLoggedIn } from './src/services/authService';

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, []);

  // Handle splash completion
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

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
        user={user}
        showSplash={false}
        onSplashComplete={handleSplashComplete}
      />
    </>
  );
}
