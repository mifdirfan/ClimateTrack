import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Modal, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { WebView } from 'react-native-webview';

import GoogleMapWeb from "@/components/GoogleMap";
import { useLocation } from '@/hooks/useLocation';
import { weatherTypes } from '@/constants/weatherTypes';
import homepageStyles from '../../constants/homepageStyles';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

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

// type NewsItem = {
//     id: string;
//     title: string;
//     description: string;
//     image: string;
//     url: string;
//     date: string;
// };

type UserLocation = {
    latitude: number;
    longitude: number;
};

// You will need to get the auth state from your app's context or storage
// This is a placeholder for your actual authentication logic
const getAuthState = () => {
    // In a real app, you would get this from AsyncStorage or a global state
    // For testing, you can hardcode it:
    // return {
    //     token: "your_jwt_token_here", // The token you get after logging in
    //     username: "testuser"          // The username of the logged-in user
    // };
    return { token: null, username: null }; // Return this if the user is not logged in
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
    //const [news, setNews] = useState<NewsItem[]>([]);
    //const [newsLoading, setNewsLoading] = useState(true);
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

    const { requestLocation, errorMsg } = useLocation();

    const sendLocationToBackend = async (location: { coords: { latitude: number; longitude: number; } }) => {
        const { token, username } = getAuthState();
        const fcmToken = await getPushToken(); // Get the FCM token

        if (token && username) {
            // --- LOGGED-IN USER FLOW ---
            console.log(`Sending location for logged-in user: ${username}`);
            try {
                await fetch(`${API_BASE_URL}/api/auth/location/${username}`, { //
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        fcmToken: fcmToken // ADDED: Send the FCM token
                    }),
                });
                console.log('Logged-in user location and token updated');
            } catch (error) {
                // ...
            }
        } else {
            // --- ANONYMOUS USER FLOW ---
            const anonymousId = Device.osInternalBuildId || Math.random().toString(36).substring(2);
            console.log(`Sending location for anonymous user: ${anonymousId}`);
            try {
                await fetch(`${API_BASE_URL}/api/anonymous/location`, { //
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        anonymousId: anonymousId,
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        fcmToken: fcmToken // ADDED: Send the FCM token
                    }),
                });
                console.log('Anonymous location and token updated');
            } catch (error) {
                // ...
            }
        }
    };

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

        // // Fetch news
        // fetch('http://172.30.1.90:8080/api/news')
        //     .then(res => res.json())
        //     .then(data => {
        //         const mapped = data.map((n: any) => ({
        //             id: n.articleId,
        //             title: n.title,
        //             description: n.description,
        //             image: n.imageUrl,
        //             url: n.url,
        //             date: new Date(n.publishedAt).toLocaleString()
        //         }));
        //         setNews(mapped);
        //     })
        //     .catch(err => console.error('Failed to fetch news:', err))
        //     .finally(() => setNewsLoading(false));
    }, []);

    const handleGetLocation = async () => {
        const location = await requestLocation();
        if (location) {
            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
            await sendLocationToBackend(location);
        } else if (errorMsg) {
            alert(errorMsg);
        }
    };

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

