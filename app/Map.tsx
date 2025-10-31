import BASE_API_URL from '@/utils/baseApi';
import * as Location from 'expo-location';
import * as SecureStorage from 'expo-secure-store';
import React, { useEffect, useRef, useState } from 'react';
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
  rating?: number;
};

type LeafletMapProps = {
  mechanics: MechanicInfo[] | null;
  // liveRoom?: string;
  images?: any;
  description?: string;
  // userType?: 'user' | 'mechanic'; // optional user type for live tracking
};

// function generateHtml(lat: number, lng: number, mechanics: MechanicInfo[], liveRoom?: string, userType?: string, images?: any, description?: string) {
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

//       const requestMechanic(mechanicId) async{
//         const formData = FormData();
//         formData.append('to_user_id': mechanicId);
//         formData.append('description', description);
//         formData.append('images', images);

//         const res = await axios.post("${BASE_API_URL}/api/tracking/notifications/create/", formData, {headers: {Authorization: 'Bearer ${SecureStorage.getItem("access_token")}', "Content-Type": "application/json"} });
//         console.log(res.data);
//         }

//       const map = L.map('map').setView([userLat, userLng], 13);
//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         maxZoom: 19,
//         attribution: '© OpenStreetMap contributors'
//       }).addTo(map);

//       const userIcon = L.icon({
//         iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
//         shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
//         iconSize: [25,41],
//         iconAnchor: [12,41],
//         popupAnchor: [1,-34],
//         shadowSize: [41,41]
//       });

//       const userMarker = L.marker([userLat, userLng], {icon: userIcon}).addTo(map).bindPopup('You');

//       // Mechanics markers
//       const mechanics = ${JSON.stringify(mechanics || [])};
//       mechanics.forEach(m => {
//         if (m.location) {
//           const marker = L.marker([m.location.latitude, m.location.longitude])
//             .addTo(map)
//             .bindPopup(
//               '<b>' + m.name + '</b><br/>' +
//               (m.isVerified ? 'Verified' : 'Not Verified') + '<br/>' +
//               (m.rating ? 'Rating: ' + m.rating + '<br/>' : '') +
//               '<button style="margin-top:10px; background-color: orange; color: #000; padding: 5px; width:100%; border-radius:10px;" onclick="requestMechanic(\\'' + m.id + '\\')">Send Request</button>'
//             );
//         }
//       });

//       // Live tracking via WebSocket
//       // ${liveRoom && userType ? `
//       // const ws = new WebSocket('ws://yourserver.com/ws/tracking/${liveRoom}/');
//       // ws.onmessage = function(event) {
//       //   const data = JSON.parse(event.data);
//       //   const { latitude, longitude, user_type } = data;

//       //   if(user_type === 'mechanic') {
//       //     if(window.mechanicMarker) {
//       //       window.mechanicMarker.setLatLng([latitude, longitude]);
//       //     } else {
//       //       window.mechanicMarker = L.marker([latitude, longitude], {icon: L.icon({
//       //         iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
//       //         iconSize: [25,41], iconAnchor: [12,41], popupAnchor: [1,-34], shadowSize: [41,41]
//       //       })}).addTo(map).bindPopup('Mechanic');
//       //     }
//       //   } else {
//       //     userMarker.setLatLng([latitude, longitude]);
//       //   }
//       // };

//       // Receive updates from React Native
//       document.addEventListener('message', function(event) {
//         const data = JSON.parse(event.data);
//         if(ws.readyState === WebSocket.OPEN){
//           ws.send(JSON.stringify(data));
//         }
//       });
//       ` : ''}
//     </script>
//   </body>
//   </html>
//   `;
// }

function generateHtml(lat: number, lng: number, mechanics: MechanicInfo[], images?: any, description?: string) {
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
  

      // Send mechanic request message to React Native
      function requestMechanic(mechanicId) {
        const payload = {
          type: 'request_mechanic', 
          mechanicId: mechanicId,
          description: ${JSON.stringify(description || '')},
        };
        // Post message to RN app
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(payload));
      }

      const map = L.map('map').setView([userLat, userLng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      const userIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25,41],
        iconAnchor: [12,41],
        popupAnchor: [1,-34],
        shadowSize: [41,41]
      });

      L.marker([userLat, userLng], {icon: userIcon}).addTo(map).bindPopup('You');

      const mechanics = ${JSON.stringify(mechanics || [])};
      mechanics.forEach(m => {
        if (m.location) {
          const marker = L.marker([m.location.latitude, m.location.longitude])
            .addTo(map)
            .bindPopup(
              '<b>' + (m.name || 'Unknown') + '</b><br/>' +
              (m.isVerified ? 'Verified' : 'Not Verified') + '<br/>' +
              (m.rating ? 'Rating: ' + m.rating + '<br/>' : '') +
              '<button style="margin-top:10px; background-color: orange; color: #000; padding: 5px; width:100%; border-radius:10px;" onclick="requestMechanic(\\'' + (m.id || '') + '\\')">Send Request</button>'
            );
        }
      });

      // optional: receive messages from RN
      document.addEventListener('message', function(event) {
        // handle messages from RN if needed
      });
    </script>
  </body>
  </html>
  `;
}

export default function LeafletMap ({ mechanics, images, description }: LeafletMapProps){
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
      const pageImages = data.images || []; // whatever you passed in the HTML

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
        source={{ html: generateHtml(location.latitude, location.longitude, mechanics || [], images, description) }}
        javaScriptEnabled
        domStorageEnabled
        style={{ flex: 1 }}
        onMessage={handleWebViewMessage}
      />
    </View>
  );
};





// export default function LeafletMap({ mechanics, images, description }: LeafletMapProps) {
//   const [location, setLocation] = useState<LocationCoords | null>(null);
//   const webviewRef = useRef<WebView|null>(null);

//   useEffect(() => {
//     (async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         alert('Permission to access location was denied');
//         return;
//       }
//       const loc = await Location.getCurrentPositionAsync({});
//       setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });

//       // Watch for location changes
//       Location.watchPositionAsync(
//         { accuracy: Location.Accuracy.High, distanceInterval: 5 },
//         (loc) => {
//           const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
//           setLocation(coords);
//           // if (liveRoom && userType) {
//             // webviewRef.current?.postMessage(JSON.stringify({ ...coords, user_type: userType }));
//           // }
//         }
//       );
//     })();
//   }, []);

//   if (!location) return null;

//   return (
//     <View style={styles.container}>
//       <WebView
//         ref={webviewRef}
//         originWhitelist={['*']}
//         source={{ html: generateHtml(location.latitude, location.longitude, mechanics || []) }}
//         javaScriptEnabled
//         domStorageEnabled
//         style={{ flex: 1 }}
//       />
//     </View>
//   );
// }

const styles = StyleSheet.create({ container: { flex: 1 } });
