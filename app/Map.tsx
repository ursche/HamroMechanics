import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import MapView, { Callout, Marker, Region } from 'react-native-maps';

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

// Get Distance in km
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export default function Map() {
  const [location, setLocation] = useState<LocationCoords | null>(null);

  const mechanics: MechanicInfo[] = [
    { name: 'Mechanic 1', isVerified: true, location: { latitude: 27.67716, longitude: 85.34933 }, rating: 4.0 },
    { name: 'Mechanic 2', isVerified: false, location: { latitude: 27.6916, longitude: 85.33766 }, rating: 4.5 },
    { name: 'Mechanic 3', isVerified: true, location: { latitude: 27.66773, longitude: 85.38213 }, rating: 5.0 },
  ];

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required.');
        return;
      }

      const currentLoc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLoc.coords.latitude,
        longitude: currentLoc.coords.longitude,
      });
    })();
  }, []);

  if (!location) {
    return <ActivityIndicator size="large" color="#007aff" style={{ flex: 1 }} />;
  }

  const region: Region = {
    ...location,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={region}>
        <Marker coordinate={location} title="You are here" pinColor="orange" />

        {mechanics.map((m) => (
          <Marker key={m.name} coordinate={m.location!} pinColor="green">
            <Callout tooltip onPress={() => Alert.alert('Request Sent', `Mechanic: ${m.name}`)}>
              <TouchableWithoutFeedback>
                <View style={styles.calloutBox}>
                  <Image source={require("@/assets/images/logo.png")} style={styles.mechanicImage} />
                  <Text style={styles.calloutTitle}>{m.name}</Text>
                  <Text>{!m.isVerified && ("Not ")}Verified</Text>
                  <Text>Rating: {m.rating}</Text>
                  <Text>
                    Distance:{' '}
                    {getDistance(
                      location.latitude,
                      location.longitude,
                      m.location!.latitude,
                      m.location!.longitude
                    ).toFixed(2)}{' '}
                    km
                  </Text>
                  <TouchableOpacity
                    onPress={() => Alert.alert('Request Sent', `Mechanic: ${m.name}`)}
                    style={styles.requestButton}
                  >
                    <Text style={styles.closeButtonText}>Request</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  calloutBox: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  mechanicImage: {
    width: 80,
    height: 80,
    marginBottom: 15,
    borderRadius: 10,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  requestButton: {
    marginTop: 10,
    backgroundColor: '#007aff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
