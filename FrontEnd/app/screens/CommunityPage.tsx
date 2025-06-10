// screens/CommunityScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface Post {
    id: string;
    title: string;
    description: string;
    time: string;
    comments: number;
    author: string;
    image: string;
}

const dummyPosts: Post[] = [
    {
        id: '1',
        title: 'Landslide at Taman Wira',
        description:
            'Major landslide at taman wira. The road is currently closed right now so if you are on the way here please stay alert! Help is coming but it may take time. They are not very fast in responding to...',
        time: '17:14',
        comments: 3,
        author: 'Anonymous',
        image: 'https://via.placeholder.com/80',
    },
    // Add more dummy posts if needed
];

const CommunityScreen = () => {
    const renderPost = ({ item }: { item: Post }) => (
        <View style={styles.postContainer}>
            <View style={styles.postText}>
                <Text style={styles.title}>{item.title}</Text>
                <Text numberOfLines={3} style={styles.description}>
                    {item.description}
                </Text>
                <View style={styles.meta}>
                    <MaterialCommunityIcons name="comment-outline" size={14} color="gray" />
                    <Text style={styles.metaText}>{item.comments}</Text>
                    <Text style={styles.metaText}>• {item.time}</Text>
                    <Text style={styles.metaText}>• {item.author}</Text>
                </View>
            </View>
            <Image source={{ uri: item.image }} style={styles.postImage} />
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Community</Text>
                <View style={styles.headerIcons}>
                    <Ionicons name="search" size={22} style={styles.icon} />
                    <Ionicons name="menu" size={22} />
                </View>
            </View>
            <FlatList
                data={dummyPosts}
                keyExtractor={(item) => item.id}
                renderItem={renderPost}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

export default CommunityScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    headerText: {
        fontSize: 18,
        fontWeight: '600',
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 10,
    },
    icon: {
        marginRight: 10,
    },
    postContainer: {
        flexDirection: 'row',
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    postText: {
        flex: 1,
        paddingRight: 8,
    },
    title: {
        fontWeight: '700',
        fontSize: 15,
        marginBottom: 4,
    },
    description: {
        fontSize: 13,
        color: '#333',
        marginBottom: 6,
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    metaText: {
        fontSize: 12,
        color: 'gray',
        marginLeft: 4,
    },
    postImage: {
        width: 80,
        height: 80,
        borderRadius: 6,
    },
});
