import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { styles } from '../../constants/ProfilePageStyles';
import API_BASE_URL from '../../constants/ApiConfig';


// Mock data based on your design
const userData = {
    id: '68d2aa19d4b231ff3685ee9e',
    username: 'testuser',
    location: 'Kuala Lumpur, Malaysia',
    avatar: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/u2F1jVXr2j/q2x1g2nj_expires_30_days.png',
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
    reportedAt: Date;

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

    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, you would get this token from secure storage after login
        const authToken = "YOUR_JWT_TOKEN_HERE";

        fetch(`${API_BASE_URL}/api/reports/my-reports`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch reports');
                }
                return res.json();
            })
            .then(data => {
                setReports(data);
            })
            .catch(err => {
                console.error('Failed to fetch user reports:', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.container} contentContainerStyle={styles.listContainer}>
                {/* Header */}
                <Image
                    source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/u2F1jVXr2j/0v5zlit6_expires_30_days.png" }}
                    resizeMode="stretch"
                    style={styles.headerImage}
                />
                <View style={styles.headerRow}>
                    <Ionicons name="menu" size={24} color="black" />
                    <Text style={styles.headerTitle}>ClimateTrack</Text>
                    <Ionicons name="notifications-outline" size={24} color="black" />
                </View>

                {/* Profile Info */}
                <View style={styles.profileInfoContainer}>
                    <Image
                        source={{ uri: userData.avatar }}
                        resizeMode="cover"
                        style={styles.profileAvatar}
                    />
                    <View style={styles.profileTextContainer}>
                        <Text style={styles.profileName}>{userData.username}</Text>
                        <Text style={styles.profileLocation}>{userData.location}</Text>
                    </View>
                </View>

                {/* My Reports */}
                <Text style={styles.reportsHeader}>My Reports</Text>
                {loading ? (
                    <ActivityIndicator size="large" style={{ marginTop: 20 }} />
                ) : (
                    <View style={styles.reportsContainer}>
                        {reports.length > 0 ? (
                            reports.map((report, index) => (
                                <TouchableOpacity
                                    key={report.reportId}
                                    style={[styles.reportCard, index > 0 && { marginLeft: 12 }]}
                                >
                                    <Text style={styles.reportText} numberOfLines={2}>{report.title}</Text>
                                    {report.photoUrl && (
                                        <Image source={{ uri: report.photoUrl }} style={styles.reportImage} resizeMode="cover" />
                                    )}
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={{ paddingHorizontal: 27, color: '#666' }}>No reports found.</Text>
                        )}
                    </View>
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