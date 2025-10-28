import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import API_BASE_URL from '@/constants/ApiConfig';

// Define the User type
export type User = {
    uid: string;
    email: string;
};

// The shape of the user data returned from your login API
export type AuthData = {
    token: string;
    user: User;
    // You can add other user properties here if needed, like id, fullName, etc.
};

// Define the shape of the context value
interface AuthContextType {
    token: string | null;
    user: User | null;
    isLoading: boolean; // Add a loading state
    login: (data: AuthData) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); // To handle initial auth check

    // This effect runs once when the app starts to check for a saved session
    useEffect(() => {
        const loadAuthState = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync('userToken');
                const storedUser = await SecureStore.getItemAsync('user');

                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                }
            } catch (e) {
                console.error("Failed to load auth state from secure store.", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadAuthState();
    }, []);

    const login = async (data: AuthData) => {
        setToken(data.token);
        setUser(data.user);
        await SecureStore.setItemAsync('userToken', data.token);
        await SecureStore.setItemAsync('user', JSON.stringify(data.user));
    };

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
        setUser(null);
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('user');
        router.replace('/');
    };

    return (
        <AuthContext.Provider value={{ token, user, isLoading, login, logout, isAuthenticated: !!token }}>
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