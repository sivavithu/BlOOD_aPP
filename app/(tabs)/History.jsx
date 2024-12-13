import { StatusBar } from 'expo-status-bar';
import { ScrollView, View, Text, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { images } from '../../constants';
import { supabase } from '../../lib/supabase'; // Adjust the path as necessary
import { useAuth } from '../../providers/AuthProvider';

export default function DonationHistory() {
  const {session}=useAuth()
  const [donations, setDonations] = useState([]);
  const [locations, setLocations] = useState({}); // To store camp locations
  const userId = session.user.id; // Assuming session.user.id is available

  // Fetch donation data for the specific donor
  const fetchDonations = async () => {
    const { data, error } = await supabase
      .from('donor_donations')
      .select('date, camp_id')
      .eq('donor_id', userId); // F donor_id

    if (error) {
      Alert.alert('Error fetching donations', error.message);
      return;
    }

    // Map the fetched data to include the amount in ml
    const formattedDonations = data.map(donation => ({
      date: donation.date,
      camp_id: donation.camp_id,
      
    }));

    setDonations(formattedDonations);
    fetchCampLocations(formattedDonations.map(d => d.camp_id)); // Fetch locations for the camp_ids
  };

  // Fetch camp locations based on camp_ids
  const fetchCampLocations = async (campIds) => {
    const { data, error } = await supabase
      .from('blood_camp')
      .select('id, location') // Assuming 'location' is the field for camp location
      .in('id', campIds); // Filter by camp_ids

    if (error) {
      Alert.alert('Error fetching camp locations', error.message);
      return;
    }

    // Map locations to camp_ids
    const locationMap = {};
    data.forEach(camp => {
      locationMap[camp.id] = camp.location; // Assuming 'id' is the camp_id
    });

    setLocations(locationMap);
  };

  useEffect(() => {
    fetchDonations();
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
        <Text style={{ fontSize: 36, fontWeight: 'bold', textAlign: 'left', color: '#FFFFFF', padding: 15 }}>
          <Text style={{ color: '#FD0000' }}>
            Donation History !!!
          </Text>
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
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>
                  {donation.date}
                </Text>
                <Text style={{ fontSize: 14, color: '#fff' }}>
                  {locations[donation.camp_id] || 'Loading...'} {/* Show location */}
                </Text>
              </View>
            </View>
            
          </View>
        ))}
      </View>
    </ScrollView>
  );
}