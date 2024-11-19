import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Mapbox, { MapView, Camera, Marker, UserTrackingMode, LocationPuck } from '@rnmapbox/maps';
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
});

export default Maps;
