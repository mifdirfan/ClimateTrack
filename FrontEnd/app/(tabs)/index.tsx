// HOMEPAGE!!

import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../constants/homepageStyles';

type Disaster = {
    id: number;
    type: string;
    title: string;
    description: string;
    coordinate: { latitude: number; longitude: number; };
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
    { key: 'landslide', label: 'Landslide', color: '#FFC107', icon: 'terrain' },
    { key: 'rain', label: 'Heavy Rain', color: '#2196F3', icon: 'cloud-rain' }
];

const MOCK_DISASTERS = [
    {
        id: 1,
        type: 'flood',
        title: 'Flood in Kuala Lumpur',
        description: 'Severe flooding reported',
        coordinate: { latitude: 3.139, longitude: 101.6869 }
    },
    {
        id: 2,
        type: 'flood',
        title: 'Flood in Johor Bahru',
        description: 'Evacuations underway',
        coordinate: { latitude: 1.4927, longitude: 103.7414 }
    },
    {
        id: 3,
        type: 'landslide',
        title: 'Landslide in Penang',
        description: 'Roads blocked',
        coordinate: { latitude: 5.4164, longitude: 100.3327 }
    }
];

const MOCK_NEWS = [
    {
        id: '1',
        title: 'Massive Malaysia Floods',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum...',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?fit=crop&w=400&q=80',
        date: '6 minutes ago'
    },
    {
        id: '2',
        title: 'Landslide blocks highway',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum...',
        image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?fit=crop&w=400&q=80',
        date: '15 minutes ago'
    }
];

export default function Index() {
    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState<string | null>(null);

    const filteredDisasters = selectedType
        ? MOCK_DISASTERS.filter(d => d.type === selectedType)
        : MOCK_DISASTERS;

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
            {/* Search Bar */}
            <View style={styles.searchBar}>
                <FontAwesome5 name="search" size={18} color="#888" style={{ marginRight: 8 }} />
                <TextInput
                    placeholder="Search"
                    value={search}
                    onChangeText={setSearch}
                    style={styles.searchInput}
                />
            </View>

            {/* Disaster Filter Buttons */}
            <View style={styles.filterRow}>
                {DISASTER_TYPES.map((type) => (
                    <TouchableOpacity
                        key={type.key}
                        style={[
                            styles.filterBtn,
                            { backgroundColor: type.color, opacity: selectedType === type.key || !selectedType ? 1 : 0.5 }
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

            {/* Map */}
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 4.2105,
                    longitude: 101.9758,
                    latitudeDelta: 5,
                    longitudeDelta: 5,
                }}
            >
                {filteredDisasters.map((disaster) => (
                    <Marker
                        key={disaster.id}
                        coordinate={disaster.coordinate}
                        title={disaster.title}
                        description={disaster.description}
                        pinColor={DISASTER_TYPES.find(t => t.key === disaster.type)?.color}
                    >
                        <View style={[styles.marker, { backgroundColor: DISASTER_TYPES.find(t => t.key === disaster.type)?.color }]}>
                            <FontAwesome5
                                name={DISASTER_TYPES.find(t => t.key === disaster.type)?.icon as any}
                                size={20}
                                color="#fff"
                            />
                        </View>
                    </Marker>
                ))}
            </MapView>

            {/* News Section */}
            <View style={styles.newsSection}>
                <FlatList
                    data={MOCK_NEWS}
                    renderItem={renderNewsItem}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<Text>No news at this time.</Text>}
                />
            </View>
        </SafeAreaView>
    );
}