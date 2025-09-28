import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

type LocationCoords = {
  latitude: number;
  longitude: number;
};

type MechanicInfo = {
  name: string;
  isVerified: boolean;
  location: LocationCoords | null;
  rating: number;
};

function generateHtml(lat: number, lng: number, mechanics: MechanicInfo[]) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      rel="stylesheet"
      href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    />
    <style>html,body,#map{height:100%;margin:0;padding:0;}</style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      const userLat = ${lat};
      const userLng = ${lng};

      function haversineDistance(lat1, lon1, lat2, lon2) {
        const toRad = angle => (angle * Math.PI) / 180;
        const R = 6371;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      }

      const map = L.map('map').setView([userLat, userLng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // User marker with custom orange icon
      const userIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      L.marker([userLat, userLng], { icon: userIcon })
        .addTo(map)
        .bindPopup('You are here!')
        .openPopup();

      // Mechanics markers (default color)
      const mechanics = ${JSON.stringify(mechanics)};
      mechanics.forEach(m => {
        if (m.location) {
          const dist = haversineDistance(userLat, userLng, m.location.latitude, m.location.longitude).toFixed(2);
          const popupContent =
  '<b>' + m.name + '</b><br/>' +
  (m.isVerified ? 'Verified' : 'Not Verified') + '<br/>' +
  'Rating: ' + m.rating + '<br/>' +
  'Distance: ' + dist + ' km<br/>' + '<button style="margin-top:10px; background-color: orange; color: #000; padding: 5px; width:100%; border-radius:10px;" onclick="requestMechanic(m.name)">Send Request</button>';


          L.marker([m.location.latitude, m.location.longitude])
            .addTo(map)
            .bindPopup(popupContent);
        }
      });
    </script>
  </body>
  </html>
  `;
}

export default function LeafletMap({ mechanics }) {
  const [location, setLocation] = useState<LocationCoords | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  if (!location) return null;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: generateHtml(location.latitude, location.longitude, mechanics) }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
