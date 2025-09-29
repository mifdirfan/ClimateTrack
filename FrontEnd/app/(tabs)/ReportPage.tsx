import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useLocation } from '@/hooks/useLocation';
import { styles } from '../../constants/ReportPageStyles';
import API_BASE_URL from '../../constants/ApiConfig';

const DISASTER_TYPES = ['Flood', 'Landslide', 'Earthquake', 'Wildfire', 'Other'];

export default function ReportPage() {
    const [title, setTitle] = useState('');
    const [disasterType, setDisasterType] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { requestLocation, errorMsg } = useLocation();

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
        if (!title || !disasterType || !description) {
            Alert.alert('Missing Information', 'Please fill out the title, disaster type, and description.');
            return;
        }

        setIsSubmitting(true);

        const location = await requestLocation();
        if (!location) {
            Alert.alert('Location Error', errorMsg || 'Could not get your current location. Please enable location services.');
            setIsSubmitting(false);
            return;
        }

        // In a real app, you would get the token from an AuthContext
        const authToken = "YOUR_JWT_TOKEN_HERE"; // TODO: Replace with actual token

        // In a real app, you would first upload the image to a service like S3
        // and get back a URL. For now, we'll use a placeholder.
        const photoUrl = image ? 'https://placeholder.com/image.jpg' : undefined;

        const reportData = {
            title,
            description,
            disasterType,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            photoUrl,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify(reportData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit report. Please try again.');
            }

            Alert.alert('Success', 'Your report has been submitted. Thank you for your contribution!');
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