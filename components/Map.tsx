import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

type LocationCoords = {
    latitude: number;
    longitude: number;
}

type MechanicInfo = {
    name: string;
    location:LocationCoords|null;
    rating: number;
}

export default function Map(){
    const [location, setLocation] = useState<LocationCoords | null>(null);
    const [markerPressed, setMarkerPressed] = useState(false);
    const slideAnim = useState(new Animated.Value(300))[0];
    const [chosenMechanic, setChosenMechanic] = useState<MechanicInfo | null>(null);

    const mechanics: MechanicInfo[] = [
        {name: "Mechanic 1", location: {latitude: 27.67716, longitude: 85.34933}, rating: 4.0},
        {name: "Mechanic 2", location: {latitude: 27.69160, longitude: 85.33766}, rating: 4.5},
        {name: "Mechanic 3", location: {latitude: 27.66773, longitude: 85.38213}, rating: 5.0},
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

    const handleMarkerPress = (m: MechanicInfo) => {
        setMarkerPressed(true);
        setChosenMechanic(m)
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const closeBottomSheet = () => {
        Animated.timing(slideAnim, {
            toValue: 300,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setMarkerPressed(false));
    };

    if (!location) {
        return <ActivityIndicator size="large" color="#007aff" style={{ flex: 1 }} />;
    }

    const region: Region = {
        ...location,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    };

    const tempLocation: LocationCoords = {
        latitude: location.latitude + 0.01,
        longitude: location.longitude + 0.01,
    }

    return (
        <View style={styles.container}>
            <MapView style={styles.map} initialRegion={region}>
                <Marker
                    coordinate={location}
                    title="You are here"
                    pinColor="orange"
                />
                {mechanics.map((m) => (
                    <Marker
                    key={m.name} 
                    coordinate={m.location!}
                    title={m.name}
                    pinColor='green'
                    onPress={() => handleMarkerPress(m)}
                    />
                ))}
            </MapView>

            {markerPressed && (
                <Animated.View
                    style={[
                        styles.bottomSheet,
                        {
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <Text style={styles.sheetTitle}>{chosenMechanic?.name}</Text>
                    <Text>Latitude: {chosenMechanic?.location!.latitude.toFixed(6)}</Text>
                    <Text>Longitude: {chosenMechanic?.location!.longitude.toFixed(6)}</Text>
                    <Text>Rating: {chosenMechanic?.rating}</Text>

                    <TouchableOpacity onPress={closeBottomSheet} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
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
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 10,
    },
    sheetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 15,
        padding: 10,
        backgroundColor: '#007aff',
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
