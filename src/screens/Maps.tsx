import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Mapbox, { MapView, Camera, MarkerView, UserTrackingMode, LocationPuck } from '@rnmapbox/maps';
import Location from 'react-native-location';

Mapbox.setAccessToken("pk.eyJ1IjoiYnJ5bGVyMSIsImEiOiJjbTM0MnFqdXkxcmR0MmtxM3FvOWZwbjQwIn0.PpuCmHlaCvyWyD5Kid9aPw")




const Maps = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [markers, setMarkers] = useState([]); // Store custom markers
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Request permission and get user location
        Location.requestPermission({
            ios: 'whenInUse', // Hopefully next sem we will onboard iOS
            android: {
                detail: 'fine',
            },
        })
            .then(granted => {
                if (granted) {
                    // Fetch the user current location
                    Location.getLatestLocation({ enableHighAccuracy: true })
                        .then(location => {
                            setUserLocation(location); // Save location to state
                        })
                        .catch(err => console.warn(err));
                }
            })
            .catch(err => console.warn('Permission denied:', err));
    }, []);

    const handlePress = (e) => {
            // Check if `geometry.coordinates` exists in the event object
            const coordinates = e.geometry ? e.geometry.coordinates : null;

            if (coordinates) {
                const [longitude, latitude] = coordinates; // Coordinates should be in [longitude, latitude] order
                setMarkers(prevMarkers => [
                    ...prevMarkers,
                    { id: Math.random().toString(), longitude, latitude },
                ]);
                console.log("Tapped at coordinates: ", longitude, latitude);
            }
            else {
                console.error("No coordinates found in event:", e);
            }
        };

    if (!userLocation) {
        return <View style={{ flex: 1 }} />; // Return blank until location is fetched
    }

    return (
        <View style={{ flex: 1 }}>
            <MapView
                provider="mapbox"
                style={styles.map}
                centerCoordinate={[userLocation.longitude, userLocation.latitude]} // Set initial map center to user's location
                zoomLevel={15} // Zoom level to 15
                showUserLocation={true} // Show user location on map
                onPress={handlePress} // Handle press to add custom marker
            >
                <Camera
                    defaultSettings={{
                        centerCoordinate: [-77.036086, 38.910233],
                        zoomLevel: 14,
                    }}
                    followUserLocation={true}
                    followUserMode={UserTrackingMode.Follow}
                    followZoomLevel={14}
                />
                <LocationPuck
                    topImage="topImage"
                    visible={true}
                    scale={['interpolate', ['linear'], ['zoom'], 10, 1.0, 20, 4.0]}
                    pulsing={{
                        isEnabled: true,
                        color: 'teal',
                        radius: 50.0,
                    }}
                />
                {/* Render custom markers */}
                {markers.map((marker) => (
                    <MarkerView
                        key={marker.id}
                        coordinate={[marker.longitude, marker.latitude]} // Marker location
                    >
                    <Text> Marker </Text>
                    </MarkerView>
                ))}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
    markerViewContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    marker: {
        height: 40,
        width: 40,
        backgroundColor: 'red',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    markerText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Maps;