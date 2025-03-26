import React, { useEffect, useState } from 'react';
import { Button, Modal, TextInput, Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Location, { Location as LocationType } from 'react-native-location';
import Mapbox, { MapView, Camera, MarkerView, UserTrackingMode, LocationPuck, ShapeSource, FillLayer, LineLayer } from '@rnmapbox/maps';
import { booleanTouches, booleanPointInPolygon, difference, featureCollection } from '@turf/turf';
import { circle } from "@turf/circle";
import { feature, polygon, point } from "@turf/helpers";
import DefaultPin from '../assets/defaultPin.png';
import { styles } from '../styles/Map';

const MAP_BOX_ACCESS_TOKEN = "pk.eyJ1IjoiYnJ5bGVyMSIsImEiOiJjbTM0MnFqdXkxcmR0MmtxM3FvOWZwbjQwIn0.PpuCmHlaCvyWyD5Kid9aPw";
Mapbox.setAccessToken(MAP_BOX_ACCESS_TOKEN);
const DISTANCE_THRESHOLD = 0.0001; // Define the threshold for location change
const LOCATION_UPDATE_INTERVAL = 1000; // 10 seconds interval


/*interface Marker {
  id: string;
  longitude: number;
  latitude: number;
}*/

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


  // 'pseudo code' for database store of poly
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
    const offset = 0.00001; // Increase this to make the polygon larger

    // Outer boundary which covers the whole world
    const outerBoundary = [
      [-180, -90],
      [190, -90],
      [190, 90],
      [-170, 90],
      [-180, -90]
    ];

    // Inner hole. User 'explored area'
   const hole = [
      [longitude - offset, latitude - offset],
      [longitude + offset, latitude - offset],
      [longitude + offset, latitude + offset],
      [longitude - offset, latitude + offset],
      [longitude - offset, latitude - offset]
    ];


    // Create the coordinates for the polygon
    /*
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
    */
    const turfPolygon = polygon([outerBoundary, hole]);
    //console.log(turfPolygon); // debug for Joseph(me)
    return turfPolygon;
  };

  // Expansion logic
  {/*
    1. if Circle around user (based on location), if boolean touches polyedge
          turf.booleanTouches(point,line)
    2. push points out
    
    */}

  function subtractPoly() {
    if (!userLocation || !staticPolygon) return;

    const rad = 0.01;
    const centerPtn = point([userLocation.longitude, userLocation.latitude]);
    const playerCircle = circle(centerPtn, rad);  // in an effor t to limit points stored, we should think about changing this to poly (used circle for ease of testing)

    // polygon difference (subtract player circle from fog poly)
    const fog = staticPolygon;
    const newFogLayer = difference(featureCollection([fog, playerCircle])); // Subtract circle from fog
    setStaticPolygon(newFogLayer); // Update the polygon state

    // Log the difference
    console.log('Updated fog layer!!!!', newFogLayer);
  }





  useEffect(() => {
    const interval = setInterval(() => {
      if (!userLocation || !staticPolygon) return;
  
      const now = Date.now();
      const pt = point([userLocation.longitude, userLocation.latitude]);
  
      // Check if the user is inside or outside the polygon
      if (booleanPointInPolygon(pt, staticPolygon)) {
        console.log("USER INSIDE POLYGON");
      } else {
        console.log("USER OUTSIDE POLYGON");
        subtractPoly(); // Call subtractPoly when user is outside the polygon
      }
  
      // Update the previous location timestamp
      setPreviousLocation({
        ...userLocation,
        timestamp: now,
      });
  
    }, LOCATION_UPDATE_INTERVAL); // Runs at the defined interval
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, [userLocation, staticPolygon]); // Dependencies ensure it resets if these change


// tracking user movement and checking if user is inside or outside the polygon
useEffect(() => {
  if (!userLocation || !staticPolygon) return;

  const now = Date.now();
  const timeSinceLastCheck = now - (previousLocation?.timestamp || 0); // Calculate time elapsed since last check

  console.log(timeSinceLastCheck);

  // ONLY check if the interval has passed since the last check
  if (timeSinceLastCheck > LOCATION_UPDATE_INTERVAL) {
    const pt = point([userLocation.longitude, userLocation.latitude]);

    // check if the user is inside or outside the polygon
    if (booleanPointInPolygon(pt, staticPolygon)) {
      console.log("USER INSIDE POLYGON");
    } else {
      console.log("USER OUTSIDE POLYGON");
      subtractPoly(); // Call subtractPoly when user is outside the polygon
    }

    // Update the previous location after the check
    setPreviousLocation({
      ...userLocation,
      timestamp: now, // add timestamp to track when location was last checked
    });
  }
}, [userLocation,staticPolygon]); // Trigger when user's location or polygon changes

  

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
  const geoJson = staticPolygon ? staticPolygon : null;

  // const handleMove = () => {
  //   if(userLocation) {
  //     setUserLocation(prev => ({
  //       latitude: prev!.latitude,
  //       longitude: prev!.longitude + 0.001, // Simulating movement for testing purposes
  //       }));
  //   }
  //   console.log(userLocation);
  //   if (userLocation && geoJson) {
  //     const pt = point([userLocation.longitude, userLocation.latitude]);
  //     if (booleanPointInPolygon(pt, geoJson)) {
  //       console.log("USER IN POLYGON");
  //       subtractPoly();
  //     }
  //   }
  //   // const pt = point([userLocation.longitude, userLocation.latitude]);
  //   // if(booleanPointInPolygon(pt,geoJson))
  //   // {
  //   //   console.log("USER IN POLYGON")
  //   // }
  // };

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

  if (!userLocation) {
    return <View style={{ flex: 1 }} />; // Return blank until location is fetched
  }

  // const geoJson = createPolygon(userLocation.longitude, userLocation.latitude); // Generate polygon based on user location



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
          <ShapeSource id="userPolygon" shape={geoJson} existing={true}>
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
                fillOpacity: 0.8,
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
      {/* Move User Button */}
      <View style={{ position: 'absolute', bottom: 20, left: 20, zIndex: 100 }}>
        <Button title="Move User" onPress={handleMove} color="#33CCFF" />
      </View>
    
    </View>
  );
};

export default Maps;
