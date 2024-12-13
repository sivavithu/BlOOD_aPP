import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable, TextInput, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const Location = () => {
    const [searchText, setSearchText] = useState('');
    const [region, setRegion] = useState({
        latitude: 9.6615,
        longitude: 80.0255,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const handleSearch = async () => {
        if (!searchText.trim()) {
            Alert.alert('Error', 'Please enter a location to search');
            return;
        }

        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                    searchText
                )}&key=YOUR_GOOGLE_MAPS_API_KEY`
            );

            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const { lat, lng } = data.results[0].geometry.location;
                setRegion({
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
            } else {
                Alert.alert('Error', 'Location not found. Please try again.');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while searching for the location.');
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <MapView style={styles.map} region={region}>
                <Marker
                    coordinate={{ latitude: region.latitude, longitude: region.longitude }}
                    title="Searched Location"
                    description={searchText}
                />
            </MapView>

            <TextInput
                style={styles.searchBox}
                placeholder="Search location"
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
            />

            <Pressable style={styles.button} onPress={handleSearch}>
                <Text style={styles.buttonText}>Find Location</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
    },
    map: {
        //flex: 1,
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        bottom: 150,     
    },
    
    searchBox: {
        position: 'absolute',
        bottom: 90, 
        left: '10%',
        right: '10%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        paddingLeft: 15,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    button: {
        position: 'absolute',
        bottom: 30, 
        left: '10%',
        right: '10%',
        padding: 15,
        backgroundColor: '#FD0000',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Location;
