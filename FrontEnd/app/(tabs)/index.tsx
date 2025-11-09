import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, TextInput, Alert } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router'; // 1. Import useFocusEffect
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import GoogleMapWeb from "@/components/GoogleMap";
import { useLocation } from '@/hooks/useLocation';
import homepageStyles from '../../constants/homepageStyles';
import { Header } from '@/components/Header';
import API_BASE_URL from '../../constants/ApiConfig';
import GOOGLE_MAPS_API_KEY from '../../constants/GoogleAPI';
import { getPushToken } from '@/components/notifications'; // 1. Import your new function

// Type definitions
type Disaster = {
    disasterId: string;
    disasterType: string;
    description: string;
    locationName: string;
    latitude: number;
    longitude: number;
    source: string;
    reportedAt: string;
};


type UserLocation = {
    latitude: number;
    longitude: number;
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

export default function Index() {
    const [searchQuery, setSearchQuery] = useState('');
    //const [selectedType, setSelectedType] = useState<string | null>(null);
    const [disasters, setDisasters] = useState<Disaster[]>([]);
    const [searchedLocation, setSearchedLocation] = useState<UserLocation | null>(null);
    //const [disasterLoading, setDisasterLoading] = useState(true);
    const [disasterError, setDisasterError] = useState<string | null>(null);
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
    const [reports, setReports] = useState<Report[]>([]); // NEW: State for user reports
    const [dataLoading, setDataLoading] = useState(true);
    const [showDisasters, setShowDisasters] = useState(true);
    const [showReports, setShowReports] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [centerOnUser, setCenterOnUser] = useState(true); // NEW: State to control map centering
    const { token, username, isLoading } = useAuth();
    // placeholder for testing:
    // const { token, username } = { token: "your_jwt_token", username: "testuser" }; // Replace with your real auth state
    const { requestLocation, errorMsg } = useLocation();

    const sendLocationToBackend = useCallback(async (location: { coords: { latitude: number; longitude: number; } }) => {
        // Only proceed if we have a token and username
        if (!token || !username) {
            console.log("User is not logged in. Skipping location update.");
            return;
        }

        console.log(`Sending location for logged-in user: ${username}`);
        try {
            // Note: getPushToken will only work in a development build
            const fcmToken = await getPushToken();

            await fetch(`${API_BASE_URL}/api/auth/location/${username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    fcmToken: fcmToken
                }),
            });
            console.log('Logged-in user location and token updated');
        } catch (error) {
            console.error('Failed to send location for logged-in user:', error);
        }
    }, [token, username]); // Dependency array ensures this function updates when the user logs in/out

    const handleGetLocation = useCallback(async () => {
        const location = await requestLocation();
        // Fetch location and data in parallel for a faster experience
        if (!location) {
            if (errorMsg) alert(errorMsg);
            return;
        }

        setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        });
        setCenterOnUser(true); // Tell the map to center on the user

        if (token && username) {
            await sendLocationToBackend(location);
        }
    }, [requestLocation, errorMsg, sendLocationToBackend, token, username]);

    const handleGetLocationAndData = useCallback(async () => {
        await Promise.all([handleGetLocation(), fetchData()]);
    }, [handleGetLocation]);

    const handleSearch = useCallback(async () => {
        if (!searchQuery.trim()) {
            return; // Don't search if the input is empty
        }

        const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchQuery)}&key=${GOOGLE_MAPS_API_KEY}`;

        try {
            const response = await fetch(geocodingUrl);
            const data = await response.json();

            if (data.status === 'OK' && data.results.length > 0) {
                const { lat, lng } = data.results[0].geometry.location;
                // Set the searched location state, which will be used for the new marker
                setSearchedLocation({ latitude: lat, longitude: lng });
            } else {
                Alert.alert('Location Not Found', 'Could not find the specified location. Please try again.');
            }
        } catch (err) {
            console.error("Geocoding API error:", err);
            Alert.alert('Error', 'Failed to search for location.');
        }
    }, [searchQuery, GOOGLE_MAPS_API_KEY]);


    // Fetch disasters
    const fetchData = useCallback(async () => {
        // Don't set dataLoading here, it will be handled by the calling function

        console.log(`Attempting to fetch data from: ${API_BASE_URL}`);
        setDisasterError(null);
        try {
            const [disastersResponse, reportsResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/api/events`),
                fetch(`${API_BASE_URL}/api/reports`)
            ]);

            // --- NEW LOGGING (Checks the HTTP response) ---
            console.log(`Disasters response status: ${disastersResponse.status}`);
            console.log(`Reports response status: ${reportsResponse.status}`);

            if (!disastersResponse.ok || !reportsResponse.ok) {
                throw new Error('Failed to load map data.');
            }
            const [disastersData, reportsData] = await Promise.all([
                disastersResponse.json(),
                reportsResponse.json()
            ]);
            if (Array.isArray(disastersData)) setDisasters(disastersData);
            if (Array.isArray(reportsData)) setReports(reportsData);
        } catch (err: any) {

            // This will show us the exact network error
            console.error('An error occurred during fetch:', JSON.stringify(err, null, 2));
            setDisasterError(err.message || 'An unknown error occurred.');
        }
    }, []);

    // This effect runs when the screen comes into focus.
    // It's a more reliable way to handle initial data loading in a tab navigator.
    useFocusEffect(
        useCallback(() => {
            const initialLoad = async () => {
                // Only run if data hasn't been loaded yet to prevent re-fetching on every tab switch.
                if (disasters.length === 0 && reports.length === 0) {
                    setDataLoading(true);
                    await Promise.all([handleGetLocation(), fetchData()]);
                    setDataLoading(false);
                }
            };
            initialLoad();
        }, [handleGetLocation, fetchData, disasters.length, reports.length]) // Dependencies for the initial load logic
    );

    // This function is called when the user presses the refresh button
    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await Promise.all([
            fetchData()
            // Do NOT call handleGetLocation() here to prevent re-centering.
            // The user can manually re-center with the location button if needed.
        ]);
        setIsRefreshing(false);
    }, [fetchData]);

    if (isLoading) {
        // Show a loading screen while checking for a saved session
        return <ActivityIndicator size="large" />;
    }

    // Conditionally filter the data based on the toggle state
    const filteredDisasters = showDisasters ? disasters : [];
    const filteredReports = showReports ? reports : [];

    /*const filteredDisasters = selectedType
        ? disasters.filter(d => d.disasterType === selectedType)
        : disasters;*/

    return (
        <SafeAreaView style={homepageStyles.container}>
            <Header title="ClimateTrack" />

            <View style={styles.mapContainer}>
                {dataLoading ? (
                    <ActivityIndicator size="large" />
                ) : disasterError ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{disasterError}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
                            <Text style={styles.retryButtonText}>Refresh</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    // Pass both disasters and reports to the map
                    <GoogleMapWeb
                        disasters={filteredDisasters}
                        reports={filteredReports}
                        userLocation={userLocation} // This is always the user's actual location
                        searchedLocation={searchedLocation} // Pass the searched location separately
                        centerOnUser={centerOnUser} // Pass the centering flag
                        onMapCentered={() => setCenterOnUser(false)} // Callback to reset the flag
                    />
                )}
                {/* --- Reset User Location Button --- */}
                <TouchableOpacity style={styles.locationButton} onPress={handleGetLocationAndData}>
                    <MaterialIcons name="my-location" size={24} color="#fff" />
                </TouchableOpacity>
                {/* --- Refresh Button --- */}
                <TouchableOpacity style={styles.refreshButton} onPress={onRefresh} disabled={isRefreshing}>
                    {isRefreshing ? (
                        <ActivityIndicator color="#007AFF" />
                    ) : (
                        <MaterialIcons name="refresh" size={24} color="#fff" />
                    )}
                </TouchableOpacity>

                {/* Search Bar Overlay */}
                <View style={homepageStyles.searchBar}>
                    <TextInput
                        placeholder="Search for a location..."
                        placeholderTextColor="#888" // Add this line to set the color
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={homepageStyles.searchInput}
                        onSubmitEditing={handleSearch} // Trigger search on keyboard submit
                    />
                    <TouchableOpacity onPress={handleSearch}><FontAwesome5 name="search" size={18} color="#888" /></TouchableOpacity>
                </View>

                {/* Filter Buttons */}
                <View style={homepageStyles.filterContainer}>
                    <TouchableOpacity
                        style={[
                            homepageStyles.filterButton,
                            showDisasters ? homepageStyles.filterButtonDisasterActive : homepageStyles.filterButtonInactive
                        ]}
                        onPress={() => setShowDisasters(!showDisasters)}
                    >
                        <Text style={{ ...homepageStyles.filterButtonText, color: showDisasters ? '#FFF' : '#333' }}>
                            Disasters
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            homepageStyles.filterButton,
                            showReports ? homepageStyles.filterButtonReportActive : homepageStyles.filterButtonInactive
                        ]}
                        onPress={() => setShowReports(!showReports)}
                    >
                        <Text style={{ ...homepageStyles.filterButtonText, color: showReports ? '#FFF' : '#333' }}>
                            Reports
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mapContainer: {
        flex: 1,
        position: 'relative',
    },
    locationButton: {
        position: 'absolute',
        bottom: 70,
        left: 20,
        backgroundColor: '#000',
        borderRadius: 30,
        padding: 12,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 10,
    },
    // --- UPDATED STYLE FOR REFRESH BUTTON ---
    refreshButton: {
        position: 'absolute',
        bottom: 130, // Position it higher than the location button
        left: 20,   // Align it to the left side
        backgroundColor: '#000',
        borderRadius: 30,
        padding: 12,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 10,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8d7da',
    },
    errorText: {
        color: '#721c24',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    retryButton: {
        marginTop: 20,
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 20,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});