import React, { useState, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    ActivityIndicator,
    View,
    Text,
    Alert,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid'; // FIX 1: Import all functions from uuid
import { Chat, MessageType, defaultTheme } from '@flyerhq/react-native-chat-ui';
import { useAuth } from '@/context/AuthContext';
import API_BASE_URL from '../../constants/ApiConfig';
import { Header } from '@/components/Header';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Define Bot User (remains the same)
const BOT_USER = {
    _id: '2', // Use a string ID for consistency
    name: 'ClimateTrack AI',
    // avatar: 'path/to/bot/avatar.png',
};

// FIX 2: Correctly spread the defaultTheme
const chatTheme = {
    ...defaultTheme,
    colors: {
        ...defaultTheme.colors,

        // --- Your Overrides ---
        background: '#fff', // Chat background
        primary: '#007AFF', // User bubble background
        secondary: '#E5E5EA', // Bot bubble background
        textDark: '#000', // Bot bubble text color
        textLight: '#fff', // User bubble text color
        inputBackground: '#fff', // Input bar background
        inputText: '#000',
    },
};

export default function ChatbotScreen() {
    // State now uses the new MessageType
    const [messages, setMessages] = useState<MessageType.Text[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { token, uid } = useAuth();
    const router = useRouter();

    // Set initial welcome message
    useEffect(() => {
        const welcomeMessage: MessageType.Text = {
            type: 'text',
            id: uuid.v4(), // FIX 1 (Usage)
            createdAt: new Date().getTime(),
            text: 'Hello! I am the ClimateTrack AI assistant. Ask me about flood preparedness or shelter information.',
            author: {
                id: BOT_USER._id,
                firstName: BOT_USER.name,
                // imageUrl: BOT_USER.avatar, // If you have one
            },
        };
        setMessages([welcomeMessage]);
    }, []);

    // The send handler is now onSendPress
    const handleSendPress = useCallback(
        async (message: MessageType.PartialText) => {
            // This check is already correct
            if (!token || !uid) {
                Alert.alert("Authentication Error", "Please log in again to use the chatbot.");
                return;
            }
            if (isLoading) {
                console.log("Already waiting for a response, ignoring new message.");
                return;
            }

            // 1. Create the user's message in the new format
            const userMessage: MessageType.Text = {
                type: 'text',
                id: uuid.v4(), // FIX 1 (Usage)
                createdAt: new Date().getTime(),
                text: message.text,
                author: {
                    id: uid, // uid from AuthContext
                },
            };

            // 2. Add user's message to state (newest message first)
            setMessages(previousMessages => [userMessage, ...previousMessages]);
            setIsLoading(true);

            // 3. Send to backend (this logic is unchanged)
            console.log(`Sending message to backend: "${message.text}"`);
            try {
                const response = await fetch(`${API_BASE_URL}/api/chatbot/query`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ message: message.text }),
                });

                const responseBody = await response.json();
                if (!response.ok) {
                    const errorMessage = responseBody?.reply || `Request failed with status ${response.status}`;
                    throw new Error(errorMessage);
                }

                // 4. Create bot's response in the new format
                const botMessage: MessageType.Text = {
                    type: 'text',
                    id: uuid.v4(), // FIX 1 (Usage)
                    createdAt: new Date().getTime(),
                    text: responseBody.reply || "Sorry, I received an empty response.",
                    author: {
                        id: BOT_USER._id,
                        firstName: BOT_USER.name,
                        // imageUrl: BOT_USER.avatar,
                    },
                };

                // 5. Add bot's message to state
                setMessages(previousMessages => [botMessage, ...previousMessages]);

            } catch (error: any) {
                console.error("Chatbot API Error:", error);

                // 6. Create error message in the new format
                const errorMessage: MessageType.Text = {
                    type: 'text',
                    id: uuid.v4(), // FIX 1 (Usage)
                    createdAt: new Date().getTime(),
                    text: `Error: ${error.message || 'Could not reach the chatbot.'}`,
                    author: {
                        id: BOT_USER._id,
                        firstName: BOT_USER.name,
                        // imageUrl: BOT_USER.avatar,
                    },
                };
                setMessages(previousMessages => [errorMessage, ...previousMessages]);

            } finally {
                setIsLoading(false);
            }
        },
        [token, isLoading, uid]
    );

    // Loading state for user
    if (!uid) {
        return (
            <SafeAreaView style={styles.container}>
                <Header title="ClimateTrack AI" leftComponent={
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 5 }}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                } />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Loading user info...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Main Chat UI
    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <Header
                leftComponent={
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#007AFF" />
                    </TouchableOpacity>}
                title="ClimateTrack"
                rightComponent={
                    <TouchableOpacity style={styles.backButton}>
                        {/* Empty spacer */}
                    </TouchableOpacity>}
            />

            {/* This layout wrapper is still important */}
            <View style={styles.chatContainer}>
                {isLoading && (
                    <View style={styles.typingIndicatorContainer}>
                        <ActivityIndicator size="small" color="#888" />
                        <Text style={styles.typingText}>ClimateTrack AI is typing...</Text>
                    </View>
                )}
                <Chat
                    messages={messages}
                    onSendPress={handleSendPress}
                    user={{ id: uid }} // Pass user in the new format
                    theme={chatTheme} // Apply your custom styles
                    // isTyping={isLoading}
                    // placeholder="Ask the chatbot..."
                    // This library uses a different prop for the loading spinner
                    emptyState={() => (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color="#007AFF" />
                        </View>
                    )}
                />

                {/* This keyboard fix is still a good idea */}
                {Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    chatContainer: {
        flex: 1, // This is crucial
    },
    backButton: {
        padding: 5,
        minWidth: 34,
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    typingIndicatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    typingText: {
        marginLeft: 10,
        fontSize: 14,
        color: '#888',
        fontStyle: 'italic',
    },
});