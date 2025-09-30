import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import API_BASE_URL from '@/constants/ApiConfig';

// This handler determines how your app handles notifications when it's active
Notifications.setNotificationHandler({
    handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: false,
        shouldShowList: false
    }),
});

export function useNotifications() {
    const { username } = useAuth(); // Get username from AuthContext
    const [expoPushToken, setExpoPushToken] = useState<string | undefined>('');
    const [notification, setNotification] = useState<Notifications.Notification | false>(false);
    // @ts-ignore
    const notificationListener = useRef<Notifications.Subscription>();
    // @ts-ignore
    const responseListener = useRef<Notifications.Subscription>();

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            setExpoPushToken(token);
            if (token && username) {
                console.log('Expo Push Token:', token);

                fetch(`${API_BASE_URL}/api/auth/update-fcm-token/${username}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        fcmToken: token,
                    }),
                }).catch(err => console.error("Failed to send FCM token to backend:", err));
            }
        });

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            notificationListener.current?.remove();
            responseListener.current?.remove();
        };
    }, [username]); // Rerun when username changes

    return { expoPushToken, notification };
}


async function registerForPushNotificationsAsync(): Promise<string | undefined> {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }

        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        if (!projectId) {
            console.error('Expo project ID not found in app.json. Please run "npx expo login" and "npx eas project:init".');
            return;
        }

        try {
            token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        } catch (e) {
            console.error("Error getting push token:", e);
        }
    } else {
        // alert('Must use physical device for Push Notifications');
        console.log('Must use physical device for Push Notifications');
    }

    return token;
}

