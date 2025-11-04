import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import API_BASE_URL from '@/constants/ApiConfig';

// Define the User type
export type User = {
    uid: string; // Changed from id to uid
    username: string;
    email: string;
    fullName: string;
};

// --- UPDATED AuthData Type ---
// Make AuthData match the backend's AuthResponseDto structure BUT use uid
export type AuthData = {
    token: string;
    id: string; // Keep 'id' here as it comes from backend response DTO
    username: string;
    email: string;
    fullName: string;
};

// Define the shape of the context value
interface AuthContextType {
    token: string | null;
    user: User | null; // Keep the user object containing uid, username, etc.
    username: string | null; // Also expose username directly
    uid: string | null; // Expose uid directly (changed from id)
    isLoading: boolean;
    login: (data: AuthData) => Promise<void>; // login still expects AuthData shape from API
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const TOKEN_KEY = 'userToken';
const USER_KEY = 'user'; // Store the whole user object as JSON

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null); // State holds the User object (with uid)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadAuthState = async () => {
            try {
                const [storedToken, storedUserJson] = await Promise.all([
                    SecureStore.getItemAsync(TOKEN_KEY),
                    SecureStore.getItemAsync(USER_KEY)
                ]);

                if (storedToken && storedUserJson) {
                    setToken(storedToken);
                    const storedUser: User = JSON.parse(storedUserJson); // Expecting User type (with uid)
                    setUser(storedUser);
                } else {
                    setToken(null);
                    setUser(null);
                    await SecureStore.deleteItemAsync(TOKEN_KEY);
                    await SecureStore.deleteItemAsync(USER_KEY);
                }
            } catch (e) {
                console.error("Failed to load auth state from secure store.", e);
                setToken(null);
                setUser(null);
                await SecureStore.deleteItemAsync(TOKEN_KEY);
                await SecureStore.deleteItemAsync(USER_KEY);
            } finally {
                setIsLoading(false);
            }
        };
        loadAuthState();
    }, []);

    const login = async (data: AuthData) => {
        // Create the User object (with uid) from the AuthData (which has id)
        const userData: User = {
            uid: data.id, // Map backend 'id' to frontend 'uid'
            username: data.username,
            email: data.email,
            fullName: data.fullName,
        };
        setToken(data.token);
        setUser(userData); // Set the full user object (with uid) in state
        await Promise.all([
            SecureStore.setItemAsync(TOKEN_KEY, data.token),
            SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData)) // Store user object (with uid)
        ]);
    };

    const logout = async () => {
        const currentToken = token; // Store token before clearing state
        // Clear state first
        setToken(null);
        setUser(null);

        // Clear storage in parallel
        await Promise.all([
            SecureStore.deleteItemAsync(TOKEN_KEY),
            SecureStore.deleteItemAsync(USER_KEY) // Clear stored user object
        ]);

        // Attempt backend logout
        if (currentToken) {
            try {
                await fetch(`${API_BASE_URL}/api/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${currentToken}`
                    }
                });
            } catch (e) {
                console.error("Failed to communicate with logout endpoint.", e);
            }
        }

        router.replace('/');
    };

    // Provide uid instead of id
    return (
        <AuthContext.Provider value={{
            token,
            user, // Provide the full user object (with uid)
            username: user?.username ?? null, // Provide username directly
            uid: user?.uid ?? null, // Provide uid directly
            isLoading,
            login,
            logout,
            isAuthenticated: !!token
        }}>
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