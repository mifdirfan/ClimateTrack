import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat, IMessage, Bubble, BubbleProps } from 'react-native-gifted-chat';
import {SafeAreaView, StyleSheet, ActivityIndicator, View, Text, Alert, TouchableOpacity} from 'react-native';
import { useAuth } from '@/context/AuthContext'; // Adjust path if needed
import API_BASE_URL from '../../constants/ApiConfig'; // Adjust path if needed
import { Header } from '@/components/Header'; // Assuming you have a Header component
import { Ionicons } from '@expo/vector-icons'; // For back button
import { useRouter } from 'expo-router';

// Define message structure for Gifted Chat
interface ChatMessage extends IMessage {
    // Add custom properties if needed
}

// Define Bot User
const BOT_USER = {
    _id: 2, // Must be unique and different from the logged-in user's ID
    name: 'ClimateTrack AI',
    // avatar: 'path/to/bot/avatar.png', // Optional bot avatar URL
};

export default function ChatbotScreen() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false); // For typing indicator / loading state
    const [inputText, setInputText] = useState(''); // State for the input text
    const { token, uid } = useAuth(); // Get token and user ID (uid) from context
    const router = useRouter();

    // Set initial welcome message from the bot
    useEffect(() => {
        setMessages([
            {
                _id: 1, // Use a consistent initial ID
                text: 'Hello! I am the ClimateTrack AI assistant. Ask me about flood preparedness or shelter information.',
                createdAt: new Date(),
                user: BOT_USER,
            },
        ]);
    }, []);

    const onSend = useCallback((newMessages: ChatMessage[] = []) => {
        if (!token) {
            Alert.alert("Authentication Error", "Please log in again to use the chatbot.");
            // Optionally redirect to login
            // router.replace('/screens/LoginScreen');
            return;
        }
        if (isLoading) {
            console.log("Already waiting for a response, ignoring new message.");
            return; // Prevent sending while waiting for a response
        }

        // Add user's message optimistically to the chat UI
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, newMessages),
        );

        const userMessageText = newMessages[0].text;
        setInputText(''); // Clear the input field manually
        setIsLoading(true); // Show typing indicator

        // Send message to your backend chatbot endpoint
        console.log(`Sending message to backend: "${userMessageText}"`);
        fetch(`${API_BASE_URL}/api/chatbot/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ message: userMessageText }),
        })
        .then(async response => { // Make async to handle error text
            const responseBody = await response.json(); // Always try to parse JSON
            if (!response.ok) {
                 // Use reply from JSON if available, otherwise construct error
                 const errorMessage = responseBody?.reply || `Request failed with status ${response.status}`;
                throw new Error(errorMessage);
            }
            return responseBody; // Contains { reply: "..." }
        })
        .then(data => {
            // Create the bot's response message object
            const botMessage: ChatMessage = {
                _id: new Date().getTime(), // Use timestamp for a more unique ID
                text: data.reply || "Sorry, I received an empty response.", // Use reply field from backend
                createdAt: new Date(),
                user: BOT_USER,
            };
            // Add bot's message to the chat
            setMessages(previousMessages =>
                 GiftedChat.append(previousMessages, [botMessage]),
             );
        })
        .catch(error => {
            console.error("Chatbot API Error:", error);
             // Create an error message to display in the chat
             const errorMessage: ChatMessage = {
                _id: new Date().getTime(), // Use timestamp for a more unique ID
                text: `Error: ${error.message || 'Could not reach the chatbot.'}`,
                createdAt: new Date(),
                user: BOT_USER, // Show error as if it's from the bot
            };
             setMessages(previousMessages =>
                 GiftedChat.append(previousMessages, [errorMessage]),
             );
        })
        .finally(() => {
            setIsLoading(false); // Hide typing indicator
        });
    }, [token, isLoading, uid]); // Include uid in dependencies if used in user prop below

    // If user ID isn't loaded yet, show loading or prompt
    if (!uid) {
        // You might want a better loading/error state here
        return (
            <SafeAreaView style={styles.container}>
                <Header title="ClimateTrack AI" leftComponent={
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 5 }}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                }/>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                     <Text>Loading user info...</Text>
                 </View>
            </SafeAreaView>
        );
    }

    return (
         <SafeAreaView style={styles.container}>
            {/* Simple Header with Back Button */}
             <Header
                 leftComponent={
                     <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                         <Ionicons name="arrow-back" size={24} color="#007AFF" />
                     </TouchableOpacity>}
                 title="ClimateTrack"
                 rightComponent={
                     <TouchableOpacity style={styles.backButton}>
                     </TouchableOpacity>}
             />

             <GiftedChat
                messages={messages}
                text={inputText} // Control the input text
                onInputTextChanged={setInputText} // Update the input text state
                onSend={onSend}
                user={{
                    _id: uid, // Use the logged-in user's ID from AuthContext
                }}
                isTyping={isLoading} // Correct prop for the typing indicator
                placeholder="Ask the chatbot..."
                alwaysShowSend // Show send button always
                renderBubble={(props: BubbleProps<IMessage>) => { // Custom bubble styling (optional)
                    return (
                        <Bubble
                            {...props}
                            wrapperStyle={{
                                right: { backgroundColor: '#007AFF' }, // User bubble color
                                left: { backgroundColor: '#E5E5EA' }, // Bot bubble color
                            }}
                            textStyle={{
                                right: { color: '#fff' },
                                left: { color: '#000' },
                            }}
                        />
                    );
                }}
                renderLoading={() => <ActivityIndicator style={styles.loadingIndicator} size="small" color="#007AFF"/>} // Loading indicator style
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
     header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Space items evenly
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        backgroundColor: '#F8F8F8', // Light background for header
    },
    backButton: {
         padding: 5,
         minWidth: 34, // Ensure consistent width
         alignItems: 'center',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#111',
    },
    loadingIndicator: {
        marginVertical: 10, // Give some space for loading indicator
    },
});
