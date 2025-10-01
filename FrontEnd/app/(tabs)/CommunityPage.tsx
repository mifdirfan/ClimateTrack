import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { styles } from '../../constants/CommunityPageStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext'; // Import your auth hook
import { Header } from '../../components/Header';
import API_BASE_URL from '../../constants/ApiConfig';

import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

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

type Post = {
    id: string;
    title: string;
    content: string;
    photoUrl?: string;
    comments: any[]; // Or a more specific Comment type
    likes: string[];
    dislikes: string[];
    postedByUsername: string;
};

export default function CommunityScreen() {
    const router = useRouter();

    const { token, isLoading: isAuthLoading } = useAuth(); // Get the real auth state

    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');

    // const filteredPosts = mockPosts.filter(
    //     (post) =>
    //         post.title.toLowerCase().includes(search.toLowerCase()) ||
    //         post.content.toLowerCase().includes(search.toLowerCase())
    // );

    const fetchPosts = useCallback(() => {
        // Don't try to fetch if we don't have a token
        if (!token) {
            setLoading(false);
            return;
        }

        setLoading(true);
        fetch(`${API_BASE_URL}/api/community/posts`, {
            headers: {
                'Authorization': `Bearer ${token}` // Include the auth token
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch community posts.');
                }
                return res.json();
            })
            .then((data: Post[]) => {
                setPosts(data);
            })
            .catch(err => {
                console.error(err);
                Alert.alert("Error", "Could not load community posts.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [token]);

    useEffect(() => {
        // Fetch posts only when the initial authentication check is complete
        if (!isAuthLoading) {
            fetchPosts();
        }
    }, [isAuthLoading, fetchPosts]);

    const handleWritePress = () => {
        // Check if the user is logged in before navigating
        if (token) {
            router.push('/screens/WritePostPage');
        } else {
            // If not logged in, redirect to the login screen
            Alert.alert("Login Required", "You must be logged in to create a post.");
            router.push('/screens/LoginScreen');
        }
    };

    const filteredPosts = posts.filter(
        (post) =>
            post.title.toLowerCase().includes(search.toLowerCase()) ||
            post.content.toLowerCase().includes(search.toLowerCase())
    );



    const renderPost = ({ item }: { item: Post }) => (
        <TouchableOpacity style={styles.postCard}>
            <View style={styles.postInfo}>
                <Text style={styles.postTitle}>{item.title}</Text>
                <Text style={styles.postContent} numberOfLines={3}>
                    {item.content}
                </Text>
                <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                        <Feather name="message-circle" size={14} color="#d12a2a" />
                        <Text style={styles.metaText}>{item.comments.length}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Ionicons name="heart-outline" size={14} color="#c0c0c0" />
                        <Text style={styles.metaText}>{item.likes.length}</Text>
                    </View>
                    <Text style={[styles.metaText, { marginLeft: 6 }]}>{item.postedByUsername}</Text>
                </View>
            </View>
            {item.photoUrl && (
                <Image
                    source={{ uri: item.photoUrl }}
                    style={styles.postImage}
                    resizeMode="cover"
                />
            )}
        </TouchableOpacity>
    );

    // Show a loading indicator while checking auth or fetching posts
    if (isAuthLoading || loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" style={{ flex: 1 }} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header title="ClimateTrack" />
            {/* Search Bar */}
            {/*<View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#b0b0b0" />
                <TextInput
                    placeholder="Search"
                    style={styles.searchInput}
                    value={search}
                    onChangeText={setSearch}
                    placeholderTextColor="#b0b0b0"
                />
            </View>*/}

            {/* Posts List or Login Prompt */}
            {!token ? (
                <View style={styles.loginPromptContainer}>
                    <Text style={styles.loginPromptText}>Please log in to view and create community posts.</Text>
                    <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/screens/LoginScreen')}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={filteredPosts}
                    keyExtractor={(item) => item.id}
                    renderItem={renderPost}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* Write Button */}
            <TouchableOpacity
                style={styles.writeButton}
                onPress={handleWritePress}
                activeOpacity={0.8}
            >
                <MaterialIcons name="edit" size={20} color="#fff" style={styles.pencilIcon} />
                <Text style={styles.writeText}>Write</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
