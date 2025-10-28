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
    source: string;
};

type Report = {
    reportId: string;
    title: string;
    latitude: number;
    longitude: number;
    postedByUsername: string;
};


type UserLocation = {
    latitude: number;
    longitude: number;
};

type GoogleMapWebProps = {
    disasters?: Disaster[];
    reports?: Report[]; // NEW: Add reports prop
    userLocation?: UserLocation | null;
};

export default function GoogleMapWeb({ disasters = [], reports = [], userLocation }: GoogleMapWebProps) {
    const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey;
    const apiUrl = Constants.expoConfig?.extra?.googleMapsApiUrl || 'https://maps.googleapis.com/maps/api/js';

    if (!apiKey) {
        console.error('❌ Google Maps API key is missing!');
        return <View style={styles.container} />;
    }

    const disasterMarkersJS = disasters
        .filter(d => d && typeof d.latitude === 'number' && typeof d.longitude === 'number')
        .map((d) => {
            // Get color based on disaster type for the marker background
            const weather = getWeatherDetails(d.disasterType);
            const iconUrl = getWeatherIconUrl(weather.icon);

            // Create a custom SVG marker that uses the OpenWeatherMap icon
            const iconSvg = `
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                <defs>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="1" dy="3" stdDeviation="2" flood-color="#000" flood-opacity="0.4"/>
                  </filter>
                </defs>
                
                <!-- The Marker Pin shape (red/type color) -->
                <path 
                    d="M24,48 C12,48 0,34 0,24 C0,12 12,0 24,0 C36,0 48,12 48,24 C48,34 36,48 24,48 Z" 
                    fill="${weather.color}" 
                    stroke="#fff" 
                    stroke-width="2" 
                    filter="url(#shadow)"
                    transform="scale(0.7) translate(10, 10)"
                />
                
                <!-- The Icon in the center of the pin -->
                <image 
                    href="${iconUrl}" 
                    x="12" y="5" 
                    height="24" width="24"
                    transform="scale(1.2) translate(0, 0)"
                />
                
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
                  scaledSize: new google.maps.Size(48, 48),
                  anchor: new google.maps.Point(24, 48) // Adjust anchor to the bottom tip of the pin
                }
              }).addListener('click', function() {
                infoWindow.setContent(
                  '<div style="padding: 5px; min-width: 100px; max-width: 200px;">' +
                  '<h1 style="font-size: 20px; margin: 0 0 5px 0; color: black">${d.locationName}</h1>' +
                  '<h3 style="font-size: 15px; margin: 0 0 5px 0; color: darkslategrey; font-weight: bold">${d.disasterType}</h3>' +
                  '<p style="margin: 0; font-size: 13px;">Source: ${d.source}</p>' +
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

    const reportMarkersJS = reports
        .filter(r => r && typeof r.latitude === 'number' && typeof r.longitude === 'number')
        .map((r) => {
            // User reports (Yellow Circle with a custom path)
            const reportIconSvg = `
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
                <defs>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0.5" dy="2" stdDeviation="1" flood-color="#000" flood-opacity="0.3"/>
                  </filter>
                </defs>
                <circle cx="15" cy="15" r="12" fill="#E6AF00" stroke="#fff" stroke-width="2" filter="url(#shadow)"/>
                <!-- Exclamation mark in white -->
                <text x="15" y="20" font-family="Arial" font-size="16" fill="#fff" text-anchor="middle" font-weight="bold">!</text>
              </svg>
            `.replace(/\s+/g, ' ').trim();
            const reportIconDataUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(reportIconSvg)}`;

            return `
              new google.maps.Marker({
                position: { lat: ${r.latitude}, lng: ${r.longitude} },
                map: map,
                title: "${r.title}",
                icon: {
                  url: "${reportIconDataUrl}",
                  scaledSize: new google.maps.Size(30, 30),
                  anchor: new google.maps.Point(15, 15)
                }
              }).addListener('click', function() {
                infoWindow.setContent(
                  '<div style="padding: 5px; min-width: 100px;">' +
                  '<h1 style="font-size: 18px; margin: 0 0 5px 0; color: black">${r.title}</h1>' +
                  '<p style="margin: 0; color: #555; font-size: 13px;">Reported by: <strong>${r.postedByUsername}</strong></p>' +
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
              center: { lat: 4.2105, lng: 101.9758 }, // Centered on Malaysia
              zoom: 3,
              disableDefaultUI: true,
              zoomControl: true,
              // Restrict map to the valid Mercator projection bounds.
              // This prevents scrolling into the blank space at the poles.
              restriction: {
                latLngBounds: {
                  north: 85,
                  south: -85,
                  west: -180,
                  east: 180,
                },
                strictBounds: false, // 'false' allows a soft bounce-back effect
              }
            });

            infoWindow = new google.maps.InfoWindow();
            
            ${disasterMarkersJS}
            ${reportMarkersJS}
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
