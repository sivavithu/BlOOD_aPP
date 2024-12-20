import { ScrollView, View, Text, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { images } from '../../constants';
import { supabase } from '../../lib/supabase'; // Adjust based on your project structure

export default function BloodBankCamp() {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch active camps initially
  const loadCamps = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blood_camp')
        .select('*')
        .eq('status', 'active'); // Assuming there's a 'status' column for active camps

      if (error) throw error;

      setCamps(data || []);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to real-time changes in the `bloodcamp` table
  const subscribeToCamps = () => {
    const subscription = supabase
      .channel('bloodcamp-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'blood_camp' },
        (payload) => {
          console.log('Realtime update:', payload);

          const updatedCamp = payload.new;
          switch (payload.eventType) {
            case 'INSERT':
              setCamps((prev) => [...prev, updatedCamp]);
              break;
            case 'UPDATE':
              setCamps((prev) =>
                prev.map((camp) =>
                  camp.id === updatedCamp.id ? updatedCamp : camp
                )
              );
              break;
            case 'DELETE':
              setCamps((prev) => prev.filter((camp) => camp.id !== payload.old.id));
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

  useEffect(() => {
    loadCamps();
    const unsubscribe = subscribeToCamps();

    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 25,
      }}
    >
      <View
        style={{
          backgroundColor: '#ffecec',
          padding: 25,
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
            paddingBottom: 15,
          }}
        >
          <Text style={{ color: '#FD0000' }}>Blood Bank Camp</Text>
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '500',
            textAlign: 'right',
            color: '#111111',
            marginBottom: 20,
          }}
        >
          Near You...
        </Text>
        <Image
          source={images.profile}
          style={{ maxWidth: 380, width: '100%', height: 180 }}
          resizeMode="contain"
        />

        {camps.map((camp, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              backgroundColor: '#add8e6',
              padding: 15,
              borderRadius: 10,
              marginVertical: 5,
              width: '100%',
              maxWidth: 350,
            }}
          >
            <Image
              source={images.profile}
              style={{ width: 40, height: 40, marginRight: 10 }}
            />
            <View style={{ flexDirection: 'column', flexShrink: 1, maxWidth: '80%' }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#000',
                  flexWrap: 'wrap',
                }}
              >
                {camp.date}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: '#000',
                  flexWrap: 'wrap',
                  maxWidth: '100%',
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {camp.address}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
