// Load environment variables from .env file
import 'dotenv/config';

console.log("API Key from .env:", process.env.GOOGLE_MAPS_API_KEY ? "Loaded" : "MISSING OR UNDEFINED");

export default {
    "expo": {
        "name": "ClimateTrack",
        "slug": "ClimateTrack",
        "version": "1.0.0",
        "orientation": "portrait",
        "icon": "./assets/images/ClimateTrack_logo.png",
        "scheme": "disasteralertapp",
        "userInterfaceStyle": "automatic",
        "newArchEnabled": true,
        "extra": {
            "eas": {
                "projectId": "d55943a1-b511-4bbe-b031-25112add3aff"
            },
            "googleMapsApiKey": process.env.GOOGLE_MAPS_API_KEY,
            "googleMapsApiUrl": process.env.GOOGLE_MAPS_API_URL,
        },
        "ios": {
            "supportsTablet": true,
            "config": {
                "googleMapsApiKey": process.env.GOOGLE_MAPS_API_KEY
            },
            "bundleIdentifier": "com.ClimateTrack"
        },
        "android": {
            "package": "com.ClimateTrack",
            "adaptiveIcon": {
                "foregroundImage": "./assets/images/adaptive-icon.png",
                "backgroundColor": "#ffffff"
            },
            "googleServicesFile": "./google-services.json",
            "mixedContentMode": "always",
            // Add this flag to allow HTTP requests in development on Android.
            // This is necessary for connecting to a local backend server.
            // NOTE: For a production build, you should use HTTPS.
            "usesCleartextTraffic": true,
            "edgeToEdgeEnabled": true,
            "config": {
                "googleMaps": {
                    "apiKey": process.env.GOOGLE_MAPS_API_KEY
                }
            }
        },
        "web": {
            "bundler": "metro",
            "output": "static",
            "favicon": "./assets/images/favicon.png"
        },
        "plugins": [
            "expo-router",
            "expo-notifications",
            [
                "expo-splash-screen",
                {
                    "image": "./assets/images/splash-icon.png",
                    "imageWidth": 200,
                    "resizeMode": "contain",
                    "backgroundColor": "#ffffff"
                }
            ],
            [
                "expo-location",
                {
                    "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location."
                }
            ]
        ],
        "experiments": {
            "typedRoutes": true
        }
    }
};