import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { styles } from '@/constants/signupStyles';
import API_BASE_URL from '@/constants/ApiConfig';
import { useRouter } from 'expo-router';
import { AuthData, useAuth } from '@/context/AuthContext';

export default function SignUpScreen() {
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();
    const { login } = useAuth();

    const handleGoBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            // If it can't go back, maybe navigate to the home screen
            router.replace('/(tabs)');
        }
    };

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Passwords don't match");
            return;
        }
        try {
            // Step 1: Register the user
            const signupResponse = await fetch(`${API_BASE_URL}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                    fullName: fullname, // or add another field for full name
                }),
            });

            if (signupResponse.ok) {
                // Step 2: Automatically log the user in by calling the login API
                const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                if (loginResponse.ok) {
                    const loginData: AuthData = await loginResponse.json();

                    // Step 3: Store the token and user data in the context
                    await login(loginData);

                    // Step 4: Navigate to the main app screen
                    Alert.alert("Success", "You have been registered and logged in successfully!");
                    router.replace('/(tabs)');
                } else {
                    // This case is unlikely but good to have.
                    // If registration succeeds but auto-login fails, send them to the login screen.
                    Alert.alert("Registration Successful", "Please log in to continue.");
                    router.replace('/screens/LoginScreen');
                }
            } else {
                const message = await signupResponse.text();
                Alert.alert("Registration Failed", message);
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Registration Error", "An error occurred during registration.");
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
                    <Text style={styles.welcomeText}>Hi!</Text>
                    <Text style={styles.subText}>Register to get started.</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        placeholderTextColor="#888"
                        autoCapitalize="none"
                        value={fullname}
                        onChangeText={setFullname}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        placeholderTextColor="#888"
                        autoCapitalize="none"
                        value={username}
                        onChangeText={setUsername}
                    />
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
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        placeholderTextColor="#888"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>

                    <View style={styles.separatorContainer}>
                        <View style={styles.separatorLine} />
                        <Text style={styles.separatorText}>Or register with</Text>
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
                    <TouchableOpacity onPress={() => router.push('/screens/LoginScreen')}>
                        <Text style={styles.bottomLink}>
                            Already have an account? <Text style={styles.link}>Login now!</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
