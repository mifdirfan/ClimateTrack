import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import API_BASE_URL from '@/constants/ApiConfig';

// Define the shape of the context value
interface AuthContextType {
    token: string | null;
    username: string | null;
    isLoading: boolean; // Add a loading state
    login: (token: string, username: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // To handle initial auth check

    // This effect runs once when the app starts to check for a saved session
    useEffect(() => {
        const loadAuthState = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync('userToken');
                const storedUsername = await SecureStore.getItemAsync('username');

                if (storedToken && storedUsername) {
                    setToken(storedToken);
                    setUsername(storedUsername);
                }
            } catch (e) {
                console.error("Failed to load auth state from secure store.", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadAuthState();
    }, []);

    const login = async (newToken: string, newUsername: string) => {
        setToken(newToken);
        setUsername(newUsername);
        await SecureStore.setItemAsync('userToken', newToken);
        await SecureStore.setItemAsync('username', newUsername);
    };

    // const logout = async () => {
    //     setToken(null);
    //     setUsername(null);
    //     await SecureStore.deleteItemAsync('userToken');
    //     await SecureStore.deleteItemAsync('username');
    //     router.replace('/'); // Navigate to home screen after logout
    // };

    const logout = async () => {
        if (token) {
            try {
                // Call the backend to invalidate the token
                await fetch(`${API_BASE_URL}/api/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (e) {
                console.error("Failed to communicate with logout endpoint.", e);
            }
        }

        // Clear local state and storage regardless of API call success
        setToken(null);
        setUsername(null);
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('username');
        router.replace('/');
    };

    return (
        <AuthContext.Provider value={{ token, username, isLoading, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};