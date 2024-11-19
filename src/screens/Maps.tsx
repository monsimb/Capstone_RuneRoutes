import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Mapbox, { MapView, Camera, MarkerView, UserTrackingMode, LocationPuck } from '@rnmapbox/maps';
import Location from 'react-native-location';

Mapbox.setAccessToken("pk.eyJ1IjoiYnJ5bGVyMSIsImEiOiJjbTM0MnFqdXkxcmR0MmtxM3FvOWZwbjQwIn0.PpuCmHlaCvyWyD5Kid9aPw")





const Maps = () => {
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        // Request permission and get user location
        Location.requestPermission({
          ios: 'whenInUse',     // Hopefully next sem we will onboard iOS
          android: {
            detail: 'fine',
          },
        })
          .then(granted => {
            if (granted) {
              // Fetch the user curr location
              Location.getLatestLocation({ enableHighAccuracy: true })
                .then(location => {
                  setUserLocation(location); // Save location to state
                })
                .catch(err => console.warn(err));
            }
          })
          .catch(err => console.warn('Permission denied:', err));
      }, []);

      if (!userLocation) {
        return <View style={{ flex: 1 }} />; // Return blank until location is fetched (no more SF map uhul!)
      }
   const markerCoordinates = [
     { id: 1, latitude: userLocation.latitude, longitude: userLocation.longitude }, // User's location
     { id: 2, latitude: 37.7749, longitude: -122.4194 }, // Example: San Francisco coordinates
     { id: 3, latitude: 40.7128, longitude: -74.0060 }, // Example: New York coordinates
   ];


  return (
    <View style={{ flex: 1 }}>
      <MapView
        provider="mapbox"
        style={styles.map}
        centerCoordinate={[userLocation.longitude, userLocation.latitude]} // Set initial map center to user's location
        zoomLevel={15} // Zoom level to 15
        showUserLocation={true} // Show user location on map
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
        {markerCoordinates.map((marker) => (
                  <MarkerView
                    key={marker.id}
                    coordinate={[marker.longitude, marker.latitude]} // Marker location
                  >
                    <View style={styles.markerViewContainer}>
                      <View style={styles.marker}>
                      </View>
                    </View>
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
  annotationContainer: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  annotation: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: 'white',
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
