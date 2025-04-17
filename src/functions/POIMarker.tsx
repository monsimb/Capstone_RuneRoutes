import React from 'react';
import { Image, TouchableOpacity, Text, View } from 'react-native';
import { MarkerView } from '@rnmapbox/maps';
import { getPoiIcon } from '../MapUtils';
import { styles } from '../styles/Map';

const POIMarker = ({ poi }) => (
  <MarkerView coordinate={[poi.longitude, poi.latitude]}>
    <TouchableOpacity style={styles.markerViewContainer}>
      <Image source={getPoiIcon(poi.types)} style={{ width: 40, height: 40 }} />
      <View style={styles.markerTitleContainer}>
        <Text style={styles.markerTitle}>{poi.name}</Text>
      </View>
    </TouchableOpacity>
  </MarkerView>
);

export default POIMarker;