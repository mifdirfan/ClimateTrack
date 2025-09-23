// components/GoogleMap.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { DISASTER_TYPES, getWeatherIconUrl } from '../constants/weatherTypes';

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
            const disasterTypeInfo = DISASTER_TYPES.find(t => t.key === d.disasterType) || DISASTER_TYPES.find(t => t.key === 'Clouds'); // Default to 'Clouds'
            if (!disasterTypeInfo) return ''; // Should not happen with the default

            const iconUrl = getWeatherIconUrl(disasterTypeInfo.iconCode);

            // Use an SVG to create a colored circle background for the PNG icon
            const iconSvg = `
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="${disasterTypeInfo.color}" stroke="#fff" stroke-width="1.5"/>
                <image href="${iconUrl}" x="5" y="5" height="30" width="30" />
              </svg>
            `.replace(/\s+/g, ' ').trim();

            const encodedIconUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(iconSvg)}`;

            // Sanitize description for use in JavaScript string
            const sanitizedDescription = d.description ? d.description.replace(/'/g, "\\'").replace(/\n/g, ' ') : 'No description available.';

            return `
        new google.maps.Marker({
          position: { lat: ${d.latitude}, lng: ${d.longitude} },
          map: map,
          title: "${d.locationName}",
          icon: {
            url: "${encodedIconUrl}",
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 20)
          }
        }).addListener('click', function() {
          infoWindow.setContent(
            '<div style="padding: 10px; min-width: 200px; max-width: 250px;">' +
            '<h3 style="margin: 0 0 5px 0; color: ${disasterTypeInfo.color}; font-family: Arial, sans-serif;">${d.locationName}</h3>' +
            '<p style="margin: 0; font-family: Arial, sans-serif;">${sanitizedDescription}</p>' +
            '<div style="margin-top: 8px; display: flex; align-items: center;">' +
            '<img src="${iconUrl}" style="width: 24px; height: 24px; margin-right: 8px;" />' +
            '<span style="font-size: 14px; color: #333; font-family: Arial, sans-serif;">${disasterTypeInfo.label}</span>' +
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
          html, body, #map { height: 100%; margin: 0; padding: 0; }
        </style>
        <script src="${apiUrl}?key=${apiKey}&libraries=places"></script>
        <script>
          let map;
          let infoWindow;
          
          function initMap() {
            map = new google.maps.Map(document.getElementById("map"), {
              center: { lat: 4.2105, lng: 101.9758 }, // Centered on Malaysia
              zoom: 6,
              mapTypeControl: false,
              streetViewControl: false,
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
