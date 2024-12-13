import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScrollView, Image, Alert } from 'react-native';
import { images } from '../constants';
export default function Notifications({ navigation }) {
    const camps = [
      { date: '03 August 2024', location: 'Faculty of Science, University of Jaffna.' },
      { date: '08 August 2024', location: 'Thellipalai Hospital' },
      { date: '20 August 2024', location: 'Jaffna Hospital' },
      { date: '28 August 2024', location: 'Jaffna Hospital' },
    ];
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
        
        <Image
            source={images.notific}
            style={{ maxWidth: 380, width: '100%', height: 180 }}
            resizeMode="contain"
        />

        <Text> {""}</Text>
        <Text> {""}</Text>

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
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
