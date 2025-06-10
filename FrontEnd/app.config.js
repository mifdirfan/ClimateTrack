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
            "googleMapsApiKey": process.env.GOOGLE_MAPS_API_KEY,
            "googleMapsApiUrl": process.env.GOOGLE_MAPS_API_URL,
        },
        "ios": {
            "supportsTablet": true,
            "config": {
                "googleMapsApiKey": process.env.GOOGLE_MAPS_API_KEY
            }
        },
        "android": {
            "adaptiveIcon": {
                "foregroundImage": "./assets/images/adaptive-icon.png",
                "backgroundColor": "#ffffff"
            },
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