// HOMEPAGE!!

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../constants/homepageStyles';

import GoogleMapWeb from "@/components/GoogleMap";

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
    date: string;
};

const DISASTER_TYPES = [
    { key: 'flood', label: 'Flood', color: '#FF4747', icon: 'water' },
    { key: 'landslide', label: 'Landslide', color: '#FFC107', icon: 'mountain' },
    { key: 'rain', label: 'Heavy Rain', color: '#2196F3', icon: 'cloud-rain' }
];

export default function Index() {
    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [disasters, setDisasters] = useState<Disaster[]>([]);
    const [disasterLoading, setDisasterLoading] = useState(true);

    const [news, setNews] = useState<NewsItem[]>([]);
    const [newsLoading, setNewsLoading] = useState(true);

    // 🌐 Fetch disaster events
    useEffect(() => {
        fetch('http://192.168.219.104:8080/api/events')
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
        fetch('http://192.168.219.104:8080/api/news')
            .then(res => res.json())
            .then(data => {
                const mapped = data.map((n: any) => ({
                    id: n.articleId,
                    title: n.title,
                    description: n.description,
                    image: n.imageUrl,
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
        <TouchableOpacity style={styles.newsItem}>
            <Image source={{ uri: item.image }} style={styles.newsImage} />
            <View style={{ flex: 1 }}>
                <Text style={styles.newsTitle}>{item.title}</Text>
                <Text style={styles.newsDesc} numberOfLines={2}>{item.description}</Text>
                <Text style={styles.newsDate}>{item.date}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* 🔍 Search Bar */}
            <View style={styles.searchBar}>
                <FontAwesome5 name="search" size={18} color="#888" style={{ marginRight: 8 }} />
                <TextInput
                    placeholder="Search"
                    value={search}
                    onChangeText={setSearch}
                    style={styles.searchInput}
                />
            </View>

            {/* 🔘 Disaster Filter Buttons */}
            <View style={styles.filterRow}>
                {DISASTER_TYPES.map((type) => (
                    <TouchableOpacity
                        key={type.key}
                        style={[
                            styles.filterBtn,
                            {
                                backgroundColor: type.color,
                                opacity: selectedType === type.key || !selectedType ? 1 : 0.5
                            }
                        ]}
                        onPress={() => setSelectedType(selectedType === type.key ? null : type.key)}
                    >
                        <FontAwesome5 name={type.icon as any} size={16} color="#fff" style={{ marginRight: 4 }} />
                        <Text style={styles.filterBtnText}>{type.label}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.filterMoreBtn}>
                    <MaterialIcons name="filter-list" size={20} color="#222" />
                </TouchableOpacity>
            </View>

            {/* 🗺️ Map */}
            {disasterLoading ? (
                <ActivityIndicator size="large" />
            ) : (
                <GoogleMapWeb disasters={filteredDisasters} />
            )}

            {/* 📰 News Section */}
            <View style={styles.newsSection}>
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
            </View>
        </SafeAreaView>
    );
}



// const MOCK_DISASTERS = [
//     {
//         id: 1,
//         type: 'flood',
//         title: 'Flood in Kuala Lumpur',
//         description: 'Severe flooding reported',
//         coordinate: { latitude: 3.139, longitude: 101.6869 }
//     },
//     {
//         id: 2,
//         type: 'flood',
//         title: 'Flood in Johor Bahru',
//         description: 'Evacuations underway',
//         coordinate: { latitude: 1.4927, longitude: 103.7414 }
//     },
//     {
//         id: 3,
//         type: 'landslide',
//         title: 'Landslide in Penang',
//         description: 'Roads blocked',
//         coordinate: { latitude: 5.4164, longitude: 100.3327 }
//     },
//     {
//         id: 4,
//         type: 'rain',
//         title: 'Storm in Kota Bharu',
//         description: 'People advised to stay at home.',
//         coordinate: { latitude: 6.1251, longitude: 102.2379 }
//     }
// ];

// const MOCK_NEWS = [
//     {
//         id: '1',
//         title: 'Massive Malaysia Floods',
//         description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum...',
//         image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?fit=crop&w=400&q=80',
//         date: '6 minutes ago'
//     },
//     {
//         id: '2',
//         title: 'Landslide blocks highway',
//         description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum...',
//         image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?fit=crop&w=400&q=80',
//         date: '15 minutes ago'
//     }
// ];