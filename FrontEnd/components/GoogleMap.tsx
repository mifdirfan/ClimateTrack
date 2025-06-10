// components/GoogleMap.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

export default function GoogleMapWeb({ disasters }: { disasters: any[] }) {
    const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey;
    const apiUrl = Constants.expoConfig?.extra?.googleMapsApiUrl;

    if (!apiKey) {
        console.error('Google Maps API key is missing!');
        return <View style={styles.container} />;
    }

    const markersJS = disasters.map((d) => {
        return `
      new google.maps.Marker({
        position: { lat: ${d.coordinate.latitude}, lng: ${d.coordinate.longitude} },
        map: map,
        title: "${d.title}",
      });
    `;
    }).join('\n');

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
          /*function initMap() {
            const map = new google.maps.Map(document.getElementById("map"), {
              center: { lat: 4.2105, lng: 101.9758 },
              zoom: 7,
            });
            ${markersJS}
          }*/
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
});
