// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import 'react-native-reanimated';
// import { AuthProvider } from '@/context/AuthContext'; // Import your AuthProvider
//
//
// import { useColorScheme } from '@/hooks/useColorScheme';
//
// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
//   });
//
//   if (!loaded) {
//     // Async font loading only occurs in development.
//     return null;
//   }
//
//   return (
//       <AuthProvider>
//           <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//               <Stack>
//                   {/* This screen entry represents your entire tab navigator. */}
//                   <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//
//                   {/* These are your modal screens for login/signup. */}
//                   <Stack.Screen name="screens/LoginScreen" options={{ presentation: 'modal', headerShown: false }} />
//                   <Stack.Screen name="screens/SignUpScreen" options={{ presentation: 'modal', headerShown: false }} />
//               </Stack>
//               <StatusBar style="auto" />
//           </ThemeProvider>
//       </AuthProvider>
//   );
// }

import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext'; // Import your AuthProvider

// This is the root layout for the ENTIRE app.
export default function RootLayout() {
    return (
        // AuthProvider wraps everything, making auth state available everywhere.
        <AuthProvider>
            <Stack>
                {/* This screen represents your main app with the tab bar. */}
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

                {/* These are your login/signup screens. */}
                <Stack.Screen name="screens/LoginScreen" options={{ presentation: 'modal', headerShown: false }} />
                <Stack.Screen name="screens/SignUpScreen" options={{ presentation: 'modal', headerShown: false }} />
            </Stack>
        </AuthProvider>
    );
}
