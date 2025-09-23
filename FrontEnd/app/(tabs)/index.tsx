// HOMEPAGE!!

import { Link } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {View, Text, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator, Modal, StyleSheet} from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import homepageStyles from '../../constants/homepageStyles'; // Renamed to avoid conflict

import GoogleMapWeb from "@/components/GoogleMap";
import {WebView} from "react-native-webview";
import { DISASTER_TYPES, getWeatherIconUrl } from '../../constants/weatherTypes';


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

export default function Index() {
    const [webviewUrl, setWebviewUrl] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [disasters, setDisasters] = useState<Disaster[]>([]);
    const [disasterLoading, setDisasterLoading] = useState(true);

    const [news, setNews] = useState<NewsItem[]>([]);
    const [newsLoading, setNewsLoading] = useState(true);

    // 🌐 Fetch disaster events
    useEffect(() => {
        fetch('http://192.168.219.101:8080/api/events')
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
                setDisasterLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch disasters:', err);
                setDisasterLoading(false);
            });
    }, []);

    // 🌐 Fetch news
    useEffect(() => {
        fetch('http://192.168.219.101:8080/api/news')
            .then(res => res.json())
            .then(data => {
                const mapped = data.map((n: any) => ({
                    id: n.articleId,
                    title: n.title,
                    description: n.description,
                    image: n.imageUrl,
                    url: n.url,
                    date: new Date(n.publishedAt).toLocaleString()
                }));
                setNews(mapped);
                setNewsLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch news:', err);
                setNewsLoading(false);
            });
    }, []);

    const filteredDisasters = selectedType
        ? disasters.filter(d => d.disasterType === selectedType)
        : disasters;

    const renderNewsItem = ({ item }: { item: NewsItem }) => (
        <TouchableOpacity style={homepageStyles.newsItem} onPress={() => setWebviewUrl(item.url)}>
            <Image source={{ uri: item.image }} style={homepageStyles.newsImage} />
            <View style={{ flex: 1 }}>
                <Text style={homepageStyles.newsTitle}>{item.title}</Text>
                <Text style={homepageStyles.newsDesc} numberOfLines={2}>{item.description}</Text>
                <Text style={homepageStyles.newsDate}>{item.date}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={homepageStyles.container}>
            {/* Search Bar */}
            <View style={homepageStyles.searchBar}>
                <FontAwesome5 name="search" size={18} color="#888" style={{ marginRight: 8 }} />
                <TextInput
                    placeholder="Search"
                    value={search}
                    onChangeText={setSearch}
                    style={homepageStyles.searchInput}
                />
            </View>

            {/* Disaster Filter Buttons */}
            <View style={homepageStyles.filterRow}>
                {DISASTER_TYPES.slice(0, 5).map((type) => ( // Show first 5 types for brevity
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
                        <Image source={{ uri: getWeatherIconUrl(type.iconCode) }} style={styles.filterIcon} />
                        <Text style={homepageStyles.filterBtnText}>{type.label}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity style={homepageStyles.filterMoreBtn}>
                    <MaterialIcons name="filter-list" size={20} color="#222" />
                </TouchableOpacity>
            </View>

            {/* Map */}
            {disasterLoading ? (
                <ActivityIndicator size="large" />
            ) : (
                <GoogleMapWeb disasters={filteredDisasters} />
            )}
            <Link href="/screens/CurrentLocationScreen" asChild>
                <TouchableOpacity style={styles.locationButton}>
                    <Text style={styles.locationButtonText}>View My Current Location</Text>
                </TouchableOpacity>
            </Link>

            {/* News Section */}
            <View style={homepageStyles.newsSection}>
                <FlatList
                    data={news}
                    renderItem={renderNewsItem}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        newsLoading
                            ? <Text>Loading news...</Text>
                            : <Text>No news available.</Text>
                    }
                />
                <Modal visible={!!webviewUrl} animationType="slide" onRequestClose={() => setWebviewUrl(null)}>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity
                            style={homepageStyles.webviewCloseBtn}
                            onPress={() => setWebviewUrl(null)}
                        >
                            <Text style={homepageStyles.webviewCloseText}>Close</Text>
                        </TouchableOpacity>
                        {webviewUrl && <WebView source={{ uri: webviewUrl }} style={{ flex: 1 }} />}
                    </View>
                </Modal>
            </View>

        </SafeAreaView>
    );
}

// Merged and new styles
const styles = StyleSheet.create({
    ...homepageStyles,
    locationButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        marginHorizontal: 20,
        marginBottom: 210, // Adjust to position above the news section
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    locationButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    filterIcon: {
        width: 20,
        height: 20,
        marginRight: 4,
    }
});

