import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { getWeatherDetails, getWeatherIconUrl } from '@/constants/weatherTypes';

type Disaster = {
    disasterId: string;
    disasterType: string;
    description: string;
    locationName: string;
    latitude: number;
    longitude: number;
};

type UserLocation = {
    latitude: number;
    longitude: number;
};

type GoogleMapWebProps = {
    disasters?: Disaster[];
    userLocation?: UserLocation | null;
};

export default function GoogleMapWeb({ disasters = [], userLocation }: GoogleMapWebProps) {
    const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey;
    const apiUrl = Constants.expoConfig?.extra?.googleMapsApiUrl || 'https://maps.googleapis.com/maps/api/js';

    if (!apiKey) {
        console.error('❌ Google Maps API key is missing!');
        return <View style={styles.container} />;
    }

    const disasterMarkersJS = disasters
        .filter(d => d && typeof d.latitude === 'number' && typeof d.longitude === 'number')
        .map((d) => {
            const weather = getWeatherDetails(d.disasterType);
            const iconUrl = getWeatherIconUrl(weather.icon);

            const iconSvg = `
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="${weather.color}" stroke="#fff" stroke-width="1"/>
                <image href="${iconUrl}" x="5" y="5" height="30" width="30"/>
              </svg>
            `.replace(/\s+/g, ' ').trim();

            const iconDataUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(iconSvg)}`;

            return `
              new google.maps.Marker({
                position: { lat: ${d.latitude}, lng: ${d.longitude} },
                map: map,
                title: "${d.locationName}",
                icon: {
                  url: "${iconDataUrl}",
                  scaledSize: new google.maps.Size(40, 40),
                  anchor: new google.maps.Point(20, 40)
                }
              }).addListener('click', function() {
                infoWindow.setContent(
                  '<div style="padding: 10px; min-width: 200px;">' +
                  '<h3 style="margin: 0 0 5px 0; color: ${weather.color}">${d.locationName}</h3>' +
                  '<p style="margin: 0;">${d.description}</p>' +
                  '</div>'
                );
                infoWindow.open(map, this);
              });
            `;
        }).join('\n');

    const userMarkerJS = userLocation ? `
      new google.maps.Marker({
        position: { lat: ${userLocation.latitude}, lng: ${userLocation.longitude} },
        map: map,
        title: "Your Location",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#007AFF',
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 2
        }
      });
      map.setCenter({ lat: ${userLocation.latitude}, lng: ${userLocation.longitude} });
      map.setZoom(14);
    ` : '';


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
              center: { lat: 4.2105, lng: 101.9758 }, // Centered on Malaysia
              zoom: 7,
              disableDefaultUI: true,
              zoomControl: true
            });

            infoWindow = new google.maps.InfoWindow();
            
            ${disasterMarkersJS}
            ${userMarkerJS}
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
                key={JSON.stringify(userLocation)} // Force re-render when location changes
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
        width: '100%',
    },
});

