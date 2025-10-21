import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocation } from '@/hooks/useLocation';
import { styles } from '@/constants/ReportPageStyles';
import { Header } from '../../components/Header';
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
    const [image, setImage] = useState<{ uri: string; mimeType?: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { requestLocation, errorMsg } = useLocation();
    //const [selectedDistrict, setSelectedDistrict] = useState('');

    const [locationInput, setLocationInput] = useState('');
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
    const [isGeocoding, setIsGeocoding] = useState(false);

    const { token, isLoading: isAuthLoading } = useAuth(); // Get the real auth state
    const router = useRouter();

    // useEffect(() => {
    //     // If the initial auth check is done and there's no token, redirect
    //     if (!isAuthLoading && !token) {
    //         Alert.alert("Login Required", "You must be logged in to submit a report.");
    //         router.replace('/screens/LoginScreen');
    //     }
    // }, [isAuthLoading, token, router]);

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
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            // Save both the uri and the mimeType from the selected asset
            setImage({ uri: asset.uri, mimeType: asset.mimeType });
        }
    };

    const handleSubmit = async () => {
        // ... (Input validation checks remain the same) ...
        if (!coordinates) {
            Alert.alert('Location Missing', 'Please select a district to set the report location.');
            return;
        }
        if (!title || !disasterType || !description) {
            Alert.alert('Missing Information', 'Please fill out the title, disaster type, and description.');
            return;
        }

        setIsSubmitting(true);
        //console.log("Starting report submission..."); // Log start

        let photoKey: string | undefined = undefined;

        // --- Real Image Upload Logic ---
        if (image) {
            console.log("Image selected, attempting upload..."); // Log image presence
            try {
                const filename = image.uri.split('/').pop() || `report-image-${Date.now()}`;
                const filetype = image.mimeType || 'image/jpeg';
                console.log(`Filename: ${filename}, Filetype: ${filetype}`); // Log file info

                // 1. Get presigned URL data
                //console.log("Fetching presigned URL...");
                const presignedUrlResponse = await fetch(`${API_BASE_URL}/api/upload/url?filename=${filename}&filetype=${filetype}`);
                //console.log(`Presigned URL response status: ${presignedUrlResponse.status}`); // Log status

                if (!presignedUrlResponse.ok) {
                    const errorText = await presignedUrlResponse.text();
                    throw new Error(`Could not get upload URL: ${errorText}`);
                }

                const { uploadUrl, key } = await presignedUrlResponse.json();
                //console.log(`Received upload URL: ${uploadUrl}`); // Log URL
                //console.log(`Received S3 key: ${key}`); // Log key

                // 2. Prepare image blob
                //console.log("Fetching image blob...");
                const imageResponse = await fetch(image.uri);
                const blob = await imageResponse.blob();
                //console.log("Image blob fetched successfully.");

                // 3. Upload image directly to S3
                //console.log("Uploading blob to S3...");
                const uploadResponse = await fetch(uploadUrl, {
                    method: 'PUT',
                    headers: { 'Content-Type': filetype },
                    body: blob,
                });


                console.log(`S3 Upload Response Status: ${uploadResponse.status}`);
                if (!uploadResponse.ok) {
                    const errorText = await uploadResponse.text(); // Get error text from S3 if possible
                    //console.error("S3 Upload Error Response Text:", errorText);
                    throw new Error(`Failed to upload image to S3. Status: ${uploadResponse.status}`);
                }

                console.log("Image uploaded successfully to S3.");
                photoKey = key; // Assign the key ONLY if upload is OK

            } catch (uploadError: any) {
                console.error("Image Upload Process Failed:", uploadError);
                Alert.alert("Upload Failed", `Could not upload the image: ${uploadError.message}. Please try again.`);
                setIsSubmitting(false); // Stop submission
                return; // Exit the function
            }
        } else {
            console.log("No image selected for upload."); // Log if no image
        }


        const reportData = {
            title,
            description,
            disasterType,
            latitude: coordinates.lat,
            longitude: coordinates.lng,
            photoUrl: photoKey, // Will be undefined if upload failed or no image
        };

        //console.log("Submitting report data to backend:", JSON.stringify(reportData, null, 2));

        try {
            //console.log("Sending report data to /api/reports...");
            const response = await fetch(`${API_BASE_URL}/api/reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(reportData),
            });
            //console.log(`Backend report submission response status: ${response.status}`); // Log backend response status

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to submit report: ${errorText}`);
            }

            //console.log("Report submitted successfully!");
            Alert.alert('Success', 'Your report has been submitted!');
            // Reset form
            setTitle('');
            setDisasterType('');
            setDescription('');
            setImage(null);
            setLocationInput('');
            setCoordinates(null);

        } catch (error: any) {
            console.error("Report Submission Failed:", error);
            Alert.alert('Submission Error', error.message);
        } finally {
            setIsSubmitting(false);
            console.log("Report submission process finished."); // Log end
        }
    };

    // Show a loading screen while checking authentication status
    if (isAuthLoading) {
        return (
            <SafeAreaView style={styles.root}>
                <ActivityIndicator size="large" style={{ flex: 1 }} />
            </SafeAreaView>
        );
    }

    if (!token) {
        return (
            <SafeAreaView style={styles.root}>
                <Header title="ClimateTrack" />
                <View style={styles.loginPromptContainer}>
                    <Text style={styles.loginPromptText}>Please log in to submit a report.</Text>
                    <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/screens/LoginScreen')}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.root}>
            {/* Sticky header */}
            <Header title="ClimateTrack" />

            {/* Page body (no scroll) */}
            <ScrollView style={styles.pageBody} showsVerticalScrollIndicator={false}>
                <Text style={styles.pageTitle}>Lodge a Report</Text>

                <Text style={styles.label}>Title</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Flood at Downtown"
                    placeholderTextColor="#9B9B9B"
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={styles.label}>Disaster Type</Text>
                <View style={styles.disasterTypeContainer}>
                    {DISASTER_TYPES.map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[
                                styles.disasterTypeButton,
                                disasterType === type && styles.disasterTypeButtonSelected,
                            ]}
                            onPress={() => setDisasterType(type)}
                        >
                            <Text
                                style={[
                                    styles.disasterTypeText,
                                    disasterType === type && styles.disasterTypeTextSelected,
                                ]}
                            >
                                {type}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Brief details…"
                    placeholderTextColor="#9B9B9B"
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
                <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                    {image ? (
                        // Use image.uri here to show the preview
                        <Image source={{ uri: image.uri }} style={styles.imagePreview} resizeMode="cover" />
                    ) : (
                        <View style={styles.plusWrap}>
                            <View style={styles.plusCircle}>
                                <AntDesign name="plus" size={20} />
                            </View>
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.submitButton, { opacity: isSubmitting ? 0.7 : 1 }]}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                    activeOpacity={0.9}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.submitButtonText}>Submit Report</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}