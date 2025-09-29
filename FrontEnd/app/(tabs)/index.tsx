import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Modal, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import GoogleMapWeb from "@/components/GoogleMap";
import { useLocation } from '@/hooks/useLocation';
import { weatherTypes } from '@/constants/weatherTypes';
import homepageStyles from '../../constants/homepageStyles';
import API_BASE_URL from '../../constants/ApiConfig';

// Type definitions
type Disaster = {
    disasterId: string;
    disasterType: string;
    description: string;
    locationName: string;
    latitude: number;
    longitude: number;
};

type NewsItem = {
    id: string;
    title: string;
    description: string;
    image: string;
    url: string;
    date: string;
};

type UserLocation = {
    latitude: number;
    longitude: number;
};

export default function Index() {
    const [webviewUrl, setWebviewUrl] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [disasters, setDisasters] = useState<Disaster[]>([]);
    const [disasterLoading, setDisasterLoading] = useState(true);
    const [disasterError, setDisasterError] = useState<string | null>(null);
    const [news, setNews] = useState<NewsItem[]>([]);
    const [newsLoading, setNewsLoading] = useState(true);
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

    const { requestLocation, errorMsg } = useLocation();

    // Fetch disaster events and news
    useEffect(() => {
        // Fetch disasters
        setDisasterError(null);
        fetch(`${API_BASE_URL}/api/events`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to load disaster events. The server might be unavailable.');
                }
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    const mapped = data.map((d: any) => ({
                        disasterId: d.disasterId,
                        disasterType: d.disasterType,
                        description: d.description,
                        locationName: d.locationName,
                        latitude: parseFloat(d.latitude),
                        longitude: parseFloat(d.longitude)
                    }));
                    setDisasters(mapped);
                }
            })
            .catch(err => setDisasterError(err.message || 'An unknown error occurred.'))
            .finally(() => setDisasterLoading(false));


    }, []);

    const handleGetLocation = async () => {
        const location = await requestLocation();
        if (location) {
            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        } else if (errorMsg) {
            alert(errorMsg);
        }
    };

    /*const filteredDisasters = selectedType
        ? disasters.filter(d => d.disasterType === selectedType)
        : disasters;*/

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

            {/*<View style={homepageStyles.filterRow}>
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
            </View>*/}

            <View style={styles.mapContainer}>
                {disasterLoading ? (
                    <ActivityIndicator size="large" />
                ) : disasterError ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{disasterError}</Text>
                        <Text style={styles.errorHint}>Please ensure the backend server is running and the IP in ApiConfig.ts is correct.</Text>
                    </View>
                ) : (
                    <GoogleMapWeb disasters={disasters} userLocation={userLocation} />
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8d7da',
    },
    errorText: {
        color: '#721c24',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorHint: {
        color: '#721c24',
        textAlign: 'center',
        fontSize: 14,
        marginTop: 10,
    },
});

