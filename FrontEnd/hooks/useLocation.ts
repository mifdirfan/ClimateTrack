import { useState } from 'react';
import * as Location from 'expo-location';

export const useLocation = () => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const requestLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return null;
        }

        try {
            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);
            setErrorMsg(null);
            return currentLocation;
        } catch(error) {
            setErrorMsg('Could not fetch location.');
            console.error(error);
            return null;
        }
    };

    return { location, errorMsg, requestLocation };
};
