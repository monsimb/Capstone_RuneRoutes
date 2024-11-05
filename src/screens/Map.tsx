/** 
 * Map.tsx
 * Responsible for creating the map, and retrieving user location.
 * @returns Map page.
*/

import React, { useRef, useEffect, useState } from 'react';
import Geolocation from '@react-native-community/geolocation';
import {mapStyle, styles} from '../styles/Map';
import { SafeAreaView, StyleSheet, View, Alert, Button, TouchableOpacity, Text, Modal } from 'react-native';
import MapView, { Marker, Region, Polygon } from 'react-native-maps';
import { Canvas, useCanvasRef, Circle, Path, Paint, Skia } from "@shopify/react-native-skia";
import FogOfWarCanvas from './FogOfWarCanvas';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

function Map() {
  // User location nonsense
  // TODO: change so that it no longer requires a fixed start point to avoid null errors from get curr pos
  const [location, setLocation] = useState(false);

  // Define initial region
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  let position = region;
  const pos = Geolocation.getCurrentPosition(
    (position) => {
      const pos = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      console.log(pos)
    })
  if (pos != null){
    position = pos;
  }

  const ref = useCanvasRef();
  const paintRef = Skia.Paint();

  const mapRef = useRef<MapView>(null);
  const panGestureRef = useRef(Gesture.Pan()); // Ref for the Canvas gesture

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
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mapContainer}>
          <GestureDetector gesture={mapGesture}>
            <MapView
              ref={mapRef}
              style={StyleSheet.absoluteFillObject}
              initialRegion={position}
              showsUserLocation={true}
              showsMyLocationButton={true}
              followsUserLocation={true}
              customMapStyle={mapStyle}
              onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
            >

              <Marker
                coordinate={{
                  latitude: 37.78825,
                  longitude: -122.4324,
                }}
              />
            </MapView>
          </GestureDetector>

          <GestureDetector gesture={panGesture}>
            <FogOfWarCanvas region ={region} />
          </GestureDetector>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default Map;
