import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import API_BASE_URL from '../../constants/ApiConfig';
import {Header} from "@/components/Header";

type Comment = {
    commentId: string;
    userId: string;
    username: string;
    text: string;
    postedAt: string;
};

type Post = {
    id: string;
    title: string;
    content: string;
    photoUrl?: string;
    comments: Comment[];
    likes: string[];
    postedByUsername: string;
    postedAt: string;
};

export default function PostPage() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { token, user } = useAuth();

    const [post, setPost] = useState<Post | null>(null);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchPostDetails = useCallback(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        setLoading(true);
        fetch(`${API_BASE_URL}/api/posts/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch post details.');
                }
                return res.json();
            })
            .then((data: Post) => {
                setPost(data);
            })
            .catch(err => {
                console.error(err);
                Alert.alert("Error", "Could not load post details.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id, token]);

    useEffect(() => {
        fetchPostDetails();
    }, [fetchPostDetails]);

    const handleLike = async () => {
        if (!post || !token) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/${post.id}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-User-Id': user?.uid || '',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to like post');
            }

            const updatedPost = await response.json();
            setPost(updatedPost);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Could not like the post.");
        }
    };

    const handleAddComment = async () => {
        if (!comment.trim() || !post || !token || !user) return;

        const newComment = {
            text: comment,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/${post.id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-User-Id': user.uid,
                    'X-Username': user.email || 'Anonymous',
                },
                body: JSON.stringify(newComment),
            });

            if (!response.ok) {
                throw new Error('Failed to add comment');
            }

            const updatedPost = await response.json();
            setPost(updatedPost);
            setComment('');
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Could not add your comment.");
        }
    };

    if (loading) {
        return <ActivityIndicator style={{ flex: 1 }} size="large" />;
    }

    if (!post) {
        return <Text style={styles.errorText}>Post not found.</Text>;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Post</Text>
                    <View style={{ width: 24 }} />
                </View>

                <FlatList
                    ListHeaderComponent={() => (
                        <View style={styles.postContainer}>
                            <Text style={styles.postTitle}>{post.title}</Text>
                            <Text style={styles.postUsername}>by {post.postedByUsername}</Text>
                            <Image
                                source={post.photoUrl ? { uri: post.photoUrl } : require('@/assets/images/defaultReportPhoto.png')} // Use your preferred fallback
                                style={styles.postImage}
                                resizeMode="cover" // Recommended for consistency
                            />
                            <Text style={styles.postContent}>{post.content}</Text>
                            <View style={styles.metaRow}>
                                <TouchableOpacity onPress={handleLike} style={styles.metaItem}>
                                    <Ionicons name={post.likes.includes(user?.uid || '') ? "heart" : "heart-outline"} size={20} color="#d12a2a" />
                                    <Text style={styles.metaText}>{post.likes.length}</Text>
                                </TouchableOpacity>
                                <View style={styles.metaItem}>
                                    <Feather name="message-circle" size={20} color="#555" />
                                    <Text style={styles.metaText}>{post.comments.length}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                    data={post.comments}
                    keyExtractor={(item) => item.commentId}
                    renderItem={({ item }) => (
                        <View style={styles.commentContainer}>
                            <Text style={styles.commentUsername}>{item.username}</Text>
                            <Text style={styles.commentText}>{item.text}</Text>
                        </View>
                    )}
                />

                <View style={styles.commentInputContainer}>
                    <TextInput
                        style={styles.commentInput}
                        placeholder="Write a comment..."
                        value={comment}
                        onChangeText={setComment}
                    />
                    <TouchableOpacity onPress={handleAddComment} style={styles.sendButton}>
                        <Ionicons name="send" size={24} color="#007AFF" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    postContainer: { padding: 16 },
    postTitle: { fontSize: 22, fontWeight: 'bold' },
    postUsername: { fontSize: 14, color: 'gray', marginBottom: 12 },
    postImage: { width: '100%', height: 200, borderRadius: 10, marginBottom: 12 },
    postContent: { fontSize: 16, lineHeight: 24 },
    metaRow: { flexDirection: 'row', marginTop: 16, gap: 24 },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    metaText: { fontSize: 16, color: '#555' },
    commentContainer: { padding: 12, borderTopWidth: 1, borderTopColor: '#eee' },
    commentUsername: { fontWeight: 'bold', marginBottom: 4 },
    commentText: { fontSize: 14 },
    commentInputContainer: { flexDirection: 'row', padding: 8, borderTopWidth: 1, borderTopColor: '#eee' },
    commentInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 },
    sendButton: { marginLeft: 8, justifyContent: 'center' },
    errorText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: 'red' },
});
