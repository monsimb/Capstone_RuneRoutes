
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Alert, Button } from 'react-native';
import MapView, { Marker, Region, Polygon } from 'react-native-maps';
import { Canvas, useCanvasRef, Circle, Path, Paint, Skia } from "@shopify/react-native-skia";
import FogOfWarCanvas from './FogOfWarCanvas';
// Define the main App component
const App: React.FC = () => {
  const [interactive, setInteractive] = useState(true);
  const ref = useCanvasRef();
  const paintRef = Skia.Paint();
  // Define the initial region for the map
  const initialRegion: Region = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
// Test coordinates
  const coordinates = [
      { latitude: 37.78825, longitude: -122.4324 },
      { latitude: 37.38825, longitude: -122.3324 },
      { latitude: 37.78825, longitude: -122.4324 },
  ];

  const handleToggle = () => {
    setInteractive(!interactive);
  };

  return (
      <SafeAreaView style={styles.container}>
            <Button title="Toggle Fog Interaction" onPress={handleToggle} />
            <View style={styles.mapContainer}>
              <MapView
                style={StyleSheet.absoluteFillObject}
                initialRegion={initialRegion}
              >
                {/* Example Marker */}
                <Marker coordinate={{ latitude: 37.78825, longitude: -122.4324 }} />
              </MapView>
              <FogOfWarCanvas interactive={interactive} />
            </View>
          </SafeAreaView>
    );
  };

// Export the App component
export default App;

// Custom map style
const mapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
];

// Define styles
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  canvas: {
    position: 'absolute',
    width: 200,
    height: 200,
    top: 50, // Adjust top and left as needed to position the canvas
    left: 50,
    zIndex: 10,
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  fogCanvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent', // Ensure canvas is see-through
  },
});
