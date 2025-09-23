import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

export function useNotifications() {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState<Notifications.Notification | false>(false);
    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            if (token) {
                setExpoPushToken(token);
                // You can now send this token to your backend
                console.log('Expo Push Token:', token);

                // Example: sending token to backend
                // Make sure to replace <YOUR_BACKEND_IP> and have a user context
                // This is a simplified example. You'd likely do this after a user logs in.
                const username = "testuser"; // Replace with actual logged-in username
                fetch(`http://172.16.114.146:8080/api/auth/location/${username}`, { // Using the existing location endpoint to update the token
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        latitude: 0, // You might want to send actual location data here
                        longitude: 0,
                        fcmToken: token
                    }),
                })
                    .then(response => response.text())
                    .then(data => console.log('Token sent to backend:', data))
                    .catch(err => console.error('Failed to send token to backend:', err));

            }
        });

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            if(notificationListener.current) {
                Notifications.removeNotificationSubscription(notificationListener.current);
            }
            if(responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, []);

    return { expoPushToken, notification };
}


// --- Helper Function ---

async function registerForPushNotificationsAsync() {
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
        // Learn more about projectId: https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
        // This is where the projectId from app.json is used.
        try {
            const projectId = Constants.expoConfig?.extra?.eas?.projectId;
            if (!projectId) {
                throw new Error("Expo project ID not found in app.json. Please run 'npx eas project:init'");
            }
            token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        } catch (e) {
            console.error("Error getting push token:", e);
        }
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}

