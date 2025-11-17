import BASE_API_URL from '@/utils/baseApi';
import * as Location from 'expo-location';
import * as SecureStorage from 'expo-secure-store';
import React, { memo, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

type LocationCoords = {
  latitude: number;
  longitude: number;
};

type MechanicInfo = {
  id: number;
  name: string;
  isVerified: boolean;
  location: LocationCoords | null;
  // rating?: number;
};

type UserInfo = {
  id: number;
  name: string;
  location: LocationCoords | null;
  // rating: number;
};

type LeafletMapProps = {
  mechanics: MechanicInfo[] | null;
  users: UserInfo[] | null;
  images?: any;
  description?: string;
  // userType?: 'user' | 'mechanic'; // optional user type for live tracking
};

// function generateHtml(lat: number, lng: number, mechanics: MechanicInfo[], users: UserInfo[], images?: any, description?: string) {
//   return `
//   <!DOCTYPE html>
//   <html>
//   <head>
//     <meta name="viewport" content="width=device-width, initial-scale=1" />
//     <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
//     <style>html,body,#map{height:100%;margin:0;padding:0;}</style>
//   </head>
//   <body>
//     <div id="map"></div>
//     <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
//     <script>
//       const userLat = ${lat};
//       const userLng = ${lng};

//       // --------------------------
//       // HAVERSINE DISTANCE FUNCTION
//       // --------------------------
//       function haversine(lat1, lon1, lat2, lon2) {
//         const R = 6371; // km
//         const dLat = (lat2 - lat1) * Math.PI / 180;
//         const dLon = (lon2 - lon1) * Math.PI / 180;
//         const a =
//           Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//           Math.cos(lat1 * Math.PI / 180) *
//           Math.cos(lat2 * Math.PI / 180) *
//           Math.sin(dLon / 2) *
//           Math.sin(dLon / 2);
//         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//         return R * c;
//       }

//       // Send mechanic request message to RN app
//       function requestMechanic(mechanicId) {
//         const payload = {
//           type: 'request_mechanic',
//           mechanicId: mechanicId,
//           description: ${JSON.stringify(description || '')},
//         };
//         window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(payload));
//       }

//       const map = L.map('map').setView([userLat, userLng], 13);

//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         maxZoom: 19,
//         attribution: '© OpenStreetMap contributors'
//       }).addTo(map);


//       // USER ICON
//       const userIcon = L.icon({
//         iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
//         shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
//         iconSize: [25,41],
//         iconAnchor: [12,41],
//         popupAnchor: [1,-34],
//         shadowSize: [41,41]
//       });

//       L.marker([userLat, userLng], {icon: userIcon}).addTo(map).bindPopup('You');


//       // =========================================================
//       // 2 KM DOTTED RADIUS CIRCLE
//       // =========================================================
//       L.circle([userLat, userLng], {
//         radius: 2000,
//         color: 'blue',
//         dashArray: '5, 10',
//         fillOpacity: 0
//       }).addTo(map);


//       // =========================================================
//       // BOUNDING BOX (2KM)
//       // =========================================================
//       const radiusInKm = 2;

//       const deltaLat = radiusInKm / 110.574;
//       const deltaLng = radiusInKm / (111.320 * Math.cos(userLat * Math.PI / 180));

//       const minLat = userLat - deltaLat;
//       const maxLat = userLat + deltaLat;
//       const minLng = userLng - deltaLng;
//       const maxLng = userLng + deltaLng;

//       L.rectangle([
//         [minLat, minLng],
//         [maxLat, maxLng]
//       ], {
//         color: 'red',
//         weight: 1,
//         dashArray: '4, 6'
//       }).addTo(map);


//       // =========================================================
//       // MECHANICS
//       // =========================================================
//       const mechanics = ${JSON.stringify(mechanics || [])};
//       mechanics.forEach(m => {
//         if (m.location) {
//           const distance = haversine(
//             userLat,
//             userLng,
//             m.location.latitude,
//             m.location.longitude
//           ).toFixed(2);

//           const popupHtml =
//             '<b>' + (m.name || 'Unknown') + '</b><br/>' +
//             (m.isVerified ? 'Verified' : 'Not Verified') + '<br/>' +
//             'Distance: ' + distance + ' km<br/>' +
//             '<button style="margin-top:10px; background-color: orange; color: #000; padding: 5px; width:100%; border-radius:10px;" onclick="requestMechanic(\\'' +
//             (m.id || '') +
//             '\\')">Send Request</button>';

//           L.marker([m.location.latitude, m.location.longitude])
//             .addTo(map)
//             .bindPopup(popupHtml);
//         }
//       });


//       // =========================================================
//       // USERS
//       // =========================================================
//       const users = ${JSON.stringify(users || [])};
//       users.forEach(u => {
//         if (u.location) {
//           L.marker([u.location.latitude, u.location.longitude])
//             .addTo(map)
//             .bindPopup('<b>' + (u.name || 'Unknown') + '</b>');
//         }
//       });

//     </script>
//   </body>
//   </html>
//   `;
// }

function generateHtml(lat: number, lng: number, mechanics: MechanicInfo[], users: UserInfo[], images?: any, description?: string) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>html,body,#map{height:100%;margin:0;padding:0;}</style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      const userLat = ${lat};
      const userLng = ${lng};

      // --------------------------
      // HAVERSINE DISTANCE FUNCTION
      // --------------------------
      function haversine(lat1, lon1, lat2, lon2) {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * Math.PI / 180) *
          Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      }

      // ETA CALCULATION
      function getETA(distanceKm) {
        const walk = Math.round((distanceKm / 5) * 60);    // 5 km/h
        const bike = Math.round((distanceKm / 15) * 60);   // 15 km/h
        const vehicle = Math.round((distanceKm / 40) * 60); // 40 km/h
        return { walk, bike, vehicle };
      }

      // Send mechanic request message to RN app
      function requestMechanic(mechanicId) {
        const payload = {
          type: 'request_mechanic',
          mechanicId: mechanicId,
          description: ${JSON.stringify(description || '')},
        };
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(payload));
      }

      const map = L.map('map').setView([userLat, userLng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);


      // USER ICON
      const userIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25,41],
        iconAnchor: [12,41],
        popupAnchor: [1,-34],
        shadowSize: [41,41]
      });

      L.marker([userLat, userLng], {icon: userIcon}).addTo(map).bindPopup('You');


      // =========================================================
      // 2 KM DOTTED RADIUS CIRCLE
      // =========================================================
      L.circle([userLat, userLng], {
        radius: 2000,
        color: 'blue',
        dashArray: '5, 10',
        fillOpacity: 0
      }).addTo(map);


      // =========================================================
      // BOUNDING BOX (2KM)
      // =========================================================
      const radiusInKm = 2;

      const deltaLat = radiusInKm / 110.574;
      const deltaLng = radiusInKm / (111.320 * Math.cos(userLat * Math.PI / 180));

      const minLat = userLat - deltaLat;
      const maxLat = userLat + deltaLat;
      const minLng = userLng - deltaLng;
      const maxLng = userLng + deltaLng;

      L.rectangle([
        [minLat, minLng],
        [maxLat, maxLng]
      ], {
        color: 'red',
        weight: 1,
        dashArray: '4, 6'
      }).addTo(map);


      // =========================================================
      // MECHANICS
      // =========================================================
      const mechanics = ${JSON.stringify(mechanics || [])};
      mechanics.forEach(m => {
        if (m.location) {
          const distance = haversine(
            userLat,
            userLng,
            m.location.latitude,
            m.location.longitude
          );

          const distanceKm = distance.toFixed(2);

          const eta = getETA(distance);

          const popupHtml =
            '<b>' + (m.name || 'Unknown') + '</b><br/>' +
            (m.isVerified ? 'Verified' : 'Not Verified') + '<br/>' +
            'Distance: ' + distanceKm + ' km<br/><br/>' +
            '<b>ETA:</b><br/>' +
            '🚶 Walking: ' + eta.walk + ' min<br/>' +
            '🏍️ Bike: ' + eta.bike + ' min<br/>' +
            '🚗 Vehicle: ' + eta.vehicle + ' min<br/><br/>' +
            '<button style="margin-top:10px; background-color: orange; color: #000; padding: 5px; width:100%; border-radius:10px;" onclick="requestMechanic(\\'' +
            (m.id || '') +
            '\\')">Send Request</button>';

          L.marker([m.location.latitude, m.location.longitude])
            .addTo(map)
            .bindPopup(popupHtml);
        }
      });


      // =========================================================
      // USERS
      // =========================================================
      const users = ${JSON.stringify(users || [])};
      users.forEach(u => {
        if (u.location) {
          L.marker([u.location.latitude, u.location.longitude])
            .addTo(map)
            .bindPopup('<b>' + (u.name || 'Unknown') + '</b>');
        }
      });

    </script>
  </body>
  </html>
  `;
}


function LeafletMap ({ mechanics, users, images, description }: LeafletMapProps){
  const [location, setLocation] = useState<LocationCoords|null>(null);
  const webviewRef = useRef<WebView | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });

      // Watch for location changes
      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 5 },
        (loc) => {
          const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
          setLocation(coords);
          // if (liveRoom && userType) {
            // webviewRef.current?.postMessage(JSON.stringify({ ...coords, user_type: userType }));
          // }
        }
      );
    })();
  }, []);
  if (!location) return null;

  // images: could be array of URIs or objects like { uri, name, type }
  // make sure you have images in RN as URIs if you intend to upload them.

  const handleWebViewMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type !== 'request_mechanic') return;

      const mechanicId = data.mechanicId;
      const desc = data.description || '';
      const pageImages = data.images || [];

      const token = await SecureStorage.getItemAsync('access_token');

      const formData = new FormData();
      formData.append('to_user_id', mechanicId);
      formData.append('description', desc);
      console.log(formData);

      // Append images — adapt depending on image shape in your app.
      // If your images prop is an array of URI strings:
      images.forEach((uri, idx) => {
        formData.append('images', {
          uri,
          name: `image_${idx}.jpg`,
          type: 'image/jpeg',
        } as any);
      });

      console.log(formData);

      const res = await fetch(`${BASE_API_URL}/api/tracking/notifications/create/`, {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        } as any,
        body: formData,
      });

      const json = await res.json();
      console.log('notification response', res.status, json);

      // Optionally send a success/failure message back to WebView
      webviewRef.current?.postMessage(JSON.stringify({ type: 'request_result', status: res.status, body: json }));
    } catch (err) {
      console.error('handleWebViewMessage error', err);
      webviewRef.current?.postMessage(JSON.stringify({ type: 'request_error', error: String(err) }));
    }
  };

  

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html: generateHtml(location.latitude, location.longitude, mechanics || [], users || [], images, description) }}
        javaScriptEnabled
        domStorageEnabled
        style={{ flex: 1 }}
        onMessage={handleWebViewMessage}
      />
    </View>
  );
};


export default memo(LeafletMap);



const styles = StyleSheet.create({ container: { flex: 1 } });
