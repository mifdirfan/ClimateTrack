import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { styles } from '@/constants/loginStyles';
import { useAuth } from '@/context/AuthContext';
import API_BASE_URL from '@/constants/ApiConfig';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleGoBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            // If it can't go back, maybe navigate to the home screen
            router.replace('/(tabs)');
        }
    };

    const handleLogin = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: email, password: password }),
            });

            if (response.ok) {
                const data = await response.json();
                login(data.token, data.username); // Assuming username is email
                router.replace('/(tabs)');
            } else {
                Alert.alert("Login Failed", "Invalid username or password.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Login Error", "An error occurred during login.");
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleGoBack}>
                        <Ionicons name="chevron-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>ClimateTrack</Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.content}>
                    <Text style={styles.welcomeText}>Welcome back!</Text>
                    <Text style={styles.subText}>Glad to see you again.</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#888"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#888"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity style={styles.forgotPasswordContainer}>
                        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>

                    <View style={styles.separatorContainer}>
                        <View style={styles.separatorLine} />
                        <Text style={styles.separatorText}>Or Login with</Text>
                        <View style={styles.separatorLine} />
                    </View>

                    <TouchableOpacity
                        style={styles.googleButton}
                        onPress={() => console.log('Continue with Google pressed')}
                    >
                        <FontAwesome name="google" size={20} color="#000" />
                        <Text style={styles.googleButtonText}>Continue with Google</Text>
                    </TouchableOpacity>

                    <Text style={styles.disclaimerText}>
                        By clicking continue, you agree to our{' '}
                        <Text style={styles.link}>Terms of Service</Text> and{' '}
                        <Text style={styles.link}>Privacy Policy</Text>
                    </Text>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity onPress={() => router.push('/screens/SignUpScreen')}>
                        <Text style={styles.bottomLink}>
                            Dont have an account? <Text style={styles.link}>Register now!</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
