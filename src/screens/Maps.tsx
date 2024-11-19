import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Mapbox, {MapView, Marker} from '@rnmapbox/maps';

Mapbox.setAccessToken("pk.eyJ1IjoiYnJ5bGVyMSIsImEiOiJjbTM0MnFqdXkxcmR0MmtxM3FvOWZwbjQwIn0.PpuCmHlaCvyWyD5Kid9aPw")

const Maps = () => {

  useEffect(() => {
    // You can add any necessary initialization logic here.
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        provider="mapbox"
        style={styles.map}
        initialRegion={{
          latitude: 40.7128,  // Latitude for New York City
          longitude: -74.0060, // Longitude for New York City
          latitudeDelta: 0.0922, // Adjust the zoom level
          longitudeDelta: 0.0421, // Adjust the zoom level
        }}
      >
        {/* Marker to show at the specified coordinates */}

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
