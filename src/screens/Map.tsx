/** 
 * Map.tsx
 * Responsible for creating the map, and retrieving user location.
 * @returns Map page.
*/

import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Alert } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {mapStyle, styles} from '../styles/Map';

function Map() {
  // User location nonsense
  // TODO: change so that it no longer requires a fixed start point to avoid null errors from get curr pos
  const [location, setLocation] = useState(false);
  const initialRegion: Region = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  let position = initialRegion;
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

  return (
      <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
          <MapView
          style={styles.mapStyle}
          initialRegion={position}
          showsUserLocation={true}
          showsMyLocationButton={true}
          followsUserLocation={true}
          customMapStyle={mapStyle}>
          <Marker
              draggable
              coordinate={{
              latitude: 37.78825,
              longitude: -122.4324,
              }}
              onDragEnd={(e) => Alert.alert('New Coordinates', JSON.stringify(e.nativeEvent.coordinate))}
              title={'Test Marker'}
              description={'This is a description of the marker'}
          />
          </MapView>
      </View>
      </SafeAreaView>
  );
}

export default Map
