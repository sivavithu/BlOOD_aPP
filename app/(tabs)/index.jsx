import { StatusBar } from 'expo-status-bar';
import { ScrollView, View, Text, Image, Alert } from 'react-native';
import React, { useState,useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons, images } from '../../constants';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '../../providers/AuthProvider';
import {supabase} from '../../lib/supabase'

const SignUp = () => {
    const [donations, setDonations] = useState(0);
    const [livesSaved, setLivesSaved] = useState(0);
    const [totalBlood, setTotalBlood] = useState(0); // in ml
    const [lastDonationDate, setLastDonationDate] = useState(null);
    const [nextDonationDate,setNextDonationDate] = useState(null);
    const [progress, setProgress] = useState(0); // Progress percentage
    const { session } = useAuth();
  
   useEffect(() => {
  const fetchDonationData = async () => {
    try {
      // Fetch donation data for the user
      const { data:donationData, error: donationError } = await supabase
        .from('donor_donations')
        .select('no_of_bottles,date') // Include donation_date
        .eq('donor_id',session.user.id)
        .order('date', { ascending: false }); // Order by donation_date in descending order
       console.warn("hi",donationData)
      if (donationError) {
        Alert.alert('Error fetching donations', donationError.message);
        return;
      }

      if (donationData && donationData.length > 0) {
        // Calculate total bottles, blood, and lives saved
        const totalBottles = donationData.reduce((sum, donation) => sum + donation.no_of_bottles, 0);
        setDonations(totalBottles);

        const totalBloodAmount = totalBottles * 200; // Each bottle is 200 ml
        setTotalBlood(totalBloodAmount);

        setLivesSaved(Math.floor(totalBloodAmount / 300)); // Each life saved is 300 ml

        // Get the most recent donation date
        const recentDonationDate = new Date(donationData[0].date);
        setLastDonationDate(recentDonationDate);

        // Calculate next donation date and progress
        const nextDate = new Date(recentDonationDate);
        nextDate.setDate(nextDate.getDate() + 100); // 100-day gap
        setNextDonationDate(nextDate);

        const today = new Date();
        const daysSinceLastDonation = Math.max(0, (today - recentDonationDate) / (1000 * 60 * 60 * 24));
        const progressPercentage = Math.min(100, (daysSinceLastDonation / 100) * 100);
        setProgress(progressPercentage);
      } else {
        // No donations found
        setDonations(0);
        setTotalBlood(0);
        setLivesSaved(0);
        setLastDonationDate(null);
        setNextDonationDate(null);
        setProgress(0);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  fetchDonationData();
}, []);

    return (
        <LinearGradient
            colors={['#FFFFFF', '#FD0000', '#FFFFFF', '#FD0000', '#FFFFFF']}
            locations={[0.4, 0.8, 1, 0.2, 0.3]}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        padding: 16,
                    }}
                >
                    
                    <View style={{ width: '100%', marginBottom: 24, alignItems: 'center' }}>
                        <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' }}>
                            <Text style={{ color: '#FD0000' }}>Blood KING</Text>
                        </Text>
                        <Image
                            source={images.curve}
                            style={{
                                width: 350,
                                height: 20,
                                marginTop: 8,
                            }}
                            resizeMode="contain"
                        />
                    </View>

                   
                    <Text style={{ fontSize: 18, fontWeight: '800', color: '#111111', marginVertical: 16 }}>
                        Welcome RV6 !!!
                    </Text>
                    <Image
                        source={images.logo}
                        style={{ width: '100%', height: 180, marginBottom: 24 }}
                        resizeMode="contain"
                    />

                    
                    <View
                        style={{
                            backgroundColor: '#ffecec',
                            padding: 20,
                            borderRadius: 20,
                            width: '100%',
                            marginBottom: 24,
                            alignItems: 'center',
                        }}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                            {[
                                { label: 'lives saved', value: livesSaved },
                                { label: 'of blood', value: totalBlood+"ml"},
                                { label: 'donations', value: donations },
                            ].map((stat, index) => (
                                <View key={index} style={{ alignItems: 'center' }}>
                                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#ff0000' }}>
                                        {stat.value}
                                    </Text>
                                    <Text style={{ fontSize: 16 }}>{stat.label}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    
                    <View
    style={{
        backgroundColor: '#ffecec',
        padding: 20,
        borderRadius: 20,
        width: '100%',
        marginBottom: 24,
    }}
>
    <View
        style={{
            flexDirection: 'row',
            justifyContent: 'space-between', 
            alignItems: 'center', 
        }}
    >
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Blood Request</Text>
        <Pressable onPress={() => router.push('/NotificationDetail')}>
            <Ionicons name="chevron-forward" size={24} color="#000" />
        </Pressable>
    </View>

    <View style={{ alignItems: 'left', marginTop: 16 }}>
        
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#ff0000', textAlign: 'left' }}>3</Text>
    </View>
</View>


                   
<View style={{ alignItems: 'center', marginVertical: 20, padding: 20, borderRadius: 30, backgroundColor: '#ffecec', width: '100%' }}>
  <Text style={{ fontSize: 20 }}>Next Donation</Text>

  {lastDonationDate ? (
    <>
      {nextDonationDate ? (
        <>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 10 }}>
            {nextDonationDate.toLocaleDateString()}
          </Text>
          <View
            style={{
              width: '100%',
              height: 20,
              backgroundColor: '#ddd',
              borderRadius: 10,
              overflow: 'hidden',
              marginVertical: 10,
            }}
          >
            <View
              style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: '#ff0000',
              }}
            />
          </View>
          <Text style={{ fontSize: 16 }}>
            {Math.max(0, Math.ceil((nextDonationDate - new Date()) / (1000 * 60 * 60 * 24)))} days
          </Text>
        </>
      ) : (
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 10 }}>
          No upcoming donation date available
        </Text>
      )}
    </>
  ) : (
    <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 10 }}>
      No donations provided
    </Text>
  )}
</View>
                </ScrollView>
                <StatusBar backgroundColor="#FFFFFF" style="dark" />
            </SafeAreaView>
        </LinearGradient>
    );
};

export default SignUp;
