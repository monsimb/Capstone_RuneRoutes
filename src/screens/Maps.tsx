import React, { useEffect, useState } from 'react';
import { Button, Modal, TextInput, Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Location, { Location as LocationType } from 'react-native-location';
import Mapbox, { MapView, Camera, MarkerView, UserTrackingMode, LocationPuck, ShapeSource, FillLayer, LineLayer } from '@rnmapbox/maps';
import { booleanTouches, booleanPointInPolygon, difference, featureCollection } from '@turf/turf';
import { circle } from "@turf/circle";
import { feature, polygon, point } from "@turf/helpers";
import { area } from "@turf/area";
import DefaultPin from '../assets/defaultPin.png';
import { styles } from '../styles/Map';
import { Feature, Point, GeoJsonProperties } from 'geojson';

const MAP_BOX_ACCESS_TOKEN = "pk.eyJ1IjoiYnJ5bGVyMSIsImEiOiJjbTM0MnFqdXkxcmR0MmtxM3FvOWZwbjQwIn0.PpuCmHlaCvyWyD5Kid9aPw";
Mapbox.setAccessToken(MAP_BOX_ACCESS_TOKEN);
// const DISTANCE_THRESHOLD = 0.0001; // Define the threshold for location change
const LOCATION_UPDATE_INTERVAL = 1000; // 10 seconds interval

const Maps: React.FC = () => {
  const [userLocation, setUserLocation] = useState<LocationType | null>(null);
  const [initialUserLocation, setInitialUserLocation] = useState<LocationType | null>(null);
  const [previousLocation, setPreviousLocation] = useState<LocationType | null>(null); // track the prev location
  const [staticPolygon, setStaticPolygon] = useState<Feature<polygon> | null>(null);
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

  // Request permission and get user location
  useEffect(() => {
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

              // Set initial location (on load) ONCE, never again
              if (!initialUserLocation) {
                setInitialUserLocation(location); // Initial location has been set
                // Now, it is important we generate the polygon hole here because we only want a new hole to generate on load and then we will modify/extend
                const fog = createPolygon(location.longitude, location.latitude);
                setStaticPolygon(fog);
              }

            })
            .catch(err => console.warn(err));
        }
      })
      .catch(err => console.warn('Permission denied:', err));
  }, []);


  const geoJson = staticPolygon ? staticPolygon : null;

  // Function to create a polygon around a given location
  const createPolygon = (longitude: number, latitude: number) => {
    // Define the offset for the polygon
    const offset = 0.0001; // Increase this to make the polygon larger

    // Outer boundary which covers the whole world
    const outerBoundary = [
      [-180, -90],
      [190, -90],
      [190, 90],
      [-170, 90],
      [-180, -90]
    ];

    // Inner hole. User's 'explored area'
   const hole = [
      [longitude - offset, latitude - offset],
      [longitude + offset, latitude - offset],
      [longitude + offset, latitude + offset],
      [longitude - offset, latitude + offset],
      [longitude - offset, latitude - offset]
    ];

    const turfPolygon = polygon([outerBoundary, hole]);
    return turfPolygon;
  };

  // Function to chomp away at fog polygon
  function subtractPoly() {
    if (!userLocation || !geoJson) return;

    const rad = 0.005;
    const centerPtn = point([userLocation.longitude, userLocation.latitude]);
    const playerCircle = circle(centerPtn, rad);

    // Subtract circle from fog polygon
    const fog = geoJson;
    const newFogLayer = difference(featureCollection([fog, playerCircle])); // Subtract circle from fog
    console.log(newFogLayer);
    console.log(area(geoJson));

    if (newFogLayer) {
      setStaticPolygon(newFogLayer);
      console.log('Updated fog layer!!!!');
      console.log(area(geoJson));

    } else {
      console.warn("Difference operation returned null, check polygon validity!");
    }
  }
  


  // Every time step, it checks if user is within Polygon, if outside-- triggers subtractPoly
  useEffect(() => {
    const interval = setInterval(() => {
      if (!userLocation || !geoJson) return;
  
      const now = Date.now();
      const pt = point([userLocation.longitude, userLocation.latitude]);

      // Check if the user is inside or outside the polygon
      if (booleanPointInPolygon(pt, geoJson)) {
        console.log("USER OUTSIDE POLYGON");
        subtractPoly(); // Call subtractPoly when user is outside the polygon
      } else {
        console.log("USER INSIDE POLYGON");
      }
  
      // Update the previous location timestamp
      setPreviousLocation({
        ...userLocation,
        timestamp: now,
      });
  
    }, LOCATION_UPDATE_INTERVAL); // Runs at the defined interval
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, [userLocation, geoJson]); // Dependencies ensure it resets if these change
  
  // checker for polygon updates
  useEffect(() => {
    if (geoJson) {
      // Trigger re-render when staticPolygon changes
      console.log("Static polygon updated:", geoJson);
    }
  }, [geoJson]); // Will trigger every time staticPolygon changes







  

  // Marker touch interaction handler
  const handlePress = (e: any) => {
    console.log("Map pressed", e);
    const coordinates = e.geometry ? e.geometry.coordinates : null;

    if (coordinates) {
      const [longitude, latitude] = coordinates;
      if(booleanPointInPolygon(coordinates, geoJson)) {
        console.log("MARKER IN POLYGON!!!!")
      }
      //console.log("Coordinates:", longitude, latitude); // Log coordinates
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
              
              <View style={styles.markerButtonContainer}>
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



  


  const handleMove = () => {
    if(userLocation) {
      setUserLocation(prev => ({
        latitude: prev!.latitude,
        longitude: prev!.longitude + 0.0001, // Simulating movement for testing purposes
        }));
    }
    if (userLocation && geoJson) {
      const pt = point([userLocation.longitude, userLocation.latitude]);
      if (booleanPointInPolygon(pt, geoJson)) {
        console.log("USER IN POLYGON");
        subtractPoly(); // Update fog layer if the user is inside the polygon
      }
    }
    // const pt = point([userLocation.longitude, userLocation.latitude]);
    // if(booleanPointInPolygon(pt,geoJson))
    // {
    //   console.log("USER IN POLYGON")
    // }
  };



 
  if (!userLocation) {
    return <View style={{ flex: 1 }} />; // Return blank until location is fetched
  }

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
          followZoomLevel={20}
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
        {geoJson && (
          <ShapeSource id="userPolygon" shape={staticPolygon} existing={true}>
            <LineLayer
              sourceID="userPolygon"
              id="lineLayer"
              style={{
                lineColor: '#ffffff',
                lineWidth: 10,
              }}
            />
            <FillLayer
              sourceID="userPolygon"
              id="fillLayer"
              style={{
                fillColor: '#000000',
                fillOpacity: 0,
              }}
            />
          </ShapeSource>
        )}


        {/*Will need to be changed so that only uses user location to create polygone
          if there is no pre-existing user information (edge case, check if user is out of
          bounds-> use location to create polygon*/}
        {/* Add inverted polygon (filled outside) */}
        <ShapeSource id="userPolygon" shape={staticPolygon}>
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
                    placeholderTextColor="#9989b3"
                    value={newTitle}
                    onChangeText={setNewTitle}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Description"
                    placeholderTextColor="#9989b3"
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
      {/* Move User Button */}
      <View style={{ position: 'absolute', bottom: 20, left: 20, zIndex: 100 }}>
        <Button title="Move User" onPress={handleMove} color="#33CCFF" />
      </View>
    
    </View>
  );
};

export default Maps;
