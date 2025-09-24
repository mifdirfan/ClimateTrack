import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Modal, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import GoogleMapWeb from "@/components/GoogleMap";
import { useLocation } from '@/hooks/useLocation';
import { weatherTypes } from '@/constants/weatherTypes';
import homepageStyles from '../../constants/homepageStyles';

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
    const [news, setNews] = useState<NewsItem[]>([]);
    const [newsLoading, setNewsLoading] = useState(true);
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

    const { requestLocation, errorMsg } = useLocation();

    // Fetch disaster events and news
    useEffect(() => {
        // Fetch disasters
        fetch('http://172.30.1.90:8080/api/events')
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

