import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { WebView } from 'react-native-webview';
// import { useAuth } from '@/context/AuthContext';
import GoogleMapWeb from "@/components/GoogleMap";
import { useLocation } from '@/hooks/useLocation';
import { weatherTypes } from '@/constants/weatherTypes';
import homepageStyles from '../../constants/homepageStyles';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

const API_BASE_URL = 'http://192.168.219.104:8080';

// Type definitions
type Disaster = {
    disasterId: string;
    disasterType: string;
    description: string;
    locationName: string;
    latitude: number;
    longitude: number;
};


type UserLocation = {
    latitude: number;
    longitude: number;
};



// Helper function to get the push token
async function getPushToken() {
    if (!Device.isDevice) {
        alert('Must use physical device for Push Notifications');
        return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return null;
    }

    // This is the token you'll send to your backend
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("FCM Token:", token);
    return token;
}

export default function Index() {
    //const [webviewUrl, setWebviewUrl] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [disasters, setDisasters] = useState<Disaster[]>([]);
    const [disasterLoading, setDisasterLoading] = useState(true);
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

    // const { token, username } = useAuth();
    // For now, we'll use a placeholder for testing:
    const { token, username } = { token: "your_jwt_token", username: "testuser" }; // Replace with your real auth state

    const { requestLocation, errorMsg } = useLocation();


    const sendLocationToBackend = useCallback(async (location: { coords: { latitude: number; longitude: number; } }) => {
        // Only proceed if we have a token and username
        if (!token || !username) {
            console.log("User is not logged in. Skipping location update.");
            return;
        }

        console.log(`Sending location for logged-in user: ${username}`);
        try {
            // Note: getPushToken will only work in a development build
            const fcmToken = await getPushToken();

            await fetch(`${API_BASE_URL}/api/auth/location/${username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    fcmToken: fcmToken
                }),
            });
            console.log('Logged-in user location and token updated');
        } catch (error) {
            console.error('Failed to send location for logged-in user:', error);
        }
    }, [token, username]); // Dependency array ensures this function updates when the user logs in/out


    // Fetch disaster events and news
    useEffect(() => {
        // Fetch disasters
        fetch(`${API_BASE_URL}/api/events`)
            .then(res => res.json())
            .then(data => {
                const mapped = data.map((d: any) => ({
                    disasterId: d.disasterId,
                    disasterType: d.disasterType,
                    description: d.description,
                    locationName: d.locationName,
                    latitude: parseFloat(d.latitude),
                    longitude: parseFloat(d.longitude)
                }));
                setDisasters(mapped);
            })
            .catch(err => console.error('Failed to fetch disasters:', err))
            .finally(() => setDisasterLoading(false));

        handleGetLocation();

    }, []);

    const handleGetLocation = useCallback(async () => {
        const location = await requestLocation();
        if (location) {
            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
            // This will now correctly check if the user is logged in before sending
            await sendLocationToBackend(location);
        } else if (errorMsg) {
            alert(errorMsg);
        }
    }, [requestLocation, errorMsg, sendLocationToBackend]);

    const filteredDisasters = selectedType
        ? disasters.filter(d => d.disasterType === selectedType)
        : disasters;

    return (
        <SafeAreaView style={homepageStyles.container}>
            <View style={homepageStyles.searchBar}>
                <FontAwesome5 name="search" size={18} color="#888" style={{ marginRight: 8 }} />
                <TextInput
                    placeholder="Search"
                    value={search}
                    onChangeText={setSearch}
                    style={homepageStyles.searchInput}
                />
            </View>

            <View style={homepageStyles.filterRow}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {weatherTypes.map((type) => (
                        <TouchableOpacity
                            key={type.key}
                            style={[
                                homepageStyles.filterBtn,
                                {
                                    backgroundColor: type.color,
                                    opacity: selectedType === type.key || !selectedType ? 1 : 0.5
                                }
                            ]}
                            onPress={() => setSelectedType(selectedType === type.key ? null : type.key)}
                        >
                            <Image source={{ uri: `https://openweathermap.org/img/wn/${type.icon}@2x.png` }} style={{ width: 20, height: 20, marginRight: 4 }} />
                            <Text style={homepageStyles.filterBtnText}>{type.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.mapContainer}>
                {disasterLoading ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <GoogleMapWeb disasters={filteredDisasters} userLocation={userLocation} />
                )}
                <TouchableOpacity style={styles.locationButton} onPress={handleGetLocation}>
                    <MaterialIcons name="my-location" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mapContainer: {
        flex: 1,
        position: 'relative',
        marginBottom: 50, // Added to prevent map from going under the tab bar
    },
    locationButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: '#fff',
        borderRadius: 30,
        padding: 12,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});

