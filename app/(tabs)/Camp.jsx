import { ScrollView, View, Text, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { images } from '../../constants';
import { fetchActiveCamps } from '../../api/bloodcamp';

export default function BloodBankCamp() {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCamps = async () => {
    setLoading(true);
    try {
      const activeCamps = await fetchActiveCamps();
     // Call the API function
      setCamps(activeCamps);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCamps();
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
            padding: 15,
          }}
        >
          <Text style={{ color: '#FD0000' }}>Blood Bank Camp</Text>
        </Text>
        <Text style={{ fontSize: 18, fontWeight: '500', textAlign: 'right', color: '#111111' }}>
          Near You...
        </Text>
        <Image
          source={images.profile}
          style={{ maxWidth: 380, width: '100%', height: 180 }}
          resizeMode="contain"
        />
        <Text>{" "}</Text>
        <Text>{" "}</Text>

        {camps.map((camp, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#add8e6',
              padding: 10,
              borderRadius: 10,
              marginVertical: 5,
              width: '100%',
              maxWidth: 350,
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={images.profile}
                style={{ width: 40, height: 40, marginRight: 10 }}
              />
              <View>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>
                  {camp.date}
                </Text>
                <Text style={{ fontSize: 14, color: '#000' }}>{camp.location}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}