import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';

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

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
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
        //component={Profile}
        options={{ headerShown: true, title: 'Profile', presentation: 'modal' }}
      />

      {/* Notifications Screen */}
      <Stack.Screen
        name="NotificationDetail"
        //component={Notifications}
        options={{ headerShown: true, title: 'Notifications' }}
      />

<Stack.Screen
        name="Location"
        //component={Notifications}
        options={{ headerShown: true, title: 'Location' }}
      />

     
    </Stack>
  
    </NotificationProvider>
    
    </AuthProvider>
  );
};

export default App;
