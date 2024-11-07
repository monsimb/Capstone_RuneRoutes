/** 
 * Map.tsx
 * Responsible for creating the map, retrieving user location, and allowing custom markers.
 * @returns Map page.
*/

import React, { useRef, useState } from 'react';
import Geolocation from '@react-native-community/geolocation';
import {mapStyle, styles} from '../styles/Map';
import { Button, Modal, SafeAreaView, StyleSheet, TextInput, View, } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
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

  // Function to handle adding a new custom marker on the map
  const [markers, setMarkers] = useState<{ latitude: number; longitude: number; key: string; title: string; description: string;pinColor?: string }[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<any>(null); // Store selected marker to edit
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  
  const handleAddMarker = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const newMarker = {
      latitude,
      longitude,
      key: `${latitude}-${longitude}`,
      title: '',
      description: '',
      pinColor: '#3B3456',
    };

    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
  };

  const handleMarkerPress = (marker: any) => {  // Function to handle marker press (for editing)
    setSelectedMarker(marker);
    setNewTitle(marker.title);
    setNewDescription(marker.description);
    setModalVisible(true); // Open the modal to edit the marker
  };

  const handleUpdateMarker = () => {  // Function to update the marker information
    if (selectedMarker) {
      const updatedMarkers = markers.map((marker) =>
        marker.key === selectedMarker.key
          ? { ...marker, title: newTitle, description: newDescription }
          : marker
      );
      setMarkers(updatedMarkers);
    }
    setModalVisible(false); // Close modal after update
  };



  const mapRef = useRef<MapView>(null);
  const panGestureRef = useRef(Gesture.Pan()); // Ref for the Canvas gesture

  // Test coordinates
  const mapGesture = Gesture.Pan().simultaneousWithExternalGesture(panGestureRef);

  // const panGesture = Gesture.Pan()
  //   .onChange((e) => {
  //     console.log("Pan on Canvas:", e.translationX, e.translationY);

  //     // Update map region based on pan movement
  //     const newRegion = {
  //       ...region,
  //       latitude: region.latitude + e.translationY * 0.0001, // Scale movement as needed
  //       longitude: region.longitude - e.translationX * 0.0001,
  //     };
  //     setRegion(newRegion);

  //     // Programmatically animate MapView to the new region
  //     mapRef.current?.animateToRegion(newRegion, 100);
  //   })
  // .withRef(panGestureRef);

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
              onPress={handleAddMarker} // Add marker when map is tapped
              >
                {markers.map((marker) => (
                <Marker
                  key={marker.key}
                  coordinate={{
                    latitude: marker.latitude,
                    longitude: marker.longitude,
                  }}
                  title={marker.title}
                  description={marker.description}
                  pinColor={marker.pinColor}
                  onPress={() => handleMarkerPress(marker)} // Open edit form when marker is tapped
                />
              ))}
            </MapView>
          </GestureDetector>

          {/* <GestureDetector gesture={panGesture}>
            <FogOfWarCanvas region ={region} />
          </GestureDetector> */}
        </View>
        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
          transparent={true}
        >
          <View style={styles.modalOverlay}>
           <View style={styles.modalContent}>
            <TextInput
              placeholder="Title"
              value={newTitle}
              onChangeText={setNewTitle}
              style={styles.input}
            />
            <TextInput
              placeholder="Description"
              value={newDescription}
              onChangeText={setNewDescription}
              style={styles.input}
            />
            <Button title="Update Marker" onPress={handleUpdateMarker} color="#3B3456" />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="#3B3456C7" />
              </View>
          </View>
        </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}


export default Map;
