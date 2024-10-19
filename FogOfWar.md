# Rune Routes: Fog of War Feature

## Overview
Rune Routes is a city exploration app that encourages users to discover new locations by providing an interactive map experience. One of the key features of this app is the **"Fog of War"** functionality, which keeps parts of the map hidden until the user physically visits those locations.

This feature helps create a sense of exploration and adventure, motivating users to explore new areas in the real world. Locations remain "undiscovered" on the map until the user has actually traveled to that location, at which point the "fog" is lifted, and the area is revealed.

## Fog of War Implementation

### 1. **Concept**:
The "Fog of War" feature works similarly to what you'd see in video games where areas of the map are shrouded until the player visits them. Here, we use polygons to cover the unexplored regions of the map and gradually remove them as the user moves to new locations.

### 2. **Tools and Libraries**:
The following tools and libraries are used for this feature:
- **React Native**: The primary framework for building the mobile app.
- **React Native Maps**: A map rendering library for React Native to display Google Maps.
- **Google Maps API**: Used to integrate Google Maps into the app and manipulate map polygons.
- **Polygons**: A key component in hiding unexplored areas, as the fog is implemented by covering areas with semi-transparent polygons.

### 3. **Functionality**:
- **Polygons as Fog**: The map starts with unexplored areas covered by polygons. These polygons represent the fog.
- **Location-Based Fog Removal**: The user's current location is tracked using the phone's GPS, and as the user reaches a new area, the corresponding polygon is removed, revealing the map.
- **Real-Time Updates**: The user's movements are constantly monitored, and the fog is removed dynamically as the user explores new places.

### 4. **Code Snippet (Simplified)**:

```javascript
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import MapView, { Polygon } from 'react-native-maps';

const App = () => {
  // Initial region for the map
  const initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // State to track discovered regions
  const [discoveredRegions, setDiscoveredRegions] = useState([]);

  // Example polygon representing the fog of war
  const fogPolygon = [
    { latitude: 37.78925, longitude: -122.4334 },
    { latitude: 37.78825, longitude: -122.4324 },
    { latitude: 37.78725, longitude: -122.4314 },
    { latitude: 37.78625, longitude: -122.4304 },
  ];

  const onUserLocationChange = (location) => {
    // Logic to remove the fog based on user location
    if (/* Check if user is in the area */) {
      setDiscoveredRegions((prevRegions) => [...prevRegions, fogPolygon]);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <MapView
          style={styles.mapStyle}
          initialRegion={initialRegion}
          showsUserLocation={true}
          onUserLocationChange={onUserLocationChange}>
          
          {/* Render polygons for undiscovered regions */}
          {discoveredRegions.map((polygon, index) => (
            <Polygon
              key={index}
              coordinates={polygon}
              strokeColor="rgba(0,0,0,0.5)"
              fillColor="rgba(0,0,0,0.3)"
            />
          ))}
        </MapView>
      </View>
    </SafeAreaView>
  );
};

// Styles for the map and container
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapStyle: {
    width: '100%',
    height: '100%',
  },
});

export default App;
