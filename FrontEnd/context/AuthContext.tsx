import React, { createContext, useState, useContext, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

interface AuthContextType {
    token: string | null;
    username: string | null;
    login: (token: string, username: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);

    const login = async (newToken: string, newUsername: string) => {
        setToken(newToken);
        setUsername(newUsername);
        await SecureStore.setItemAsync('userToken', newToken);
        await SecureStore.setItemAsync('username', newUsername);
    };

    const logout = async () => {
        setToken(null);
        setUsername(null);
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('username');
    };

    return (
        <AuthContext.Provider value={{ token, username, login, logout, isAuthenticated: !!token }}>
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
