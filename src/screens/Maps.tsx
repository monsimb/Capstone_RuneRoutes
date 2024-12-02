import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Mapbox, { MapView, Camera, MarkerView, UserTrackingMode, LocationPuck, ShapeSource, FillLayer, LineLayer } from '@rnmapbox/maps';
import Location, { Location as LocationType } from 'react-native-location';

Mapbox.setAccessToken("pk.eyJ1IjoiYnJ5bGVyMSIsImEiOiJjbTM0MnFqdXkxcmR0MmtxM3FvOWZwbjQwIn0.PpuCmHlaCvyWyD5Kid9aPw");

interface Marker {
  id: string;
  longitude: number;
  latitude: number;
}

const Maps: React.FC = () => {
  const [userLocation, setUserLocation] = useState<LocationType | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]); // Store custom markers
  const [loading, setLoading] = useState<boolean>(true);


  // Function to create a polygon around a given location
  const createPolygon = (longitude: number, latitude: number) => {
    // Define the offset for the polygon (in degrees, adjust as needed)
    const offset = 0.1; // Increase this to make the polygon larger

    // Create the coordinates for the polygon
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [longitude - offset, latitude - offset],
                [longitude + offset, latitude - offset],
                [longitude + offset, latitude + offset],
                [longitude - offset, latitude + offset],
                [longitude - offset, latitude - offset],
              ],
            ],
          },
        },
      ],
    };
  };

  useEffect(() => {
    // Request permission and get user location
    Location.requestPermission({
      ios: 'whenInUse',
      android: { detail: 'fine' },
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

  const handlePress = (e: any) => {
    const coordinates = e.geometry ? e.geometry.coordinates : null;

    if (coordinates) {
      const [longitude, latitude] = coordinates;
      setMarkers(prevMarkers => [
        ...prevMarkers,
        { id: Math.random().toString(), longitude, latitude },
      ]);
      console.log("Tapped at coordinates: ", longitude, latitude);
    } else {
      console.error("No coordinates found in event:", e);
    }
  };

  if (!userLocation) {
    return <View style={{ flex: 1 }} />; // Return blank until location is fetched
  }

  const geoJson = createPolygon(userLocation.longitude, userLocation.latitude); // Generate polygon based on user location

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
            zoomLevel: 10,
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

        {/* Add inverted polygon (filled outside) */}
        <ShapeSource id="userPolygon" shape={geoJson}>
          <LineLayer
            sourceID="feature"
            id="reqId"
            style={{
              lineColor: '#ffffff',
              lineWidth: 15,
            }}
          />
          <FillLayer
            sourceID="feat"
            id="feat"
            style={{
              // Fill outside the polygon (the area surrounding it)
              fillColor: '#000000', // Color of the filled area
              fillOpacity: 0.5,
              // Use a negative fill to fill the area outside the polygon?
            }}
          />
        </ShapeSource>

        {/* Render custom markers */}
        {markers.map((marker) => (
          <MarkerView key={marker.id} coordinate={[marker.longitude, marker.latitude]}>
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
