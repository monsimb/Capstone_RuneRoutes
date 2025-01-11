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
  


  const savePolygonToDatabase = async (polygonData: any)=>{
    // TODO: im just mocking some stuff, we need to fill in with how we are actually hitting our DB
    try{
      const response = await fetch("http of db api",{
        method: 'POST',
        headers: {},
        body: JSON.stringify({
          coordinates:polygonData,
          created_at: new Date().toISOString(),
        }),
      });
      const result = await response.json();
      if (result.ok) {
        console.log('Poly save success', result);
      }
      else{
        console.error('Poly save FAILURE', result);
      }
    }
    catch(error){
      console.error('Error saving polygon', error);
    }
  };

  // Function to create a polygon around a given location
  const createPolygon = (longitude: number, latitude: number) => {
    // Define the offset for the polygon
    const offset = 0.03; // Increase this to make the polygon larger

    // Create the coordinates for the polygon
    const polygonData= {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-180,-90],
                [190,-90],
                [190,90],
                [-170,90],
                [-170,-90]
              ],
              // hole in polygone coords
               [
                [longitude + offset,latitude - offset],
                [longitude - offset,latitude - offset],
                [longitude - offset,latitude + offset],
                [longitude + offset,latitude + offset],

                [longitude + offset+.01,latitude + offset-.03]
              ]
            ],
          },
        },
      ],
    };
    // Call to function to save poly data to DB
    // savePolygonToDatabase(polygonData.features[0].geometry.coordinates);

    return polygonData;
  };

  const isPointInPolygon = (point: {latitude: number, longitude: number}, polygon: number[][][]): boolean => {
    // UNTESTED -> this is for checking if user is within known poly (info should come from db or cache)
    const x = point.longitude;
    const y = point.latitude;
    let inside = false;

    for (let i = 0, j = polygon[0].length - 1; i < polygon[0].length; j = i++){
      const xi = polygon[0][i][0];
      const yi = polygon[0][i][1];
      const xj = polygon[0][j][0];
      const yj = polygon[0][j][1];

      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi)/(yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }


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
        showUserLocation={true} // Show user location on map
        onPress={handlePress} // Handle press to add custom marker
      >
        <Camera
          defaultSettings={{
            centerCoordinate: [-77.036086, 38.910233],
            zoomLevel: 8,
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
          {/*Will need to be changed so that only uses user location to create polygone 
          if there is no pre-existing user information (edge case, check if user is out of 
          bounds-> use location to create polygon*/}      
          <LineLayer
            sourceID="feature"
            id="reqId"
            style={{
              lineColor: '#ffffff',
              lineWidth: 10,
            }}
          />
          <FillLayer
            sourceID="feat"
            id="feat"
            style={{
              // Fill outside the polygon (the area surrounding it)
              fillColor: '#000000', // Color of the filled area
              fillOpacity: 0.8,
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