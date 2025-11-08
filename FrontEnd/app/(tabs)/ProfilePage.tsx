import React, { useEffect, useState, useCallback  } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl, FlatList, Modal, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons} from '@expo/vector-icons';
import { styles } from '@/constants/ProfilePageStyles';
import API_BASE_URL from '../../constants/ApiConfig';
import GOOGLE_MAPS_API_KEY from '../../constants/GoogleAPI'; // Import the API Key
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { useRouter } from 'expo-router';

type UserProfile = {
    id: string;
    username: string;
    fullName: string;
    email: string;
    // The avatar should be an optional string, which will be a URL from the backend.
    avatar?: string;
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
    locationName?: string; // Add optional field for reverse geocoded location

};

type SettingItem = {
    id: string;
    label: string;
    icon: number; // `require` returns a number (asset reference)
};

const settingsItems = [
    {
        id: '1',
        label: 'Ai Chatbot',
        icon: require('@/assets/images/chatbotIcon.png'),
    },
    {
        id: '2',
        label: 'Privacy & Security',
        icon: require('@/assets/images/privacySettingIcon.png'),
    },
    {
        id: '3',
        label: 'Notification Preference',
        icon: require('@/assets/images/notificationSettingIcon.png'),
    },
    {
        id: '4',
        label: 'Language',
        icon: require('@/assets/images/languageSettingIcon.png'),
    },
    {
        id: '5',
        label: 'Sign Out',
        icon: require('@/assets/images/signOutSettingIcon.png'),
    },
];

export default function ProfilePage() {

    const { token, username, isLoading, logout } = useAuth(); // Use the real auth state
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [selectedSetting, setSelectedSetting] = useState<SettingItem | null>(null);
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true); // State for the toggle
    const [error, setError] = useState<string | null>(null);
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

    // This effect runs whenever the `reports` state is updated.
    // It performs reverse geocoding for each report.
    useEffect(() => {
        // Find reports that don't have a locationName yet.
        const reportsToGeocode = reports.filter(report => !report.locationName);

        // If all reports already have a location, do nothing.
        if (reportsToGeocode.length === 0) return;

        const reverseGeocodeReports = async () => {
            const reportsWithLocation = await Promise.all(
                reports.map(async (report) => {
                    // If the report already has a name, or no coordinates, skip the API call.
                    if (report.locationName || !report.latitude || !report.longitude) {
                        return report;
                    }

                    try {
                        const response = await fetch(
                            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${report.latitude},${report.longitude}&key=${GOOGLE_MAPS_API_KEY}`
                        );
                        const data = await response.json();
                        if (data.status === 'OK' && data.results[0]) {
                            let addressParts = data.results[0].formatted_address.split(',');

                            // Clean the address: Check if the first part is a "plus code" (contains a '+')
                            if (addressParts.length > 1 && addressParts[0].includes('+')) {
                                const firstPart = addressParts[0];
                                // Find the first space after the plus code (e.g., "8F7C25+M5 Ipoh" -> " Ipoh")
                                const spaceAfterPlusCode = firstPart.indexOf(' ', firstPart.indexOf('+'));
                                if (spaceAfterPlusCode !== -1) {
                                    // Keep the part after the plus code (e.g., "Ipoh")
                                    addressParts[0] = firstPart.substring(spaceAfterPlusCode + 1).trim();
                                } else {
                                    // If it's just a plus code without a city, remove the whole part
                                    addressParts.shift();
                                }
                            }

                            // Join the first two remaining parts and trim whitespace for a clean look.
                            const cleanedLocation = addressParts.slice(0, 2).map((part: string) => part.trim()).filter(Boolean).join(', ');
                            return { ...report, locationName: cleanedLocation };
                        }
                    } catch (err) {
                        console.error("Reverse geocoding failed:", err);
                    }
                    // If geocoding fails, return the original report without a location name.
                    return report;
                })
            );
            setReports(reportsWithLocation);
        };

        reverseGeocodeReports();
    }, [reports]); // Rerun this effect if the reports array itself changes.

    const handleDeleteReport = async (reportId: string) => {
        if (!token) {
            Alert.alert("Error", "You must be logged in to delete a report.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                // On successful deletion, remove the report from the local state
                setReports(prevReports => prevReports.filter(report => report.reportId !== reportId));
                setSelectedReport(null); // Close the modal
                Alert.alert("Success", "Report deleted successfully.");
            } else {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to delete the report.');
            }
        } catch (err: any) {
            console.error("Delete report failed:", err);
            Alert.alert("Error", err.message || "An error occurred while deleting the report.");
        }
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
            {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
            {error && <Text style={{ textAlign: 'center', color: 'red', marginTop: 20 }}>{error}</Text>}
            <Header title="ClimateTrack"/>

            <ScrollView
                contentContainerStyle={styles.listContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* Profile Info */}
                <View style={styles.profileInfoContainer}>
                    <Image
                        // Use the avatar URL from the profile, or a local default image as a fallback.
                        source={userProfile?.avatar ? { uri: userProfile.avatar } : require('../../assets/images/defaultAvatar.jpg')}
                        resizeMode="cover"
                        style={styles.profileAvatar}
                    />
                    <View style={styles.profileTextContainer}>
                        <Text style={styles.profileUsername}>{userProfile?.username || 'Guest'}</Text>
                        <Text style={styles.profileFullName}>{userProfile?.fullName}</Text>
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
                            data={reports} // The data now includes locationName
                            keyExtractor={(item) => item.reportId}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.reportCard}
                                    onPress={() => setSelectedReport(item)}
                                >
                                    <Text style={styles.reportTitle} numberOfLines={1}>{item.title}</Text>
                                    {item.locationName && (
                                        <Text style={styles.reportLocation} numberOfLines={1}>{item.locationName}</Text>
                                    )}
                                    <Text style={styles.reportDate} >{new Date(item.reportedAt).toLocaleDateString()}</Text>
                                    {/* Always render the Image. Let the `source` prop handle the fallback. */}
                                    <Image
                                        source={item.photoUrl ? { uri: item.photoUrl } : require('../../assets/images/defaultReportPhoto.png')}
                                        style={styles.reportImage}
                                        resizeMode="cover" />
                                </TouchableOpacity>
                            )}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.reportsContainer}
                        />
                    ) : (
                        <Text style={{ color: '#666', height: 180, textAlign: 'center', paddingTop: 80 }}>You have no report.</Text>
                    )
                )}

                {/* Settings */}
                <View style={styles.settingsContainer}>
                    {settingsItems.map((item: SettingItem) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.settingsItem}
                            onPress={() => {
                                if (item.id === '1') { router.push('/screens/ChatbotScreen'); } // Navigate to ChatbotScreen for 'Ai Chatbot'
                                else if (item.id === '5') { Alert.alert(
                                    "Sign Out",
                                    "Are you sure you want to sign out?",
                                    [ { text: "Cancel", style: "cancel" }, { text: "Sign out", style: "destructive", onPress: logout }]
                                )}
                                else { setSelectedSetting(item); } // For other settings, open the modal
                            }}>
                            <Image
                                source={item.icon}
                                resizeMode="contain"
                                style={styles.settingsIcon}
                            />
                            <Text style={styles.settingsText}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Report Detail Modal */}
            {selectedReport && (
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={!!selectedReport}
                    onRequestClose={() => setSelectedReport(null)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            {/* Always render the Image. Let the `source` prop handle the fallback. */}
                            <Image
                                source={selectedReport.photoUrl ? { uri: selectedReport.photoUrl } : require('../../assets/images/defaultReportPhoto.png')}
                                style={styles.modalImage}
                                resizeMode="cover" />
                            <Text style={styles.modalTitle}>{selectedReport.title}</Text>
                            <Text style={styles.modalMeta}>{`${selectedReport.disasterType} • ${new Date(selectedReport.reportedAt).toLocaleDateString()}`}</Text>
                            <ScrollView>
                                <Text numberOfLines={100} style={styles.modalDescription}>{selectedReport.description}</Text>
                            </ScrollView>
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity style={styles.modalCloseButton} onPress={() => setSelectedReport(null)}>
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.deleteReportButton}
                                    onPress={() => Alert.alert(
                                        "Delete Report",
                                        "Are you sure you want to delete this report? This action cannot be undone.",
                                        [ { text: "Cancel", style: "cancel" }, { text: "Delete", style: "destructive", onPress: () => handleDeleteReport(selectedReport.reportId) } ]
                                    )}>
                                    <Text style={styles.deleteReportButtonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}

            {/* Settings Detail Modal */}
            {selectedSetting && (
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={!!selectedSetting}
                    onRequestClose={() => setSelectedSetting(null)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{selectedSetting.id === '5' ? 'Sign out from your account?' : selectedSetting.label }</Text>

                            {/* Conditionally render content based on selected setting */}
                            {selectedSetting.id === '2' ? (
                                <ScrollView>
                                    <Text style={styles.modalSectionTitle}>Data Collection</Text>
                                    <Text style={styles.modalParagraph}>
                                        ClimateTrack collects information you provide directly to us, such as when you create an account or submit a report. This includes your username, email, and any photos or descriptions you upload. We also collect location data to map reports accurately.
                                    </Text>
                                    <Text style={styles.modalSectionTitle}>Data Usage</Text>
                                    <Text style={styles.modalParagraph}>
                                        Your data is used to operate, maintain, and improve our services. Location data and reports are shared publicly on the map to inform the community about potential climate-related events. Your personal information, like your email, is never shared publicly.
                                    </Text>
                                    <Text style={styles.modalSectionTitle}>Your Rights</Text>
                                    <Text style={styles.modalParagraph}>
                                        You have the right to access and delete your account and associated data at any time. For more information, please contact our support team.
                                    </Text>
                                </ScrollView>
                            ) : selectedSetting.id === '3' ? (
                                <View style={styles.settingOptionRow}>
                                    <Text style={styles.settingOptionText}>App Notifications</Text>
                                    <Switch
                                        trackColor={{ false: "#E9E9EA", true: "#34C759" }}
                                        thumbColor={isNotificationsEnabled ? "#FFFFFF" : "#F4F3F4"}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={setIsNotificationsEnabled}
                                        value={isNotificationsEnabled}
                                    />
                                </View>
                            ) : (
                                <Text style={{ marginVertical: 20, textAlign: 'left', color: '#666' }}>
                                    More options for {selectedSetting.label} will be available soon.
                                </Text>
                            )}

                            <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedSetting(null)}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    );
}