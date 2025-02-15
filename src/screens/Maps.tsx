import React, { useEffect, useState } from 'react';
import { Button, Modal, TextInput, Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Mapbox, { MapView, Camera, MarkerView, UserTrackingMode, LocationPuck, ShapeSource, FillLayer, LineLayer } from '@rnmapbox/maps';
import Location, { Location as LocationType } from 'react-native-location';
import DefaultPin from '../assets/defaultPin.png';

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
  const [isViewingMarker, setIsViewingMarker] = useState(false);
  const handleDeleteMarker = (markerId: string) => {
    setMarkers(prevMarkers => prevMarkers.filter(marker => marker.id !== markerId));
    setIsViewingMarker(false);
    setSelectedMarker(null);
  };
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
    const offset = 0.01; // Increase this to make the polygon larger

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
                [longitude - offset-.005,latitude - offset+.01],

                [longitude - offset,latitude + offset],
                [longitude + offset,latitude + offset],
                [longitude + offset+.005,latitude + offset-.01]
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

      // Ray Casting Algo https://rosettacode.org/wiki/Ray-casting_algorithm
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
    launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 1200,
      maxWidth: 1200,
    }, (response) => {
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
    longitude: number;
    latitude: number;
    title: string;
    description: string;
    imageUri: string | null;
  }) => {
    setSelectedMarker(marker);
    setIsViewingMarker(true); // Show view modal instead of add modal
  };

  const ViewMarkerModal = () => (
    <Modal
      visible={isViewingMarker}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsViewingMarker(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {selectedMarker && (
            <>
              <Text style={styles.modalTitle}>{selectedMarker.title}</Text>
              
              {selectedMarker.imageUri ? (
                <Image
                  source={{ uri: selectedMarker.imageUri }}
                  style={styles.markerImage}
                />
              ) : (
                <View style={styles.noImageContainer}>
                  <Text style={styles.noImageText}>No image uploaded</Text>
                </View>
              )}
              
              <Text style={styles.descriptionLabel}>Description:</Text>
              <Text style={styles.descriptionText}>{selectedMarker.description}</Text>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.button, styles.deleteButton]}
                  onPress={() => handleDeleteMarker(selectedMarker.id)}
                >
                  <Text style={styles.buttonText}>Delete Marker</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.closeButton]}
                  onPress={() => setIsViewingMarker(false)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  
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
          followZoomLevel={13.5}
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

        {/*Will need to be changed so that only uses user location to create polygone 
          if there is no pre-existing user information (edge case, check if user is out of 
          bounds-> use location to create polygon*/} 
        {/* Add inverted polygon (filled outside) */}
        <ShapeSource id="userPolygon" shape={geoJson}> 
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
              fillColor: '#000000', // Color of the filled area
              fillOpacity: 0.8,
            }}
          />
        </ShapeSource>

        {/* Render custom markers */}
        {markers.map((marker) => (
          <MarkerView key={marker.id} coordinate={[marker.longitude, marker.latitude]}>
            <TouchableOpacity
            onPress={() => handleMarkerPress(marker)}
            style={styles.markerContainer}
          >
            <Image
              source={DefaultPin}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
            <View style={styles.markerTitleContainer}>
              <Text style={styles.markerTitle}>{marker.title}</Text>
            </View>
          </TouchableOpacity>
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

                  {/* Temp fix for button overlap issue */}
                  <View style={{marginBottom: 5}}>
                    <Button title="Upload Image" onPress={pickImage} color='#33CCFF'/>
                  </View>

                  <View style={{marginBottom: 5}}>
                    <Button title="Add Marker" onPress={handleAddMarker} color="#3B3456" />
                  </View>
                  <Button title="Cancel" onPress={() => setModalVisible(false)} color="#3B3456C7" />
                </View>
              </View>
            </Modal>
          <ViewMarkerModal /> 
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
  markerContainer: {
    alignItems: 'center',
  },
  markerTitleContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#5b4087',
  },
  markerTitle: {
    color: '#5b4087',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#5b4087',
    textAlign: 'center',
  },
  markerImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  noImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 15,
  },
  noImageText: {
    color: '#666',
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#5b4087',
  },
  descriptionText: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
    color: 'black'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
  },
  closeButton: {
    backgroundColor: '#5b4087',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'black'
  },
});

export default Maps;