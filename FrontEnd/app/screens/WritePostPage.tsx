import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Image,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useAuth } from '@/context/AuthContext';
import API_BASE_URL from '../../constants/ApiConfig';

export default function WritePostPage() {
    const router = useRouter();
    const { token, user } = useAuth();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    const handleChooseImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handlePost = async () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert("Empty Fields", "Please enter a title and content for your post.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('postedByUserId', user?.uid || '');
        formData.append('postedByUsername', user?.email || 'Anonymous');

        if (location) {
            formData.append('latitude', String(location.coords.latitude));
            formData.append('longitude', String(location.coords.longitude));
        }

        if (image) {
            const uriParts = image.split('.');
            const fileType = uriParts[uriParts.length - 1];
            formData.append('image', {
                uri: image,
                name: `photo.${fileType}`,
                type: `image/${fileType}`,
            } as any);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/posts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            Alert.alert("Post Submitted", "Your post has been submitted successfully.", [
                { text: "OK", onPress: () => router.back() }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Could not submit your post.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                        <Ionicons name="close" size={28} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Write</Text>
                    <TouchableOpacity
                        onPress={handlePost}
                        style={styles.headerButton}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator size="small" /> : <Text style={styles.doneText}>Done</Text>}
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.titleInput}
                        placeholder="Please enter the title."
                        placeholderTextColor="#B0B0B0"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <TextInput
                        style={styles.contentInput}
                        placeholder="Freely talk with your community. #Disaster #SafetyFirst"
                        placeholderTextColor="#B0B0B0"
                        value={content}
                        onChangeText={setContent}
                        multiline
                    />
                    {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.footerButton} onPress={handleChooseImage}>
                        <Ionicons name="camera-outline" size={24} color="#888" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    headerButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    doneText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },
    inputContainer: {
        flex: 1,
        padding: 20,
    },
    titleInput: {
        fontSize: 20,
        fontWeight: '500',
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
        marginBottom: 15,
    },
    contentInput: {
        flex: 1,
        fontSize: 16,
        textAlignVertical: 'top',
        lineHeight: 24,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#EFEFEF',
    },
    footerButton: {
        padding: 8,
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginTop: 10,
    },
});
