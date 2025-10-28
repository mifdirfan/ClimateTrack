import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { styles } from '../../constants/CommunityPageStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { Header } from '../../components/Header';
import API_BASE_URL from '../../constants/ApiConfig';
import { useRouter } from 'expo-router';

type Post = {
    id: string;
    title: string;
    content: string;
    photoKey?: string; // Match backend field
    comments: any[];
    likes: string[];
    postedByUsername: string;
};

export default function CommunityScreen() {
    const router = useRouter();
    const { token, isLoading: isAuthLoading } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchPosts = useCallback(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        setLoading(true);
        fetch(`${API_BASE_URL}/api/posts`, { // Corrected API endpoint
            headers: {
                'Authorization': `Bearer ${token}`
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
        if (!isAuthLoading) {
            fetchPosts();
        }
    }, [isAuthLoading, fetchPosts]);

    const handleWritePress = () => {
        if (token) {
            router.push('/screens/WritePostPage');
        } else {
            Alert.alert("Login Required", "You must be logged in to create a post.");
            router.push('/screens/LoginScreen');
        }
    };

    const handlePostPress = (postId: string) => {
        router.push(`/screens/PostPage?id=${postId}`);
    };

    const filteredPosts = posts.filter(
        (post) =>
            post.title.toLowerCase().includes(search.toLowerCase()) ||
            post.content.toLowerCase().includes(search.toLowerCase())
    );

    const renderPost = ({ item }: { item: Post }) => (
        <TouchableOpacity style={styles.postCard} onPress={() => handlePostPress(item.id)}>
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
            {item.photoKey && (
                <Image
                    source={{ uri: item.photoKey }}
                    style={styles.postImage}
                    resizeMode="cover"
                />
            )}
        </TouchableOpacity>
    );

    if (isAuthLoading || loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" style={{ flex: 1 }} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Community" />

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
                    onRefresh={fetchPosts}
                    refreshing={loading}
                />
            )}

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
