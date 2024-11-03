import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Button, Alert } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import LoginScreen from './LoginScreen'; // Import the LoginScreen component

const App: React.FC = () => {
  // State to manage if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Define the initial region for the map
  const initialRegion: Region = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // State to toggle between custom map style and default style
  const [useCustomMapStyle, setUseCustomMapStyle] = useState(true);

  const toggleMapStyle = () => {
    setUseCustomMapStyle((prevStyle) => !prevStyle);
  };

  // Function to handle successful login
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <MapView
          style={styles.mapStyle}
          initialRegion={initialRegion}
          customMapStyle={useCustomMapStyle ? mapStyle : []}
        >
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
        <View style={styles.buttonContainer}>
          <Button title={useCustomMapStyle ? "Use Default Style" : "Use Custom Style"} onPress={toggleMapStyle} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default App;

const mapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  // Additional map styling as needed...
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapStyle: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer: {
    position: 'absolute',
    top: 20,
    left: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
});
