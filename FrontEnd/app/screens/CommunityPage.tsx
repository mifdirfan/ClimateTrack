import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { styles } from '../../constants/CommunityPageStyles';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';

const mockPosts = [
    {
        id: '1',
        title: 'Landslide at Taman Wira',
        content: 'Major landslide at taman wira. The road is currently closed right now so if you are on the way here please stay alert! Help is coming but it may take time. They are not very fast in responding to...',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?fit=crop&w=400&q=80',
        comments: 3,
        views: 1714,
        author: 'Anonymous',
    },
    {
        id: '2',
        title: 'Flood at Riverpark',
        content: 'Flooding is occurring at Riverpark, please avoid the area and stay safe. Water levels are rising rapidly.',
        image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?fit=crop&w=400&q=80',
        comments: 1,
        views: 842,
        author: 'Anonymous',
    },
    // Add more mock posts if needed
];

export default function CommunityScreen({ navigation }: any) {
    const [search, setSearch] = useState('');

    const filteredPosts = mockPosts.filter(
        (post) =>
            post.title.toLowerCase().includes(search.toLowerCase()) ||
            post.content.toLowerCase().includes(search.toLowerCase())
    );

    const renderPost = ({ item }: { item: typeof mockPosts[0] }) => (
        <View style={styles.postCard}>
            <View style={styles.postInfo}>
                <Text style={styles.postTitle}>{item.title}</Text>
                <Text style={styles.postContent} numberOfLines={3}>
                    {item.content}
                </Text>
                <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                        <Feather name="message-circle" size={14} color="#d12a2a" />
                        <Text style={styles.metaText}>{item.comments}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Ionicons name="eye-outline" size={14} color="#c0c0c0" />
                        <Text style={styles.metaText}>{item.views}</Text>
                    </View>
                    <Text style={[styles.metaText, { marginLeft: 6 }]}>{item.author}</Text>
                </View>
            </View>
            <Image
                source={{ uri: item.image }}
                style={styles.postImage}
                resizeMode="cover"
            />
        </View>
    );

    return (
        <View style={styles.container}>

            {/* Search Bar */}
            <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#b0b0b0" />
                <TextInput
                    placeholder="Search"
                    style={styles.searchInput}
                    value={search}
                    onChangeText={setSearch}
                    placeholderTextColor="#b0b0b0"
                />
            </View>

            {/* Posts List */}
            <FlatList
                data={filteredPosts}
                keyExtractor={(item) => item.id}
                renderItem={renderPost}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            {/* Write Button */}
            <TouchableOpacity
                style={styles.writeButton}
                onPress={() => {
                    // Handle write new post navigation
                }}
                activeOpacity={0.8}
            >
                <MaterialIcons name="edit" size={20} color="#fff" style={styles.pencilIcon} />
                <Text style={styles.writeText}>Write</Text>
            </TouchableOpacity>
        </View>
    );
}
