import { StatusBar } from 'expo-status-bar';
import { ScrollView, View, Text, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { images } from '../../constants';
import { supabase } from '../../lib/supabase'; // Adjust the path as necessary
import { useAuth } from '../../providers/AuthProvider';

export default function DonationHistory() {
  const { session } = useAuth();
  const [donations, setDonations] = useState([]);
  const [locations, setLocations] = useState({});
  const userId = session.user.id; // Assuming session.user.id is available

  // Fetch donation data for the specific donor
  const fetchDonations = async () => {
    const { data, error } = await supabase
      .from('donor_donations')
      .select('id, date, camp_id')
      .eq('donor_id', userId);

    if (error) {
      Alert.alert('Error fetching donations', error.message);
      return;
    }

    setDonations(data || []);
    fetchCampLocations(data?.map((d) => d.camp_id) || []); // Fetch locations for the camp_ids
  };

  // Fetch camp locations based on camp_ids
  const fetchCampLocations = async (campIds) => {
    const { data, error } = await supabase
      .from('blood_camp')
      .select('id, name')
      .in('id', campIds);

    if (error) {
      Alert.alert('Error fetching camp locations', error.message);
      return;
    }

    // Map locations to camp_ids
    const locationMap = {};
    data.forEach((camp) => {
      locationMap[camp.id] = camp.name;
    });

    setLocations(locationMap);
  };

  // Subscribe to real-time changes in the `donor_donations` table
  const subscribeToDonations = () => {
    const subscription = supabase
      .channel('donor-donations-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'donor_donations' },
        (payload) => {
          console.log('Realtime donation update:', payload);

          const updatedDonation = payload.new;
          switch (payload.eventType) {
            case 'INSERT':
              setDonations((prev) => [...prev, updatedDonation]);
              fetchCampLocations([updatedDonation.camp_id]);
              break;
            case 'UPDATE':
              setDonations((prev) =>
                prev.map((donation) =>
                  donation.id === updatedDonation.id ? updatedDonation : donation
                )
              );
              break;
            case 'DELETE':
              setDonations((prev) =>
                prev.filter((donation) => donation.id !== payload.old.id)
              );
              break;
            default:
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  };

  // Subscribe to real-time changes in the `blood_camp` table
  const subscribeToCampUpdates = () => {
    const subscription = supabase
      .channel('blood-camp-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'blood_camp' },
        (payload) => {
          console.log('Realtime camp update:', payload);

          const updatedCamp = payload.new;
          setLocations((prev) => ({
            ...prev,
            [updatedCamp.id]: updatedCamp.name,
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  };

  useEffect(() => {
    fetchDonations();
    const unsubscribeDonations = subscribeToDonations();
    const unsubscribeCampUpdates = subscribeToCampUpdates();

    return () => {
      unsubscribeDonations();
      unsubscribeCampUpdates();
    };
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <View
        style={{
          padding: 20,
          borderRadius: 10,
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Text
          style={{
            fontSize: 36,
            fontWeight: 'bold',
            textAlign: 'left',
            color: '#FFFFFF',
            padding: 15,
          }}
        >
          <Text style={{ color: '#FD0000' }}>Donation History !!!</Text>
        </Text>

        <Image
          source={images.thumbnail}
          style={{ maxWidth: 380, width: '100%', height: 180 }}
          resizeMode="contain"
        />

        {donations.map((donation, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#ff767b',
              padding: 20,
              borderRadius: 20,
              marginVertical: 5,
              width: '100%',
              maxWidth: 500,
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={images.profile}
                style={{ width: 40, height: 40, marginRight: 10 }}
                resizeMode="contain"
              />
              <View>
                <Text
                  style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}
                >
                  {donation.date}
                </Text>
                <Text style={{ fontSize: 14, color: '#fff' }}>
                  {locations[donation.camp_id] || 'Loading...'}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
