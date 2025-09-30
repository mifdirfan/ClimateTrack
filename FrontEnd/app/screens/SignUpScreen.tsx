import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { styles } from '../../constants/signupStyles';

export default function SignUpScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity>
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
                        placeholder="Username"
                        placeholderTextColor="#888"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#888"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#888"
                        secureTextEntry
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        placeholderTextColor="#888"
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.button}>
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
                    <Text style={styles.bottomLink}>
                        Already have an account? <Text style={styles.link}>Login now!</Text>
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}