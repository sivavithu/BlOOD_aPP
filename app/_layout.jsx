import { StyleSheet, Text, View, Button } from 'react-native';
import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

// Import screens
import Profile from './profile'; // Ensure you import the correct Profile component
import Notifications from './Notifications'; // Import Notifications screen

import AuthProvider, { useAuth } from '@/providers/AuthProvider';
import Push from '@/components/push';
import NotificationProvider from '@/providers/NotificationProvider';

// Prevent SplashScreen from auto-hiding
SplashScreen.preventAutoHideAsync();

const App = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  const [isConnected, setIsConnected] = useState(true); // State for internet connectivity status

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }

    // Listen for internet connectivity changes
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected); // Update state based on connection status
    });

    // Clean up the listener when the component is unmounted
    return () => unsubscribe();
  }, [fontsLoaded, error]);

  if (!fontsLoaded || error) {
    return null;
  }

  // If no internet connection, show a reload button
  if (!isConnected) {
    return (
      <View style={styles.container}>
        <Text>No Internet Connection</Text>
        <Button title="Reload" onPress={() => NetInfo.fetch()} />
      </View>
    );
  }

  return (
    <AuthProvider>
      <NotificationProvider>
        <Stack>
          {/* Home Screen */}
          <Stack.Screen name="index" options={{ headerShown: false }} />

          {/* Authentication Screens */}
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />

          {/* Tabs Layout */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* Profile Screen */}
          <Stack.Screen
            name="profile"
            options={{ headerShown: true, title: 'Profile', presentation: 'modal' }}
          />

          {/* Notifications Screen */}
          <Stack.Screen
            name="NotificationDetail"
            options={{ headerShown: true, title: 'Notifications' }}
          />

          <Stack.Screen
            name="Location"
            options={{ headerShown: true, title: 'Location' }}
          />
        </Stack>
      </NotificationProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
