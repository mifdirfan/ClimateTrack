import React, { useEffect, useState, useCallback  } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert, RefreshControl, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { styles } from '../../constants/ProfilePageStyles';
import API_BASE_URL from '../../constants/ApiConfig';
import { useAuth } from '@/context/AuthContext';
import { Header } from '../../components/Header';
import { useRouter } from 'expo-router';


// Mock data based on your design
const userData = {
    id: '68dc0e2617ca703c528bbba7',
    username: 'testuser',
    email: 'testuser2@example.com',
    avatar: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/u2F1jVXr2j/q2x1g2nj_expires_30_days.png',
};

type UserProfile = {
    id: string;
    username: string;
    fullName: string;
    email: string;
};

type Report = {
    reportId: string;
    title: string;
    description: string;
    disasterType: string;
    postedByUsername: string;
    photoUrl?: string;
    latitude: number;
    longitude: number;
    // Backend sends Instant as a string (ISO 8601 format)
    reportedAt: string;

};

const settingsItems = [
    {
        id: '1',
        label: 'Privacy & Security',
        icon: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/u2F1jVXr2j/v8ynwpry_expires_30_days.png',
    },
    {
        id: '2',
        label: 'Notification Preference',
        icon: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/u2F1jVXr2j/oqmpfarw_expires_30_days.png',
    },
    {
        id: '3',
        label: 'Language',
        icon: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/u2F1jVXr2j/q2g4o5vh_expires_30_days.png',
    },
];

export default function ProfilePage() {

    const { token, username, isLoading, logout } = useAuth(); // Use the real auth state
    const router = useRouter();

    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // const fetchUserReports = () => {
    //     // FOR TESTING: Use the insecure endpoint to fetch reports by username directly.
    //     // In production, you would switch back to the secure '/my-reports' endpoint.
    //     const testUsername = userData.username;
    //     fetch(`${API_BASE_URL}/api/reports/user/${testUsername}`)
    //     // // In a real app, you would get this token from secure storage after login
    //     // // TODO: Replace this with a dynamic token from your auth context or secure storage
    //     // const authToken = "YOUR_JWT_TOKEN_HERE";
    //     //
    //     // fetch(`${API_BASE_URL}/api/reports/my-reports`, {
    //     //     headers: {
    //     //         'Authorization': `Bearer ${authToken}`
    //     //     }
    //     // })
    //         .then(res => {
    //             if (!res.ok) {
    //                 throw new Error('Failed to fetch reports');
    //             }
    //             return res.json();
    //         })
    //         .then((data: Report[]) => {
    //             // The backend already sorts by date, so we can use the data directly
    //             setReports(data);
    //         })
    //         .catch(err => {
    //             console.error('Failed to fetch user reports:', err);
    //             Alert.alert("Error", "Could not load your reports. Please try again later.");
    //         })
    //         .finally(() => {
    //             setLoading(false);
    //             setRefreshing(false);
    //         });
    // };

    const fetchData = useCallback(() => {
        if (!token || !username){
            setLoading(false); // Not logged in, so don't show a loader
            return;
        }

        setLoading(true);
        setError(null);

        // Fetch user profile information
        const fetchProfile = fetch(`${API_BASE_URL}/api/auth/${username}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => {
            if (!res.ok) throw new Error('Failed to fetch profile');
            return res.json();
        });

        // Fetch user's reports
        const fetchReports = fetch(`${API_BASE_URL}/api/reports/my-reports`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => {
            if (!res.ok) throw new Error('Failed to fetch reports');
            return res.json();
        });

        // Run both fetches in parallel
        Promise.all([fetchProfile, fetchReports])
            .then(([profileData, reportsData]) => {
                setUserProfile(profileData);
                setReports(reportsData);
            })
            .catch(err => setError(err.message || 'An unexpected error occurred.'))
            /*.catch(err =>  {
                console.error('Failed to fetch data:', err);
                Alert.alert("Error", "Could not load profile data. Please try again.");
            })*/
            .finally(() => {
                setLoading(false);
                setRefreshing(false);
            });
    }, [token, username]);

    useEffect(() => {
        if (!isLoading) {
            fetchData();
        }
    }, [isLoading, token, fetchData]);

    const onRefresh = () => {
        setRefreshing(true);
        // fetchUserReports();
        fetchData();
    };

    // Show a loading screen while checking authentication or fetching data
    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" style={{ flex: 1 }} />
            </SafeAreaView>
        );
    }

    if (!token) {
        return (
            <SafeAreaView style={styles.container}>
                <Header title="ClimateTrack" />
                <View style={styles.loginPromptContainer}>
                    <Text style={styles.loginPromptText}>Please log in to view your profile.</Text>
                    <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/screens/LoginScreen')}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="ClimateTrack"
                rightComponent={
                    <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                        <Ionicons name="log-out-outline" size={26} color="#d9534f" />
                    </TouchableOpacity>}
            />
            {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
            {error && <Text style={{ textAlign: 'center', color: 'red', marginTop: 20 }}>{error}</Text>}
            <ScrollView
                contentContainerStyle={styles.listContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* Profile Info */}
                <View style={styles.profileInfoContainer}>
                    <Image
                        source={{ uri: userData.avatar }}
                        resizeMode="cover"
                        style={styles.profileAvatar}
                    />
                    <View style={styles.profileTextContainer}>
                        <Text style={styles.profileName}>{userProfile?.fullName || 'User'}</Text>
                        <Text style={styles.profileLocation}>{userProfile?.username}</Text>
                        <Text style={styles.profileEmail}>{userProfile?.email}</Text>
                    </View>
                </View>

                {/* My Reports */}
                <Text style={styles.reportsHeader}>My Reports</Text>
                {loading ? (
                    <ActivityIndicator size="large" style={{ marginTop: 20 }} />
                ) : (
                    reports.length > 0 ? (
                        <FlatList
                            horizontal
                            data={reports}
                            keyExtractor={(item) => item.reportId}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.reportCard}>
                                    <Text style={styles.reportText} numberOfLines={2}>{item.title}</Text>
                                    {item.photoUrl && (
                                        <Image source={{ uri: item.photoUrl }} style={styles.reportImage} resizeMode="cover" />
                                    )}
                                </TouchableOpacity>
                            )}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.reportsContainer}
                        />
                    ) : (
                        <Text style={{ paddingHorizontal: 27, color: '#666' }}>No reports found.</Text>
                    )
                )}

                {/* Settings */}
                <View style={styles.settingsContainer}>
                    {settingsItems.map((item) => (
                        <TouchableOpacity key={item.id} style={styles.settingsItem} onPress={() => alert(`${item.label} pressed!`)}>
                            <Image
                                source={{ uri: item.icon }}
                                resizeMode="contain"
                                style={styles.settingsIcon}
                            />
                            <Text style={styles.settingsText}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/*/!* Footer *!/*/}
                {/*<Image*/}
                {/*    source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/u2F1jVXr2j/43inueb9_expires_30_days.png" }}*/}
                {/*    resizeMode="stretch"*/}
                {/*    style={styles.footerImage}*/}
                {/*/>*/}
            </ScrollView>
        </SafeAreaView>
    );
}