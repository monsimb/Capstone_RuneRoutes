//maps.tsx

import React, { useEffect, useState } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Button, Modal, TextInput, Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Location, { Location as LocationType } from 'react-native-location';
import Mapbox, { Camera, MarkerView, UserTrackingMode, LocationPuck, ShapeSource, FillLayer, LineLayer } from '@rnmapbox/maps';
import { MapView } from '@rnmapbox/maps';
import { booleanPointInPolygon, difference, featureCollection } from '@turf/turf';
import { circle } from "@turf/circle";
import { Feature } from 'geojson';
import { point } from "@turf/helpers";
// import { area } from "@turf/area";
import { launchImageLibrary } from 'react-native-image-picker';

import { styles } from '../styles/Map';
import DefaultPin from '../assets/defaultPin.png';

import { fetchPOIs, getPoiIcon, createPolygon } from '../functions/MapUtils';

import { MAP_BOX_ACCESS_TOKEN } from '@env';
import { CHOMP_DIAMETER, LOCATION_UPDATE_INTERVAL, DEFAULT_MAP_CENTER, DEFAULT_ZOOM_LEVEL } from '../functions/constants';


Mapbox.setAccessToken(MAP_BOX_ACCESS_TOKEN);


const Maps: React.FC = () => {
    const [userLocation, setUserLocation] = useState<LocationType | null>(null);
    const [initialUserLocation, setInitialUserLocation] = useState<LocationType | null>(null);
    const [staticPolygon, setStaticPolygon] = useState<Feature<polygon> | null>(null);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newImageUri, setNewImageUri] = useState<string | null>(null);
    const [currentCoordinates, setCurrentCoordinates] = useState<{ longitude: number; latitude: number } | null>(null);
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
    const [pois, setPois] = useState<{ id: string; name: string; latitude: number; longitude: number }[]>([]);
        //Marker State
    const [selectedMarker, setSelectedMarker] = useState<{
      id: string;
      title: string;
      description: string;
      imageUri: string | null;
    } | null>(null);
    type RouteParams = {
        fogOpacity?: number;
    };

    const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
    const { fogOpacity = 0.8 } = route.params || {}; // Default to 0.8 if no value is passed


    // Function to chomp away at fog polygon
    function subtractPoly() {
      if (!userLocation || !staticPolygon) return;
  
      const rad = CHOMP_DIAMETER;
      const centerPtn = point([userLocation.longitude, userLocation.latitude]);
      const playerCircle = circle(centerPtn, rad);
  
      // Subtract circle from fog polygon
      const fog = staticPolygon;
      const newFogLayer = difference(featureCollection([fog, playerCircle])); // Subtract circle from fog
  
      if (newFogLayer) {
        setStaticPolygon(newFogLayer);
        // console.log('Updated fog layer!!!!');
  
      } else {
        console.warn("Difference operation returned null, check polygon validity!");
      }
    };
    // User uploaded images (markers)
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
    // Place marker functionality
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
    // Handles clicking on markers
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
    // Handles clicking on map to create markers
    const handlePress = (e: any) => {
        // console.log("Map pressed", e);
        const coordinates = e.geometry ? e.geometry.coordinates : null;

        if (coordinates) {
            const [longitude, latitude] = coordinates;
            if(booleanPointInPolygon(coordinates, staticPolygon)) {
            // console.log("MARKER IN POLYGON!!!!")
            }
            //console.log("Coordinates:", longitude, latitude); // Log coordinates
            setCurrentCoordinates({ longitude, latitude });
            setModalVisible(true);
        } else {
            console.error("No coordinates found in event:", e);
        }
    };
  





    useEffect(() => {
      if (userLocation) {
          fetchPOIs(userLocation.latitude, userLocation.longitude, setPois);
      }
      // console.log(pois);
    }, [userLocation]);

    // Request permission and get user location. Create initial fog polygon.
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
    }, []); // will trigger only on load


    useEffect(() => {
        const interval = setInterval(() => {
            Location.getLatestLocation({ enableHighAccuracy: true })
                .then((location) => {
                    if (location) {
                        setUserLocation(location);
                    }
                })
                .catch(err => console.warn("Error fetching location:", err));
        }, LOCATION_UPDATE_INTERVAL);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setUserLocation((prevLocation) => {
                if (!prevLocation || !staticPolygon) return prevLocation;

                // chomp checker: y axis
                const upUser = point([(prevLocation.longitude + CHOMP_DIAMETER/8), prevLocation.latitude]);
                const downUser = point([(prevLocation.longitude - CHOMP_DIAMETER/8), prevLocation.latitude]);
                // chomp checker: x axis
                const rightUser = point([prevLocation.longitude, (prevLocation.latitude + CHOMP_DIAMETER/8)]);
                const leftUser = point([prevLocation.longitude, (prevLocation.latitude - CHOMP_DIAMETER/8)]);

                if (booleanPointInPolygon(upUser, staticPolygon) || booleanPointInPolygon(downUser, staticPolygon) || booleanPointInPolygon(rightUser, staticPolygon) || booleanPointInPolygon(leftUser, staticPolygon)) {
                    // console.log("USER OUTSIDE POLYGON");
                    subtractPoly();
                } else {
                    // console.log("USER INSIDE POLYGON");
                }

                return prevLocation; // React won't re-render if state doesn't change
            });
        }, LOCATION_UPDATE_INTERVAL);

        return () => clearInterval(interval);
    }, [staticPolygon]);




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
                centerCoordinate: DEFAULT_MAP_CENTER,
                zoomLevel: DEFAULT_ZOOM_LEVEL,
              }}
              followUserLocation={true}
              followUserMode={UserTrackingMode.Follow}
              followZoomLevel={20}
            />
            <LocationPuck
              puckBearing ='heading'
              bearingImage = 'compass'
              topImage='topimage'
              visible={true}
              scale={['interpolate', ['linear'], ['zoom'], 10, 1.0, 20, 4.0]}
              pulsing={{
                isEnabled: true,
                color: 'teal',
                radius: 50.0,
              }}
            />
            {/* Render POI markers */}
            {pois.map((poi) => (
                    <MarkerView key={poi.id} coordinate={[poi.longitude, poi.latitude]}>
                        <TouchableOpacity style={styles.markerViewContainer}>
                            <Image
                                source={getPoiIcon(poi.types)} // function to get diff icons 
                                style={{ width: 30, height: 30 }}
                            />
                            <View style={styles.markerTitleContainer}>
                                <Text style={styles.markerTitle}>{poi.name}</Text>
                            </View>
                        </TouchableOpacity>
                    </MarkerView>
                ))}
            
            <ShapeSource id="userPolygon" shape={staticPolygon}>
                <LineLayer
                sourceID="feature"
                id="reqId"
                style={{
                    lineColor: '#504ad4',
                    lineWidth: 5,
                }}
                />
                <FillLayer
                sourceID="feat"
                id="feat"
                style={{
                    fillColor: '#000000', // Color of the filled area
                    fillOpacity: fogOpacity,
                }}
                />
            </ShapeSource>
            {/* Render custom markers */}
            {markers.map((marker) => (
              <MarkerView key={marker.id} coordinate={[marker.longitude, marker.latitude]}>
                <TouchableOpacity
                onPress={() => handleMarkerPress(marker)}
                style={styles.markerViewContainer}
                >
                <Image
                  source={DefaultPin}
                  style={{ width: 30, height: 30 , borderRadius: 15 }}
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
          <Modal
                visible={isViewingMarker}
                animationType="slide"
                onRequestClose={() => setIsViewingMarker(false)}
                transparent={true}
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
        </MapView>
      </View>
    );
};

export default Maps;
