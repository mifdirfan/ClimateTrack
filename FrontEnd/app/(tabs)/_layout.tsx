import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        // Use a transparent background on iOS to show the blur effect
                        position: 'absolute',
                    },
                    default: {},
                }),
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                }}
            />
            <Tabs.Screen
                name="CommunityPage"
                options={{
                    title: 'Community',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.3.fill" color={color} />,
                }}
            />
            <Tabs.Screen
                name="ReportPage"
                options={{
                    title: 'Report',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
                }}
            />
            <Tabs.Screen
                name="NewsFeedPage"
                options={{
                    title: 'News Feed',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="newspaper.fill" color={color} />,
                }}
            />
            <Tabs.Screen
                name="ProfilePage"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
                }}
            />
        </Tabs>
    );
}


// import { Tabs } from 'expo-router';
// import React from 'react';
//
// // This is the layout for the tabs ONLY.
// export default function TabLayout() {
//     return (
//         <Tabs>
//             <Tabs.Screen name="index" options={{ title: 'Home' }} />
//             <Tabs.Screen name="CommunityPage" options={{ title: 'Community' }} />
//             <Tabs.Screen name="NewsFeedPage" options={{ title: 'News' }} />
//             <Tabs.Screen name="ReportPage" options={{ title: 'Report' }} />
//             <Tabs.Screen name="ProfilePage" options={{ title: 'Profile' }} />
//         </Tabs>
//     );
// }