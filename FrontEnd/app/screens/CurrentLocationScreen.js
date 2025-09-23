import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function CurrentLocationScreen() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(true);
    const mapRef = useRef(null);

    useEffect(() => {
        let subscription;

        const startLocationTracking = async () => {
            // 1. Ask the user for location permission.
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                setLoading(false);
                return;
            }

            // 2. Get the user’s latitude and longitude in real time.
            subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 1000, // Update every second
                    distanceInterval: 1, // Update every meter
                },
                (newLocation) => {
                    const { latitude, longitude } = newLocation.coords;
                    const userLocation = {
                        latitude,
                        longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    };
                    setLocation(userLocation);
                    // 4. Update the marker if the user moves (by updating state).
                    if (mapRef.current) {
                        mapRef.current.animateToRegion(userLocation, 1000);
                    }
                    setLoading(false);
                }
            );
        };

        startLocationTracking();

        // Cleanup subscription on component unmount
        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, []);

    let content = <ActivityIndicator size="large" color="#0000ff" />;

    if (errorMsg) {
        content = <Text style={styles.errorText}>{errorMsg}</Text>;
    } else if (location) {
        // 3. Display the current location on the map.
        content = (
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={location}
                showsUserLocation={false} // We use a custom marker
            >
                <Marker
                    coordinate={location}
                    title="You are here"
                    description="Your current location"
                />
            </MapView>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Current Location</Text>
            {content}
            {location && (
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>Latitude: {location.latitude.toFixed(4)}</Text>
                    <Text style={styles.infoText}>Longitude: {location.longitude.toFixed(4)}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        padding: 20,
        paddingTop: 40,
    },
    map: {
        width: Dimensions.get('window').width,
        height: '70%',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
    infoBox: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    infoText: {
        fontSize: 16,
        textAlign: 'center'
    }
});
