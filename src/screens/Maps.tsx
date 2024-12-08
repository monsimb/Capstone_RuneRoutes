import React, { useEffect, useState } from 'react';
import { Button, Modal, TextInput, Image, View, Text, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Mapbox, {MapboxGL, MapView, Camera, MarkerView, UserTrackingMode, LocationPuck, ShapeSource, FillLayer, LineLayer } from '@rnmapbox/maps';
import Location, { Location as LocationType } from 'react-native-location';
import DefaultPin from './Assets/Markers/defaultPin.png';

Mapbox.setAccessToken("pk.eyJ1IjoiYnJ5bGVyMSIsImEiOiJjbTM0MnFqdXkxcmR0MmtxM3FvOWZwbjQwIn0.PpuCmHlaCvyWyD5Kid9aPw");

/*interface Marker {
  id: string;
  longitude: number;
  latitude: number;
}*/

const Maps: React.FC = () => {
  const [userLocation, setUserLocation] = useState<LocationType | null>(null);
  const [markers, setMarkers] = useState<{
    id: string;
    longitude: number;
    latitude: number;
    title: string;
    description: string;
    imageUri: string | null;
  }[]>([]); // Store custom markers
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImageUri, setNewImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentCoordinates, setCurrentCoordinates] = useState<{ longitude: number; latitude: number } | null>(null);
  


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

  //TODO: CreateRemovalPolygon() - Create a function that creates a Polygon on user's location. 
  //      Preferably a circle.
  //      The purpose of this circle will be to eventually be subtracted from the large polygon that will cover the whole earth. 
  //      This function will do no more than create the polygon but it should be different from the fog polygon because we want different color/opacity.
  //      Eventually, it will probably be transparent and then it will be subtracted from the large polygon.

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
              //TODO: Call CreateRemovalPolygon and create a removalPolygon at the user's location. 
              //      Will need to have a check so we're not making polygons in areas that have been cleared already. 
              //      Will also need to make a useState most likely so we can overcome scope issues.

              //TODO: Sometime after a removalPolygon has been created, it will be removed from the large polygon with Turf.JS
              //      This can probably be done here as the removalPolygon will be created and instantly removed
              //      from the fogPolygon
            })
            .catch(err => console.warn(err));
        }
      })
      .catch(err => console.warn('Permission denied:', err));
  }, []);

  // Marker touch interaction handler
  const handlePress = (e: any) => {
    console.log("Map pressed", e); 
    const coordinates = e.geometry ? e.geometry.coordinates : null;
  
    if (coordinates) {
      const [longitude, latitude] = coordinates;
      console.log("Coordinates:", longitude, latitude); // Log coordinates
      setCurrentCoordinates({ longitude, latitude });
      setModalVisible(true);
    } else {
      console.error("No coordinates found in event:", e);
    }
  };
  
  // User uploaded images
  const pickImage = () => {
    launchImageLibrary({}, (response) => {
      if (response.assets && response.assets.length > 0) {
        setNewImageUri(response.assets[0].uri || null);
      }
    });
  };

  // Place markrer function
  const handleAddMarker = () => {
    if (currentCoordinates) {
      setMarkers((prevMarkers) => [
        ...prevMarkers,
        {
          id: Math.random().toString(),
          longitude: currentCoordinates.longitude,
          latitude: currentCoordinates.latitude,
          title: newTitle,
          description: newDescription,
          imageUri: newImageUri,
        },
      ]);
    }
    setModalVisible(false);
    setNewTitle('');
    setNewDescription('');
    setNewImageUri(null);
  };

  //Marker State
  const [selectedMarker, setSelectedMarker] = useState<{
    id: string;
    title: string;
    description: string;
    imageUri: string | null;
  } | null>(null);

  //Marker click handler
  const handleMarkerPress = (marker: {
    id: string;
    title: string;
    description: string;
    imageUri: string | null;
  }) => {
    setSelectedMarker(marker); // Set the selected marker details
    setModalVisible(true); // Show the modal
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
            <View style={{ alignItems: 'center' }}>
              <Image
                source={DefaultPin} // Rune R
                style={{ width: 50, height: 50, borderRadius: 25 }}
              />
              <Text style={{ fontWeight: 'bold' }}>{marker.title}</Text>
              <Text>{marker.description}</Text>
            </View>
          </MarkerView>
          ))}
          {/* Modal for adding marker details */}
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
                  <Button title="Upload Image" onPress={pickImage} color='#33CCFF' />
                  <Button title="Add Marker" onPress={handleAddMarker} color="#3B3456" />
                  <Button title="Cancel" onPress={() => setModalVisible(false)} color="#3B3456C7" />
                </View>
              </View>
            </Modal>
            
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5, 
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default Maps;