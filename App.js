import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { onAuthChange, wasUserLoggedIn, getCachedUser } from './src/services/authService';
import { getUserProfile } from './src/services/firestoreService';

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [userRole, setUserRole] = useState('client');
  const initialized = useRef(false);

  // Listen for Firebase Auth state changes — this is the source of truth
  // With ReactNativeAsyncStorage persistence, Firebase will automatically
  // restore the session on app restart.
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // User is authenticated — try to load profile for role info
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          if (profile?.role) {
            setUserRole(profile.role);
          }
        } catch (e) {
          // If Firestore fails (e.g. rules not deployed), try cached profile
          try {
            const cached = await getCachedUser();
            if (cached?.role) setUserRole(cached.role);
          } catch (e2) {
            // Default to client
          }
        }
        setUser(firebaseUser);
      } else {
        // User is NOT authenticated
        // Check if user was previously logged in (cold start with slow Firebase restore)
        const wasLoggedIn = await wasUserLoggedIn();
        if (wasLoggedIn) {
          // Firebase auth is still restoring from AsyncStorage persistence
          // Keep showing splash — the onAuthStateChanged listener will fire again
          // If after 3 seconds still no user, then proceed to login screen
          setTimeout(() => {
            setInitializing((prev) => {
              if (prev) {
                // Firebase auth restore timeout — proceed to login screen
              }
              return false;
            });
          }, 3000);
          return; // Don't set user to null yet
        }
        setUser(null);
        setUserRole('client');
      }

      if (initializing) {
        setInitializing(false);
      }
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
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" />
        <AppNavigator
          user={null}
          showSplash={true}
          onSplashComplete={handleSplashComplete}
        />
      </SafeAreaProvider>
    );
  }

  // After splash, show auth or main app
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={user ? "dark-content" : "light-content"} />
      <AppNavigator
        user={enrichedUser}
        showSplash={false}
        onSplashComplete={handleSplashComplete}
      />
    </SafeAreaProvider>
  );
}
