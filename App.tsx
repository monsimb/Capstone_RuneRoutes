
import React, { useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Alert, Button, TouchableOpacity, Text, Modal } from 'react-native';
import MapView, { Marker, Region, Polygon } from 'react-native-maps';
import { Canvas, useCanvasRef, Circle, Path, Paint, Skia } from "@shopify/react-native-skia";
import FogOfWarCanvas from './FogOfWarCanvas';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { TapGesture } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/tapGesture';
import { PanGesture } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/panGesture';

// Define the main App component
const App: React.FC = () => {
  const ref = useCanvasRef();
  const paintRef = Skia.Paint();

  const mapRef = useRef<MapView>(null);
  const panGestureRef = useRef(Gesture.Pan()); // Ref for the Canvas gesture

  // Define the initial region for the map
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
// Test coordinates
const mapGesture = Gesture.Pan().simultaneousWithExternalGesture(panGestureRef);

const panGesture = Gesture.Pan()
    .onChange((e) => {
      console.log("Pan on Canvas:", e.translationX, e.translationY);

      // Update map region based on pan movement
      const newRegion = {
        ...region,
        latitude: region.latitude + e.translationY * 0.0001, // Scale movement as needed
        longitude: region.longitude - e.translationX * 0.0001,
      };
      setRegion(newRegion);

      // Programmatically animate MapView to the new region
      mapRef.current?.animateToRegion(newRegion, 100);
    })
    .withRef(panGestureRef);

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <View style={styles.mapContainer}>
          <GestureDetector gesture={mapGesture}>
              <MapView
                ref={mapRef}
                style={StyleSheet.absoluteFillObject}
                initialRegion={region}
                onRegionChangeComplete={(newRegion) => setRegion(newRegion)}

              >
                {/* Example Marker */}
                <Marker coordinate={{ latitude: 37.78825, longitude: -122.4324 }} />
              </MapView>
              </GestureDetector>
              <GestureDetector gesture={panGesture}>
                <FogOfWarCanvas />
              </GestureDetector>           
        </View>
          
      </SafeAreaView>
      
    </GestureHandlerRootView>
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
    zIndex: 1,
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  button: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'blue',
    padding: 10,
  },
});
