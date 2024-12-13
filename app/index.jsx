import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { images } from '../constants';
import CustomButton from '../components/CustomButton';
import { Redirect } from 'expo-router';
import { useAuth } from '../providers/AuthProvider';
import { useState } from 'react';

export default function App() {
  const { session, loading } = useAuth();
  const [buttonPressed, setButtonPressed] = useState(false);

  if (loading) {
    return <ActivityIndicator size="large" color="#FD0000" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  if (buttonPressed) {
    if (!session) {
      return <Redirect href={'/(auth)/sign-in'} />;
    }

    if (session) {
      return <Redirect href={'/(tabs)'} />;
    }
  }

  return (
    <LinearGradient
      colors={['#FFFFFF', '#FD0000', '#FFFFFF', '#FD0000', '#FFFFFF', '#FFFFFF']}
      locations={[0.4, 0.8, 1, 0.2, 0.3, 0.5]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, paddingHorizontal: 15 }}>
            <View style={{ position: 'relative', marginTop: 40 }}>
              <Text
                style={{
                  fontSize: 45,
                  color: 'white',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontFamily: 'Poppins-SemiBold',
                }}
              >
                <Text style={{ color: '#FF0000' }}>Blood KING</Text>
              </Text>
              <Image
                source={images.path}
                style={{ width: 180, height: 15, position: 'absolute', bottom: -8, right: -32 }}
                resizeMode="contain"
              />
            </View>

            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 15,
                fontFamily: 'Poppins-SemiBold',
                color: '#111111',
                marginTop: 20,
                textAlign: 'center',
              }}
            >
              "Tears of a mother cannot save her Child. But your Blood can."
            </Text>

            <Image
              source={images.empty}
              style={{ maxWidth: 380, width: '100%', height: 300 }}
              resizeMode="contain"
            />

            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 25,
                fontFamily: 'Poppins-SemiBold',
                color: 'white',
                textAlign: 'center',
              }}
            >
              "Be the reason for someone’s heartbeat" with{' '}
              <Text style={{ color: '#ff0000', fontWeight: 'bold' }}>Blood KING</Text>
            </Text>

            <CustomButton
              title="Continue"
              handlePress={() => setButtonPressed(true)} // Update the state on button press
              containerStyles={{ width: '100%', marginTop: 50 }}
            />
          </View>
        </ScrollView>
        <StatusBar backgroundColor="#FFFFFF" style="dark" />
      </SafeAreaView>
    </LinearGradient>
  );
}
