// utils/notifications.ts
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function getPushToken(): Promise<string | null> {
    if (!Device.isDevice) {
        console.warn('Push notifications are only available on physical devices or emulators.');
        return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        alert('Failed to get push token. Please enable notification permissions in your settings.');
        return null;
    }

    try {
        // This is the token you'll send to your backend
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log("Acquired Push Token:", token);
        return token;
    } catch (e) {
        console.error("Failed to get push token", e);
        return null;
    }
}