// HOMEPAGE!!

import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
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
    { key: 'heavy rain', label: 'Heavy Rain', color: '#2196F3', icon: 'cloud-rain' }
];



export default function Index() {
    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [disasters, setDisasters] = useState<Disaster[]>([]);
    const [disasterLoading, setDisasterLoading] = useState(true);


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
            <GoogleMapWeb disasters={filteredDisasters} />
            {/*<MapView*/}
            {/*    style={styles.map}*/}
            {/*    initialRegion={{*/}
            {/*        latitude: 4.2105,*/}
            {/*        longitude: 101.9758,*/}
            {/*        latitudeDelta: 5,*/}
            {/*        longitudeDelta: 5,*/}
            {/*    }}*/}
            {/*>*/}
            {/*    {filteredDisasters.map((disaster) => (*/}
            {/*        <Marker*/}
            {/*            key={disaster.id}*/}
            {/*            coordinate={disaster.coordinate}*/}
            {/*            title={disaster.title}*/}
            {/*            description={disaster.description}*/}
            {/*            pinColor={DISASTER_TYPES.find(t => t.key === disaster.type)?.color}*/}
            {/*        >*/}
            {/*            <View style={[styles.marker, { backgroundColor: DISASTER_TYPES.find(t => t.key === disaster.type)?.color }]}>*/}
            {/*                <FontAwesome5*/}
            {/*                    name={DISASTER_TYPES.find(t => t.key === disaster.type)?.icon as any}*/}
            {/*                    size={20}*/}
            {/*                    color="#fff"*/}
            {/*                />*/}
            {/*            </View>*/}
            {/*        </Marker>*/}
            {/*    ))}*/}
            {/*</MapView>*/}

        </SafeAreaView>
    );
}