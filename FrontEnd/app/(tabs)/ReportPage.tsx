import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useLocation } from '@/hooks/useLocation';
import { styles } from '@/constants/ReportPageStyles';
import API_BASE_URL from '../../constants/ApiConfig';
import GOOGLE_MAPS_API_KEY from '../../constants/GoogleAPI';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

// Example list of districts. In a real app, you might fetch this from a server.
//const DISTRICTS = ['Bukit Bintang', 'Titiwangsa', 'Setiawangsa', 'Wangsa Maju', 'Batu', 'Cheras'];
const DISASTER_TYPES = ['Flood', 'Landslide', 'Earthquake', 'Wildfire', 'Other'];

export default function ReportPage() {
    const [title, setTitle] = useState('');
    const [disasterType, setDisasterType] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { requestLocation, errorMsg } = useLocation();
    //const [selectedDistrict, setSelectedDistrict] = useState('');

    const [locationInput, setLocationInput] = useState('');
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
    const [isGeocoding, setIsGeocoding] = useState(false);

    const { token, isLoading: isAuthLoading } = useAuth(); // Get the real auth state
    const router = useRouter();

    useEffect(() => {
        // If the initial auth check is done and there's no token, redirect
        if (!isAuthLoading && !token) {
            Alert.alert("Login Required", "You must be logged in to submit a report.");
            router.replace('/screens/LoginScreen');
        }
    }, [isAuthLoading, token, router]);

    const handleGeocode = async () => {
        if (!locationInput.trim()) {
            Alert.alert('Location Missing', 'Please enter a district or location name.');
            return;
        }

        setIsGeocoding(true);
        const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationInput)}&key=${GOOGLE_MAPS_API_KEY}`;

        try {
            const response = await fetch(geocodingUrl);
            const data = await response.json();

            if (data.status === 'OK' && data.results.length > 0) {
                const { lat, lng } = data.results[0].geometry.location;
                setCoordinates({ lat, lng });
                Alert.alert('Location Found', `Location set to: ${data.results[0].formatted_address}`);
            } else {
                Alert.alert('Location Not Found', 'Could not find coordinates for the entered location. Please try being more specific.');
                setCoordinates(null);
            }
        } catch (error) {
            Alert.alert('API Error', 'Failed to fetch location data.');
        } finally {
            setIsGeocoding(false);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!coordinates) {
            Alert.alert('Location Missing', 'Please select a district to set the report location.');
            return;
        }
        if (!title || !disasterType || !description) {
            Alert.alert('Missing Information', 'Please fill out the title, disaster type, and description.');
            return;
        }

        setIsSubmitting(true);

        // const location = await requestLocation();
        // if (!location) {
        //     Alert.alert('Location Error', errorMsg || 'Could not get your current location. Please enable location services.');
        //     setIsSubmitting(false);
        //     return;
        // }

        let photoKey: string | undefined = undefined;

        // --- Real Image Upload Logic ---
        if (image) {
            try {
                const filename = image.split('/').pop() || `report-image-${Date.now()}.jpg`;
                const filetype = 'image/jpeg';

                // 1. Get presigned URL from your backend
                const presignedUrlResponse = await fetch(`${API_BASE_URL}/api/upload/url?filename=${filename}&filetype=${filetype}`);
                if (!presignedUrlResponse.ok) throw new Error('Could not get upload URL.');
                const presignedUrl = await presignedUrlResponse.text();

                // 2. Upload image directly to S3
                const imageResponse = await fetch(image);
                const blob = await imageResponse.blob();
                const uploadResponse = await fetch(presignedUrl, {
                    method: 'PUT',
                    headers: { 'Content-Type': filetype },
                    body: blob,
                });

                if (!uploadResponse.ok) throw new Error('Failed to upload image to S3.');

                // 3. Set the photo key for the report
                photoKey = `uploads/${filename}`;

            } catch (uploadError: any) {
                Alert.alert('Image Upload Error', uploadError.message);
                setIsSubmitting(false);
                return;
            }
        }


        const reportData = {
            title,
            description,
            disasterType,
            // Use the coordinates from the geocoding result
            latitude: coordinates.lat,
            longitude: coordinates.lng,
            photoUrl: photoKey,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Use the real token from context
                },
                body: JSON.stringify(reportData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit report. Please try again.');
            }

            Alert.alert('Success', 'Your report has been submitted!');
            // Reset form
            setTitle('');
            setDisasterType('');
            setDescription('');
            setImage(null);

        } catch (error: any) {
            Alert.alert('Submission Error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show a loading screen while checking authentication status
    if (isAuthLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" style={{ flex: 1 }} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView  style={styles.scrollView}>
                <View style={styles.column}>
                    <View style={styles.row}>
                        <Image
                            source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/u2F1jVXr2j/vcgt9j65_expires_30_days.png"}}
                            resizeMode = {"stretch"}
                            style={styles.image2}
                        />
                        <Text style={styles.text}>
                            {"ClimateTrack"}
                        </Text>
                        <Image
                            source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/u2F1jVXr2j/bnolnahv_expires_30_days.png"}}
                            resizeMode = {"stretch"}
                            style={styles.image2}
                        />
                    </View>
                    <Text style={styles.text2}>
                        {"Report a Disaster"}
                    </Text>
                </View>
                <Text style={styles.text3}>
                    {"Title"}
                </Text>
                <TextInput
                    style={[localStyles.input, styles.box]}
                    placeholder="e.g., Flash Flood in Downtown"
                    value={title}
                    onChangeText={setTitle}
                />
                <Text style={styles.text4}>
                    {"Disaster Type"}
                </Text>
                <View style={localStyles.disasterTypeContainer}>
                    {DISASTER_TYPES.map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[
                                localStyles.disasterTypeButton,
                                disasterType === type && localStyles.disasterTypeButtonSelected,
                            ]}
                            onPress={() => setDisasterType(type)}
                        >
                            <Text style={[
                                localStyles.disasterTypeText,
                                disasterType === type && localStyles.disasterTypeTextSelected,
                            ]}>{type}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <Text style={styles.text5}>
                    {"Description"}
                </Text>
                <TextInput
                    style={[localStyles.input, localStyles.textArea, styles.box3]}
                    placeholder="Provide details about the situation..."
                    multiline
                    value={description}
                    onChangeText={setDescription}
                />
                {/* --- NEW Location Input UI --- */}
                <Text style={styles.text4}>Location</Text>
                <View style={styles.locationInputContainer}>
                    <TextInput
                        style={styles.locationInput}
                        placeholder="e.g., Bukit Bintang, Kuala Lumpur"
                        value={locationInput}
                        onChangeText={setLocationInput}
                    />
                    <TouchableOpacity style={styles.findButton} onPress={handleGeocode} disabled={isGeocoding}>
                        {isGeocoding ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.findButtonText}>Find</Text>
                        )}
                    </TouchableOpacity>
                </View>
                <Text style={styles.text5}>
                    {"Upload an Image"}
                </Text>
                <TouchableOpacity style={[styles.box4, localStyles.imagePicker]} onPress={pickImage}>
                    {image ? (
                        <Image source={{ uri: image }} style={localStyles.imagePreview} resizeMode="cover" />
                    ) : (
                        <Text style={localStyles.imagePickerText}>Tap to select an image</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[localStyles.submitButton, { opacity: isSubmitting ? 0.7 : 1 }]}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={localStyles.submitButtonText}>Submit Report</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
        // <SafeAreaView style={styles.container}>
        //     <ScrollView showsVerticalScrollIndicator={false}>
        //         <Text style={styles.title}>Report a Disaster</Text>
        //
        //         <Text style={styles.label}>Disaster Type</Text>
        //         <View style={styles.disasterTypeContainer}>
        //             {DISASTER_TYPES.map((type) => (
        //                 <TouchableOpacity
        //                     key={type}
        //                     style={[
        //                         styles.disasterTypeButton,
        //                         disasterType === type && styles.disasterTypeButtonSelected,
        //                     ]}
        //                     onPress={() => setDisasterType(type)}
        //                 >
        //                     <Text style={[
        //                         styles.disasterTypeText,
        //                         disasterType === type && styles.disasterTypeTextSelected,
        //                     ]}>{type}</Text>
        //                 </TouchableOpacity>
        //             ))}
        //         </View>
        //
        //         <Text style={styles.label}>Description</Text>
        //         <TextInput
        //             style={[styles.input, styles.textArea]}
        //             placeholder="Provide details about the situation..."
        //             multiline
        //             value={description}
        //             onChangeText={setDescription}
        //         />
        //
        //         <Text style={styles.label}>Add a Photo</Text>
        //         <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        //             {image ? (
        //                 <Image source={{ uri: image }} style={styles.imagePreview} resizeMode="cover" />
        //             ) : (
        //                 <Text style={styles.imagePickerText}>Tap to select an image</Text>
        //             )}
        //         </TouchableOpacity>
        //
        //         <TouchableOpacity
        //             style={styles.submitButton}
        //             onPress={handleSubmit}
        //             disabled={isSubmitting}
        //         >
        //             {isSubmitting ? (
        //                 <ActivityIndicator color="#FFFFFF" />
        //             ) : (
        //                 <Text style={styles.submitButtonText}>Submit Report</Text>
        //             )}
        //         </TouchableOpacity>
        //     </ScrollView>
        // </SafeAreaView>
    );
}

// Local styles for interactive components to keep ReportPageStyles clean
const localStyles = StyleSheet.create({
    input: {
        backgroundColor: "#F0F0F0",
        paddingHorizontal: 15,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 15,
    },
    disasterTypeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 25,
        marginHorizontal: 26,
    },
    disasterTypeButton: {
        backgroundColor: '#EAEAEA',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        margin: 5,
    },
    disasterTypeButtonSelected: {
        backgroundColor: '#007AFF',
    },
    disasterTypeText: {
        color: '#333',
        fontWeight: '500',
    },
    disasterTypeTextSelected: {
        color: '#FFFFFF',
    },
    imagePicker: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
    },
    imagePickerText: {
        color: '#888',
        fontSize: 16,
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    submitButton: {
        backgroundColor: '#007AFF',
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 26,
        marginBottom: 20, // Add some space before the footer image
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});