import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocation } from '@/hooks/useLocation';
import { styles } from '../../constants/ReportPageStyles';
import API_BASE_URL from '../../constants/ApiConfig';

const DISASTER_TYPES = ['Flood', 'Thunderstorm', 'Landslide', 'Earthquake', 'Wildfire', 'Other'];

export default function ReportPage() {
    const [title, setTitle] = useState('');
    const [disasterType, setDisasterType] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { requestLocation, errorMsg } = useLocation();

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) setImage(result.assets[0].uri);
    };

    const handleSubmit = async () => {
        if (!title || !disasterType || !description) {
            Alert.alert('Missing Information', 'Please fill out the title, disaster type, and description.');
            return;
        }

        setIsSubmitting(true);

        let photoUrl: string | undefined = undefined;

        // Step 1: If an image is selected, upload it to S3 first.
        if (image) {
            try {
                // A. Get a pre-signed URL and object key from our backend
                const filename = image.split('/').pop() || `report-image-${Date.now()}`;
                const filetype = `image/${filename.split('.').pop()}`;

                const presignedUrlResponse = await fetch(`${API_BASE_URL}/api/upload/url?filename=${encodeURIComponent(filename)}&filetype=${encodeURIComponent(filetype)}`);
                if (!presignedUrlResponse.ok) throw new Error('Could not get an upload URL.');

                const { uploadUrl, key } = await presignedUrlResponse.json();

                // B. Upload the image file directly to S3 using the pre-signed URL
                const imageResponse = await fetch(image);
                const blob = await imageResponse.blob();

                const s3UploadResponse = await fetch(uploadUrl, {
                    method: 'PUT',
                    headers: { 'Content-Type': filetype },
                    body: blob,
                });

                if (!s3UploadResponse.ok) throw new Error('Image upload to S3 failed.');

                // C. The permanent key is what we'll save in our database
                photoUrl = key;

            } catch (e: any) {
                Alert.alert('Upload Error', `Failed to upload image: ${e.message}`);
                setIsSubmitting(false);
                return;
            }
        }

        const location = await requestLocation();
        if (!location) {
            Alert.alert('Location Error', errorMsg || 'Could not get your current location. Please enable location services.');
            setIsSubmitting(false);
            return;
        }

        const authToken = 'YOUR_JWT_TOKEN_HERE'; // TODO: use real token
        //const photoUrl = image ? 'https://placeholder.com/image.jpg' : undefined;

        const reportData = {
            title,
            description,
            disasterType,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            photoUrl: photoUrl,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(reportData),
            });

            if (!response.ok) throw new Error('Failed to submit report. Please try again.');

            Alert.alert('Success', 'Your report has been submitted. Thank you for your contribution!');
            setTitle('');
            setDisasterType('');
            setDescription('');
            setImage(null);
        } catch (e: any) {
            Alert.alert('Submission Error', e.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.root}>
            {/* Sticky header */}
            <View style={styles.headerRow}>
                <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="chevron-back" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>ClimateTrack</Text>
                <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Feather name="menu" size={22} />
                </TouchableOpacity>
            </View>

            {/* Page body (no scroll) */}
            <View style={styles.pageBody}>
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

                <Text style={styles.label}>Upload an Image</Text>
                <TouchableOpacity style={styles.imagePicker} onPress={pickImage} activeOpacity={0.85}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.imagePreview} resizeMode="cover" />
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
            </View>
        </SafeAreaView>
    );
}