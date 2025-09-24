import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Switch,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function WritePostPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(true);

    const isPostButtonDisabled = !title.trim() || !content.trim();

    const handlePost = () => {
        if (isPostButtonDisabled) {
            Alert.alert("Empty Fields", "Please enter a title and content for your post.");
            return;
        }
        // TODO: Implement post submission logic here
        // This would typically involve making an API call to the backend
        console.log({
            title,
            content,
            isAnonymous,
        });
        Alert.alert("Post Submitted", "Your post has been submitted successfully.", [
            { text: "OK", onPress: () => router.back() }
        ]);
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
                        disabled={isPostButtonDisabled}
                    >
                        <Text style={[styles.doneText, isPostButtonDisabled && styles.doneTextDisabled]}>
                            Done
                        </Text>
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
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.footerButton}>
                        <Ionicons name="camera-outline" size={24} color="#888" />
                    </TouchableOpacity>
                    <View style={styles.anonymousContainer}>
                        <Text style={styles.anonymousText}>Anonymous</Text>
                        <Switch
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={isAnonymous ? '#f5dd4b' : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => setIsAnonymous(previousState => !previousState)}
                            value={isAnonymous}
                        />
                    </View>
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
    doneTextDisabled: {
        color: '#B0B0B0',
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
    anonymousContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    anonymousText: {
        marginRight: 8,
        fontSize: 16,
        color: '#555',
    },
});
