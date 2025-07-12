// import * as Location from 'expo-location';
// import React, { useEffect, useState } from 'react';
// import {
//     ActivityIndicator,
//     Alert,
//     Image,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View
// } from 'react-native';
// import MapView, { Callout, Marker, Region } from 'react-native-maps';

// type LocationCoords = {
//   latitude: number;
//   longitude: number;
// };

// type MechanicInfo = {
//   name: string;
//   isVerified: boolean;
//   location: LocationCoords | null;
//   rating: number;
// };

// // Get Distance in km
// function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
//   const R = 6371;
//   const dLat = deg2rad(lat2 - lat1);
//   const dLon = deg2rad(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(deg2rad(lat1)) *
//       Math.cos(deg2rad(lat2)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// }

// function deg2rad(deg: number): number {
//   return deg * (Math.PI / 180);
// }

// export default function Map() {
//   const [location, setLocation] = useState<LocationCoords | null>(null);

//   const mechanics: MechanicInfo[] = [
//     { name: 'Mechanic 1', isVerified: true, location: { latitude: 27.67716, longitude: 85.34933 }, rating: 4.0 },
//     { name: 'Mechanic 2', isVerified: false, location: { latitude: 27.6916, longitude: 85.33766 }, rating: 4.5 },
//     { name: 'Mechanic 3', isVerified: true, location: { latitude: 27.66773, longitude: 85.38213 }, rating: 5.0 },
//   ];

//   useEffect(() => {
//     (async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission Denied', 'Location access is required.');
//         return;
//       }

//       const currentLoc = await Location.getCurrentPositionAsync({});
//       setLocation({
//         latitude: currentLoc.coords.latitude,
//         longitude: currentLoc.coords.longitude,
//       });
//     })();
//   }, []);

//   if (!location) {
//     return <ActivityIndicator size="large" color="#007aff" style={{ flex: 1 }} />;
//   }

//   const region: Region = {
//     ...location,
//     latitudeDelta: 0.01,
//     longitudeDelta: 0.01,
//   };

//   return (
//     <View style={styles.container}>
//       <MapView style={styles.map} initialRegion={region}>
//         <Marker coordinate={location} title="You are here" pinColor="orange" />

//         {mechanics.map((m) => (
//           <Marker key={m.name} coordinate={m.location!} pinColor="green">
//             <Callout>
//                 <View style={styles.calloutBox}>
//                     {/* You can remove the Image if it's failing */}
//                     <Image source={require('@/assets/images/logo.png')} style={styles.mechanicImage} />
//                     <Text style={styles.calloutTitle}>{m.name}</Text>
//                     <Text>{m.isVerified ? "Verified" : "Not Verified"}</Text>
//                     <Text>Rating: {m.rating}</Text>
//                     <Text>
//                     Distance: {getDistance(
//                         location.latitude,
//                         location.longitude,
//                         m.location!.latitude,
//                         m.location!.longitude
//                     ).toFixed(2)} km
//                     </Text>
//                     <TouchableOpacity
//                     onPress={() => Alert.alert('Request Sent', `Mechanic: ${m.name}`)}
//                     style={styles.requestButton}
//                     >
//                     <Text style={styles.closeButtonText}>Request</Text>
//                     </TouchableOpacity>
//                 </View>
//             </Callout>

//           </Marker>
//         ))}
//       </MapView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     width: '100%',
//     height: '100%',
//   },
//   calloutBox: {
//     width: 200,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 15,
//     alignItems: 'center',
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//   },
//   mechanicImage: {
//     width: 80,
//     height: 80,
//     marginBottom: 15,
//     borderRadius: 10,
//   },
//   calloutTitle: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   requestButton: {
//     marginTop: 10,
//     backgroundColor: '#007aff',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 6,
//     width: '100%',
//     alignItems: 'center',
//   },
//   closeButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });




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

const mechanics: MechanicInfo[] = [
  { name: 'Mechanic 1', isVerified: true, location: { latitude: 27.67716, longitude: 85.34933 }, rating: 4.0 },
  { name: 'Mechanic 2', isVerified: false, location: { latitude: 27.6916, longitude: 85.33766 }, rating: 4.5 },
  { name: 'Mechanic 3', isVerified: true, location: { latitude: 27.66773, longitude: 85.38213 }, rating: 5.0 },
];

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
        const R = 6371; // Radius of the Earth in km
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // in kilometers
      }

      const map = L.map('map').setView([userLat, userLng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add marker for user location
      L.marker([userLat, userLng]).addTo(map)
        .bindPopup('You are here!')
        .openPopup();

      const mechanics = ${JSON.stringify(mechanics)};
      mechanics.forEach(m => {
        if (m.location) {
          const dist = haversineDistance(userLat, userLng, m.location.latitude, m.location.longitude).toFixed(2);
          const popupContent =
            '<b>' + m.name + '</b><br/>' +
            (m.isVerified ? 'Verified' : 'Not Verified') + '<br/>' +
            'Rating: ' + m.rating + '<br/>' +
            'Distance: ' + dist + ' km';

          L.marker([m.location.latitude, m.location.longitude]).addTo(map)
            .bindPopup(popupContent);
        }
      });
    </script>
  </body>
  </html>
  `;
}


export default function LeafletMap() {
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
