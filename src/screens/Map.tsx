import React from 'react';
import { SafeAreaView, View, Alert } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import {mapStyle, styles} from '../styles/Map';

function Map() {
    const initialRegion: Region = {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
            <MapView
            style={styles.mapStyle}
            initialRegion={initialRegion}
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
