import React, { useEffect, useState } from 'react';
import { Button, Modal, TextInput, Image, View, Text, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Mapbox, { MapView, Camera, MarkerView, UserTrackingMode, LocationPuck, ShapeSource, FillLayer, LineLayer } from '@rnmapbox/maps';
import Location, { Location as LocationType } from 'react-native-location';
import DefaultPin from '../assets/defaultPin.png';
import { styles } from '../styles/Map';
import * as turf from '@turf/turf';

Mapbox.setAccessToken("pk.eyJ1IjoiYnJ5bGVyMSIsImEiOiJjbTM0MnFqdXkxcmR0MmtxM3FvOWZwbjQwIn0.PpuCmHlaCvyWyD5Kid9aPw");

/*interface Marker {
  id: string;
  longitude: number;
  latitude: number;
}*/

const Maps: React.FC = () => {
  const [userLocation, setUserLocation] = useState<LocationType | null>(null);
  const [initialUserLocation, setInitialUserLocation] = useState<LocationType | null>(null);
  const [staticPolygon, setStaticPolygon] = useState<turf.Feature<turf.Polygon> | null>(null);
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
    const offset = 0.001; // Increase this to make the polygon larger

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
    const turfPolygon = turf.polygon([outerBoundary, hole]);
    //console.log(turfPolygon); // debug for Joseph(me)
    return turfPolygon;
  };


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

              // Set initial location (on load) ONCE, never again
              if (!initialUserLocation) {
                setInitialUserLocation(location); // Initial location has been set
                // Now it is important we generate the polygon hole here because we only want a new hole to generate on load and then we will modify/extend
                const poly = createPolygon(location.longitude, location.latitude);
                setStaticPolygon(poly);
              }

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
      if(turf.booleanPointInPolygon(coordinates, geoJson)) {
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
    launchImageLibrary(
      {}, 
      (response) => {
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

  const handleMove = () => {
    if(userLocation) {
      setUserLocation(prev => ({
        latitude: prev!.latitude,
        longitude: prev!.longitude + 0.5,
        }));
      }
    console.log(userLocation);
    const pt = turf.point([userLocation.longitude, userLocation.latitude]);
    if(turf.booleanPointInPolygon(pt,geoJson))
    {
      console.log("USER IN POLYGON")
    }
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



export default Maps;