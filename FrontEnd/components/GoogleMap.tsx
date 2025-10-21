import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

// --- NEW: Define a placeholder for your default report photo ---
// NOTE: This MUST be a publicly accessible URL. The WebView cannot access local app assets.
//TODO: Replace this with a real URL after uploading your default image to a hosting service.
const DEFAULT_REPORT_IMAGE_URL = 'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png';

type Disaster = {
    disasterId: string;
    disasterType: string;
    description: string;
    locationName: string;
    latitude: number;
    longitude: number;
    source: string;
    reportedAt: string;
};

type Report = {
    reportId: string;
    title: string;
    description: string;
    disasterType: string;
    postedByUsername: string;
    photoUrl?: string;
    latitude: number;
    longitude: number;
    // Backend sends Instant as a string (ISO 8601 format)
    reportedAt: string;
    locationName?: string; // Add optional field for reverse geocoded location
};


type UserLocation = {
    latitude: number;
    longitude: number;
};

type GoogleMapWebProps = {
    disasters?: Disaster[];
    reports?: Report[]; // NEW: Add reports prop
    userLocation?: UserLocation | null;
    searchedLocation?: UserLocation | null; // NEW: For the searched location pin
};

const GoogleMapWeb: React.FC<GoogleMapWebProps> = ({ disasters = [], reports = [], userLocation, searchedLocation }) => {
    const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey;
    const apiUrl = Constants.expoConfig?.extra?.googleMapsApiUrl || 'https://maps.googleapis.com/maps/api/js';

    if (!apiKey) {
        console.error('❌ Google Maps API key is missing!');
        return <View style={styles.container} />;
    }

    const disasterMarkersJS = disasters
        .filter(d => d && typeof d.latitude === 'number' && typeof d.longitude === 'number')
        .map((d) => {
            return `
              new google.maps.Marker({
                position: { lat: ${d.latitude}, lng: ${d.longitude} },
                map: map,
                title: "${d.locationName}",
                icon: {
                  // Use a simple circle, similar to report markers, but red for disasters.
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 13, // Make disaster markers slightly larger to stand out
                  fillColor: '#cb0000', // Red for disasters
                  fillOpacity: 1,
                  strokeColor: 'white',
                  strokeWeight: 2
                }
              }).addListener('click', function() {
                // --- NEW: OverlayView Logic ---
                const content = \`
                    <h1 style="font-size: 20px; margin: 20px 0 5px 0; color: black">${d.disasterType}</h1>
                    <h3 style="font-size: 15px; margin: 0 0 5px 0; color: darkslategrey; font-weight: bold">${d.locationName}</h3>
                    <h3 style="font-size: 12px; margin: 0 0 5px 0; color: darkslategrey; font-weight: bold">${new Date(d.reportedAt).toLocaleDateString()}</h3>
                    <p style="margin: 0;">Source: <strong>${d.source}</strong></p>
                \`;
                customOverlay.setContent(content);
                customOverlay.setPosition(this.getPosition());
                customOverlay.show();
              });
            `;
        }).join('\n');

    const reportMarkersJS = reports
        .filter(r => r && typeof r.latitude === 'number' && typeof r.longitude === 'number')
        .map((r) => {
            // User reports will be a simple blue circle to differentiate them
            return `
              new google.maps.Marker({
                position: { lat: ${r.latitude}, lng: ${r.longitude} },
                map: map,
                title: "${r.title}",
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 13,
                  fillColor: '#E6AF00', 
                  fillOpacity: 1,
                  strokeColor: 'white',
                  strokeWeight: 2
                }
              }).addListener('click', function() {
                // --- NEW: OverlayView Logic ---
                const content = \`
                    <img src="${r.photoUrl || DEFAULT_REPORT_IMAGE_URL}" style="width: calc(100% + 30px); height: 120px; object-fit: cover; border-radius: 25px 25px 0 0; margin: -15px 0 12px -15px;">
                    <h1 style="font-size: 18px; margin: 0 0 3px 0; color: black">${r.title}</h1>
                    <h3 style="font-size: 12px; margin: 0 0 2px 0; color: darkslategrey; font-weight: bold">${new Date(r.reportedAt).toLocaleDateString()}</h3>
                    <p style="margin-bottom: 5px; color: #000;">${r.description}</p>
                    <p style="margin: 0; color: #555;">Reported by: <strong>${r.postedByUsername}</strong></p>
                \`;
                customOverlay.setContent(content);
                customOverlay.setPosition(this.getPosition());
                customOverlay.show();
              });
            `;
        }).join('\n');

    const searchedLocationMarkerJS = searchedLocation ? `
       // Add a marker for the searched location
       new google.maps.Marker({
         position: { lat: ${searchedLocation.latitude}, lng: ${searchedLocation.longitude} },
         map: map,
         title: "Searched Location",
         icon: {
           path: google.maps.SymbolPath.CIRCLE,
           scale: 10,
           fillColor: '#FFFFFF', // White marker
           fillOpacity: 1,
           strokeColor: 'Black',
           strokeWeight: 3
         }
       });
 
       // Center the map on the searched location
       map.setCenter({ lat: ${searchedLocation.latitude}, lng: ${searchedLocation.longitude} });
       map.setZoom(14);
       // Mark that the map has been centered by a user action
       window.mapHasBeenCentered = true;
     ` : '';

    const userMarkerJS = userLocation ? `
      new google.maps.Marker({
        position: { lat: ${userLocation.latitude}, lng: ${userLocation.longitude} },
        map: map,
        title: "Your Location",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#007AFF',
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 2
        }
      });
      // Only center the map automatically on the initial load.
      // This prevents re-centering when filters are applied.
      if (!window.mapHasBeenCentered) {
        map.setCenter({ lat: ${userLocation.latitude}, lng: ${userLocation.longitude} });
        map.setZoom(14);
        window.mapHasBeenCentered = true;
      }
    ` : '';

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html, body { height: 100%; margin: 0; padding: 0; font-family: Arial, sans-serif; }
          #map { height: 100%; width: 100%; }
          /* --- NEW: Styles for the OverlayView Info Box --- */
          .custom-info-box {
            position: absolute;
            background-color: white;
            padding: 15px; /* Consistent padding on all sides */
            border-radius: 25px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10;
            /* This transform will center the box above the marker's anchor point */
            transform: translate(-50%, -110%);
            min-width: 180px;
            max-width: 260px;
            min-height: 80px;
            max-height: 300px;
          }
          .custom-info-box-close {
            position: absolute;
            top: 10px;
            right: 15px; /* Adjust position to be inside the padding */
            cursor: pointer;
            font-size: 30px;
            color: #cb0000; /* Red close button */
            font-weight: bolder;
            line-height: 1;
            z-index: 30;
            /* Add a background to make it visible on any image */
            background-color: rgba(255, 255, 255, 0.7);
            border-radius: 50%;
            width: 30px;
            height: 30px;
            text-align: center;
          }
        </style>
        <script src="${apiUrl}?key=${apiKey}&libraries=places"></script>
        <script>
          let map;
          let customOverlay;
          window.mapHasBeenCentered = false; // Global flag to track centering

          // --- NEW: Custom OverlayView Class ---
          class CustomInfoBox extends google.maps.OverlayView {
            constructor() {
              super();
              this.div = document.createElement('div');
              this.div.className = 'custom-info-box';
              this.div.style.display = 'none'; // Initially hidden
              this.contentDiv = document.createElement('div');
              const closeButton = document.createElement('div');
              closeButton.className = 'custom-info-box-close';
              closeButton.innerHTML = '&times;';
              closeButton.onclick = () => this.hide();
              this.div.appendChild(this.contentDiv);
              this.div.appendChild(closeButton);
            }
            onAdd() {
              const panes = this.getPanes();
              panes.floatPane.appendChild(this.div);
            }
            onRemove() {
              if (this.div.parentElement) {
                this.div.parentElement.removeChild(this.div);
              }
            }
            draw() {
              if (this.position) {
                const projection = this.getProjection();
                const point = projection.fromLatLngToDivPixel(this.position);
                this.div.style.left = point.x + 'px';
                this.div.style.top = point.y + 'px';
              }
            }
            setPosition(position) { this.position = position; }
            setContent(html) { this.contentDiv.innerHTML = html; }
            show() { this.div.style.display = 'block'; this.setMap(map); }
            hide() { this.div.style.display = 'none'; this.setMap(null); }
          }
          
          function initMap() {
            map = new google.maps.Map(document.getElementById("map"), {
              center: { lat: 4.2105, lng: 101.9758 }, // Centered on Malaysia
              zoom: 6,
              disableDefaultUI: true,
              // --- NEW: Set a minimum zoom level ---
              minZoom: 3, // Prevents zooming out so far that the map is smaller than the screen
              zoomControl: false,
            
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

            customOverlay = new CustomInfoBox();

            // Add a click listener to the map to hide the info box
            map.addListener('click', function() {
              customOverlay.hide();
            });
            
            ${disasterMarkersJS}
            ${reportMarkersJS}
            ${userMarkerJS}
            ${searchedLocationMarkerJS}
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

// Wrap the component with React.memo to prevent unnecessary re-renders
// when parent state changes, as long as the props remain the same.
export default memo(GoogleMapWeb);
