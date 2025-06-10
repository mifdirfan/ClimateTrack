/*// components/GoogleMap.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

const DISASTER_TYPES = [
    { key: 'flood', label: 'Flood', color: '#FF4747', icon: 'water' },
    { key: 'landslide', label: 'Landslide', color: '#FFC107', icon: 'mountain' },
    { key: 'rain', label: 'Heavy Rain', color: '#2196F3', icon: 'cloud-rain' }
];

const MOCK_DISASTERS = [
    {
        id: 1,
        type: 'flood',
        title: 'Flood in Kuala Lumpur',
        description: 'Severe flooding reported',
        coordinate: { latitude: 3.139, longitude: 101.6869 }
    },
    {
        id: 2,
        type: 'flood',
        title: 'Flood in Johor Bahru',
        description: 'Evacuations underway',
        coordinate: { latitude: 1.4927, longitude: 103.7414 }
    },
    {
        id: 3,
        type: 'landslide',
        title: 'Landslide in Penang',
        description: 'Roads blocked',
        coordinate: { latitude: 5.4164, longitude: 100.3327 }
    },
    {
        id: 4,
        type: 'rain',
        title: 'Storm in Kota Bharu',
        description: 'People advised to stay at home.',
        coordinate: { latitude: 6.1251, longitude: 102.2379 }
    }
];

export default function GoogleMapWeb({ disasters }: { disasters: any[] }) {
    const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey;
    const apiUrl = Constants.expoConfig?.extra?.googleMapsApiUrl;

    if (!apiKey) {
        console.error('Google Maps API key is missing!');
        return <View style={styles.container} />;
    }

    // Generate marker SVG icons based on disaster type
    const markersJS = disasters.map((d) => {
        const disasterType = DISASTER_TYPES.find(t => t.key === d.type) || DISASTER_TYPES[0];
        const svgIcon = `
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="${disasterType.color}" stroke="#fff" stroke-width="2"/>
            <text x="20" y="26" font-family="Arial" font-size="20" text-anchor="middle" fill="white">${disasterType.icon}</text>
          </svg>
        `.replace(/\n/g, '').replace(/\s{2,}/g, ' ');

        const iconUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgIcon)}`;

        return `
          new google.maps.Marker({
            position: { lat: ${d.coordinate.latitude}, lng: ${d.coordinate.longitude} },
            map: map,
            title: "${d.title}",
            icon: {
              url: "${iconUrl}",
              scaledSize: new google.maps.Size(40, 40),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(20, 20)
            },
            label: {
              text: "${disasterType.icon}",
              color: "white",
              fontSize: "14px"
            }
          });
        `;
    }).join('\n');

    /!*const markersJS = disasters.map((d) => {
        return `
      new google.maps.Marker({
        position: { lat: ${d.coordinate.latitude}, lng: ${d.coordinate.longitude} },
        map: map,
        title: "${d.title}",
      });
    `;
    }).join('\n');*!/

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          html, body, #map { height: 100%; margin: 0; padding: 0; }
        </style>
        <script src="${apiUrl}?key=${apiKey}"></script>
        <script>
          window.onload = function () {
            const map = new google.maps.Map(document.getElementById("map"), {
              center: { lat: 2.2105, lng: 101.9758 },
              zoom: 7,
            });
            ${markersJS}
          };
          /!*function initMap() {
            const map = new google.maps.Map(document.getElementById("map"), {
              center: { lat: 4.2105, lng: 101.9758 },
              zoom: 7,
            });
            ${markersJS}
          }*!/
        </script>
      </head>
      <body> <!--onload="initMap()"-->
        <div id="map"></div>
      </body>
    </html>
  `;

    return (
        <View style={styles.container}>
            <WebView
                originWhitelist={['*']}
                source={{ html }}
                style={{ flex: 1 }}
                javaScriptEnabled
                domStorageEnabled
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 300, // or however tall you want the map
        width: '100%',
    },
});*/


/*
// components/GoogleMap.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

const DISASTER_TYPES = [
    { key: 'flood', label: 'Flood', color: '#FF4747', icon: 'water' },
    { key: 'landslide', label: 'Landslide', color: '#FFC107', icon: 'mountain' },
    { key: 'rain', label: 'Heavy Rain', color: '#2196F3', icon: 'cloud-rain' }
];

// SVG paths for FontAwesome5 icons
const ICON_PATHS = {
    water: 'M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z',
    mountain: 'M12,3L2,21H22L12,3M12,7.5L17,16H7L12,7.5Z',
    'cloud-rain': 'M6,14A5,5 0 0,1 1,9A5,5 0 0,1 6,4C7,4 8,4.29 8.89,4.77C9.34,3.59 10.48,2.75 11.77,2.75C13.56,2.75 15,4.19 15,6C15,6.5 14.87,7 14.66,7.43C15.5,7.79 16.21,8.36 16.71,9.07C18.14,9.07 19.29,10.22 19.29,11.65C19.29,13.09 18.14,14.24 16.71,14.24C16.71,14.24 16.71,14.24 16.7,14.24V14.24H6M11,19V16H13V19H11M15,19V16H17V19H15M7,19V16H9V19H7Z'
};

export default function GoogleMapWeb({ disasters = MOCK_DISASTERS }: { disasters?: any[] }) {
    const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey;
    const apiUrl = Constants.expoConfig?.extra?.googleMapsApiUrl || 'https://maps.googleapis.com/maps/api/js';

    if (!apiKey) {
        console.error('Google Maps API key is missing!');
        return <View style={styles.container} />;
    }

    const markersJS = disasters.map((d) => {
        const disasterType = DISASTER_TYPES.find(t => t.key === d.type) || DISASTER_TYPES[0];
        const iconPath = ICON_PATHS[disasterType.icon as keyof typeof ICON_PATHS] || ICON_PATHS.water;

        // Create SVG with circle background and icon
        const svgIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="${disasterType.color}" stroke="#fff" stroke-width="2"/>
                <path fill="white" d="${iconPath}" transform="translate(10, 8) scale(1.3)"/>
            </svg>
        `.replace(/\s+/g, ' ').trim();

        const iconUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgIcon)}`;

        return `
            new google.maps.Marker({
                position: { lat: ${d.coordinate.latitude}, lng: ${d.coordinate.longitude} },
                map: map,
                title: "${d.title}",
                icon: {
                    url: "${iconUrl}",
                    scaledSize: new google.maps.Size(40, 40),
                    anchor: new google.maps.Point(20, 20)
                }
            }).addListener('click', function() {
                infoWindow.setContent(
                    '<div style="padding: 10px;">' +
                    '<h3 style="margin: 0 0 5px 0; color: ${disasterType.color}">${d.title}</h3>' +
                    '<p style="margin: 0;">${d.description}</p>' +
                    '</div>'
                );
                infoWindow.open(map, this);
            });
        `;
    }).join('\n');

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          html, body, #map { height: 100%; margin: 0; padding: 0; }
          .gm-style .gm-style-iw {
            font-family: Arial, sans-serif;
          }
          .gm-style-iw h3 {
            margin-top: 0;
          }
        </style>
        <script src="${apiUrl}?key=${apiKey}"></script>
        <script>
          let map;
          let infoWindow;
          
          window.onload = function() {
            map = new google.maps.Map(document.getElementById("map"), {
              center: { lat: 2.2105, lng: 101.9758 },
              zoom: 7,
            });
            
            infoWindow = new google.maps.InfoWindow();
            
            ${markersJS}
          };
        </script>
      </head>
      <body>
        <div id="map"></div>
      </body>
    </html>
  `;

    return (
        <View style={styles.container}>
            <WebView
                originWhitelist={['*']}
                source={{ html }}
                style={{ flex: 1 }}
                javaScriptEnabled
                domStorageEnabled
                mixedContentMode="always"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 300,
        width: '100%',
    },
});

const MOCK_DISASTERS = [
    {
        id: 1,
        type: 'flood',
        title: 'Flood in Kuala Lumpur',
        description: 'Severe flooding reported',
        coordinate: { latitude: 3.139, longitude: 101.6869 }
    },
    {
        id: 2,
        type: 'flood',
        title: 'Flood in Johor Bahru',
        description: 'Evacuations underway',
        coordinate: { latitude: 1.4927, longitude: 103.7414 }
    },
    {
        id: 3,
        type: 'landslide',
        title: 'Landslide in Penang',
        description: 'Roads blocked',
        coordinate: { latitude: 5.4164, longitude: 100.3327 }
    },
    {
        id: 4,
        type: 'rain',
        title: 'Storm in Kota Bharu',
        description: 'People advised to stay at home',
        coordinate: { latitude: 6.1251, longitude: 102.2379 }
    }
];*/

// components/GoogleMap.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

// const MOCK_DISASTERS = [
//     {
//         id: 1,
//         type: 'flood',
//         title: 'Flood in Kuala Lumpur',
//         description: 'Severe flooding reported',
//         coordinate: { latitude: 3.139, longitude: 101.6869 }
//     },
//     {
//         id: 2,
//         type: 'flood',
//         title: 'Flood in Johor Bahru',
//         description: 'Evacuations underway',
//         coordinate: { latitude: 1.4927, longitude: 103.7414 }
//     },
//     {
//         id: 3,
//         type: 'landslide',
//         title: 'Landslide in Penang',
//         description: 'Roads blocked',
//         coordinate: { latitude: 5.4164, longitude: 100.3327 }
//     },
//     {
//         id: 4,
//         type: 'rain',
//         title: 'Storm in Kota Bharu',
//         description: 'People advised to stay at home',
//         coordinate: { latitude: 6.1251, longitude: 102.2379 }
//     }
// ];

const DISASTER_TYPES = [
    { key: 'flood', label: 'Flood', color: '#FF4747', icon: 'water' },
    { key: 'landslide', label: 'Landslide', color: '#FFC107', icon: 'mountain' },
    { key: 'rain', label: 'Heavy Rain', color: '#2196F3', icon: 'cloud-rain' }
];

const ICON_PATHS = {
    'water': {
        path: 'M12 2.67c-3.58 0-6.5 2.92-6.5 6.5 0 1.82.75 3.47 1.96 4.66L12 18l4.54-4.17c1.21-1.19 1.96-2.84 1.96-4.66 0-3.58-2.92-6.5-6.5-6.5z',
        viewBox: '0 0 24 24',
        scale: 0.7,
        translateX: 0,
        translateY: 0
    },
    'mountain': {
        path: 'M12 3L2 18h20L12 3zm0 4.5l3.5 4.5h-7l3.5-4.5z',
        viewBox: '0 0 24 24',
        scale: 0.7,
        translateX: 0,
        translateY: 0
    },
    'cloud-rain': {
        path: 'M16 13v8H8v-8H2l10-9 10 9h-6zm-6 3.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z',
        viewBox: '0 0 12 12',
        scale: 0.7,
        translateX: 0,
        translateY: 0
    }
};

type Disaster = {
    disasterId: string;
    disasterType: string;
    description: string;
    locationName: string;
    latitude: number;
    longitude: number;
};

export default function GoogleMapWeb({ disasters = [] }: { disasters?: Disaster[] }) {
    const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey;
    const apiUrl = Constants.expoConfig?.extra?.googleMapsApiUrl || 'https://maps.googleapis.com/maps/api/js';

    if (!apiKey) {
        console.error('❌ Google Maps API key is missing!');
        return <View style={styles.container} />;
    }

    const markersJS = disasters
        .filter(d => d && typeof d.latitude === 'number' && typeof d.longitude === 'number')
        .map((d) => {
            const disasterType = DISASTER_TYPES.find(t => t.key === d.disasterType) || DISASTER_TYPES[0];
            // @ts-ignore
            const iconData = ICON_PATHS[disasterType.icon];

            const iconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18" fill="${disasterType.color}" stroke="#fff" stroke-width="1"/>
          <g transform="translate(12 12) scale(${iconData.scale}) translate(${iconData.translateX}, ${iconData.translateY})">
            <path fill="white" d="${iconData.path}"/>
          </g>
        </svg>
      `.replace(/\s+/g, ' ').trim();

            const iconUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(iconSvg)}`;

            return `
        new google.maps.Marker({
          position: { lat: ${d.latitude}, lng: ${d.longitude} },
          map: map,
          title: "${d.locationName}",
          icon: {
            url: "${iconUrl}",
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 20)
          }
        }).addListener('click', function() {
          infoWindow.setContent(
            '<div style="padding: 10px; min-width: 200px;">' +
            '<h3 style="margin: 0 0 5px 0; color: ${disasterType.color}">${d.locationName}</h3>' +
            '<p style="margin: 0;">${d.description}</p>' +
            '<div style="margin-top: 5px; display: flex; align-items: center;">' +
            '<span style="width: 12px; height: 12px; background: ${disasterType.color}; border-radius: 50%; margin-right: 5px;"></span>' +
            '<span style="font-size: 12px; color: #666;">${disasterType.label}</span>' +
            '</div>' +
            '</div>'
          );
          infoWindow.open(map, this);
        });
      `;
        }).join('\n');

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html, body, #map { height: 100%; margin: 0; padding: 0; font-family: Arial, sans-serif; }
        </style>
        <script src="${apiUrl}?key=${apiKey}&libraries=places"></script>
        <script>
          let map;
          let infoWindow;
          
          function initMap() {
            map = new google.maps.Map(document.getElementById("map"), {
              center: { lat: 2.2105, lng: 101.9758 },
              zoom: 7,
            });

            infoWindow = new google.maps.InfoWindow();
            
            ${markersJS}
          }
          
          window.onload = initMap;
        </script>
      </head>
      <body>
        <div id="map"></div>
      </body>
    </html>
  `;

    return (
        <View style={styles.container}>
            <WebView
                originWhitelist={['*']}
                source={{ html }}
                style={{ flex: 1 }}
                javaScriptEnabled
                domStorageEnabled
                mixedContentMode="always"
                startInLoadingState
                onError={({ nativeEvent }) => {
                    console.warn('WebView error: ', nativeEvent);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 300,
        width: '100%',
    },
});