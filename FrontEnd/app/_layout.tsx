import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext'; // Import your AuthProvider
import * as Notifications from 'expo-notifications'; // Import expo-notifications
import { useEffect, useRef } from 'react'; // Import hooks
import { Platform } from 'react-native'; // Import Platform
import { useRouter } from 'expo-router'; // Import useRouter

// --- Notification Handler (Set once when the app loads) ---
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,    // Show alert banner when notification arrives while app is open
        shouldPlaySound: true,    // Play sound
        shouldSetBadge: false,   // Don't modify the badge count
        // --- ADD THESE LINES based on the TS error ---
        shouldShowBanner: true, // Explicitly show banner (often same as shouldShowAlert)
        shouldShowList: true,   // Show in notification list (Android primarily)
        // You might need to adjust these based on exact library version/behavior,
        // but adding them should satisfy the type checker.
    }),
});
// --- End Notification Handler ---

// This is the root layout for the ENTIRE app.
export default function RootLayout() {
    const router = useRouter(); // Initialize router for potential navigation

    // --- Notification Listeners ---
    const notificationListener = useRef<Notifications.Subscription | null>(null);
    const responseListener = useRef<Notifications.Subscription | null>(null);

    useEffect(() => {
        // Listener for when a notification is received while the app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log('Notification Received (foreground):', notification);
            // Optional: You could add logic here, like showing an in-app message
        });

        // Listener for when a user taps or interacts with a notification
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('Notification Response Received (tapped):', response);
            // Optional: Navigate based on notification data
            // Example: Check if the notification has data and a screen target
            // const data = response.notification.request.content.data;
            // if (data && data.screen) {
            //   router.push(data.screen as any); // Navigate to the screen specified in the notification
            // }
        });

        // Cleanup function to remove listeners when the component unmounts
        return () => {
            if (notificationListener.current) {
                // Notifications.removeNotificationSubscription(notificationListener.current!); // Incorrect
                notificationListener.current.remove(); // Correct
            }
            if (responseListener.current) {
                // Notifications.removeNotificationSubscription(responseListener.current!); // Incorrect
                responseListener.current.remove(); // Correct
            }
        };
    }, []); // Empty dependency array ensures this runs only once on mount
    // --- End Notification Listeners ---

    return (
        // AuthProvider wraps everything, making auth state available everywhere.
        <AuthProvider>
            <Stack>
                {/* This screen represents your main app with the tab bar. */}
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

                {/* These are your login/signup screens. */}
                <Stack.Screen name="screens/LoginScreen" options={{ presentation: 'modal', headerShown: false }} />
                <Stack.Screen name="screens/SignUpScreen" options={{ presentation: 'modal', headerShown: false }} />
                <Stack.Screen name="screens/PostPage" options={{ headerShown: false }} />
                <Stack.Screen name="screens/WritePostPage" options={{ headerShown: false }} />
                <Stack.Screen name="screens/ChatbotScreen" options={{ headerShown: false }} />
            </Stack>
        </AuthProvider>
    );
}