//maps.tsx


import React, { useEffect, useRef, useState } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Button, Modal, TextInput, Image, View, Text, TouchableOpacity, Touchable } from 'react-native';
import Location, { Location as LocationType } from 'react-native-location';
import Mapbox, { Camera, MarkerView, UserTrackingMode, LocationPuck, ShapeSource, FillLayer, LineLayer } from '@rnmapbox/maps';
import { MapView } from '@rnmapbox/maps';
import { booleanPointInPolygon, difference, featureCollection } from '@turf/turf';
import { circle } from "@turf/circle";
import { Feature, Polygon, MultiPolygon } from 'geojson';
import { point } from "@turf/helpers";
import { area } from "@turf/area";
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuth0 } from 'react-native-auth0';

import { styles } from '../styles/Map';
import { ICONS, ICON_SIZE } from '../functions/constants';

import { fetchPOIs, getPoiIcon, createPolygon, getDirections } from '../functions/MapUtils';

import { MAP_BOX_ACCESS_TOKEN } from '@env';
import { CHOMP_DIAMETER, LOCATION_UPDATE_INTERVAL, DEFAULT_MAP_CENTER, DEFAULT_ZOOM_LEVEL } from '../functions/constants';
import { useProfileContext } from '../context/ProfileContext';


Mapbox.setAccessToken(MAP_BOX_ACCESS_TOKEN);



const Maps: React.FC = () => {
    const { authorize, getCredentials, user } = useAuth0();
    const userId = user?.sub;
    const [userLocation, setUserLocation] = useState<LocationType | null>(null);
    const [initialUserLocation, setInitialUserLocation] = useState<LocationType | null>(null);
    const [staticPolygon, setStaticPolygon] = useState<Feature<Polygon | MultiPolygon> | null>(null); // Added multipolygon
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
    const [pois, setPois] = useState<{ id: string; name: string; latitude: number; longitude: number, types: [] }[]>([]);
    const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
        //Marker State
    const [selectedMarker, setSelectedMarker] = useState<{
      id: string;
      title: string;
      description: string;
      imageUri: string | null;
    } | null>(null);
    const [chompedArea, setChompedArea] = useState(0);
    type RouteParams = {fogOpacity?: number;};
    const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
    const { fogOpacity = 0.8 } = route.params || {}; // Default to 0.8 if no value is passed
    const { setTotalExploredArea } = useProfileContext();
    const [recenter, setRecenter] = useState(false);
    const cameraRef = useRef<Camera>(null);
    const recenterMap = () => {
      setRecenter(true);
    };
    const [routeCoords, setRouteCoords] = useState<number[][] | null>(null);
    const fetchedTilesRef = useRef<Set<string>>(new Set());


    function getTileId(lat: number, lon: number, tileSize = 0.01): string {
      // NOTE: tileSize represents 0.01 = ~1km
      const latTile = Math.floor(lat / tileSize);
      const lonTile = Math.floor(lon / tileSize);
      return `${latTile}_${lonTile}`;       // ex. tileId = "3254_-9743"    when  lat = 32.54123 lon = -97.42187 tileSize = 0.01
    }

    // Function to chomp away at fog polygon
    async function subtractPoly() {
      if (!userLocation || !staticPolygon) return;
  
      const rad = CHOMP_DIAMETER;
      const centerPtn = point([userLocation.longitude, userLocation.latitude]);
      const playerCircle = circle(centerPtn, rad);
  
      // Subtract circle from fog polygon
      const fog = staticPolygon;  // starting poly
      const newFogLayer = difference(featureCollection([fog, playerCircle])); // subtract circle from fog
  
      if (newFogLayer) {
        //  !! CURRENTLY DOESN'T account for the initial square !!

        const originalFogArea = area(fog);            // Calculate the area that was already cleared
        const newFogArea = area(newFogLayer);         // Calculate the area of the new fog polygon

        const chomped = originalFogArea - newFogArea; // Calculate the area that has been chomped

        // console.log(`Original fog area: ${originalFogArea} square meters`);
        // console.log(`New fog area: ${newFogArea} square meters`);
        // console.log(`Chomped area: ${chompedArea} square meters`);

        setChompedArea(chomped); // Update state with the chomped area
        setStaticPolygon(newFogLayer);
        setTotalExploredArea((prevTotal) => prevTotal + chomped); // Add the chomped area to the total


        try {
          //const creds = await getCredentials();
          //const token = creds?.accessToken;
          //if(token && user?.sub) {
          //  await saveFogToBackend(newFogLayer);
          //}
          await saveFogToBackend(newFogLayer);
          console.log("SAVED FOG SUCCESSFULLY ( I THINK? )");
        } catch (err: any) {
          console.error('Failed to save fog state:', err);
        }

        // //console.log('Updated fog layer!!!!');
  
      } else {
        console.warn("Difference operation returned null, check polygon validity!");
      }
    }

    async function fetchFogFromBackend(userId: string, token: string): Promise<Feature<Polygon | MultiPolygon> | null> {
      const response = await fetch (`https://capstone-runeroutes-wgp6.onrender.com/auth/users/${userId}/fog`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if(!response.ok) {
        throw new Error(`Fetch fog failed ${response.status}`);
      }
      return (await response.json()).fog;
    }

    async function saveFogToBackend(fog: Feature<Polygon | MultiPolygon>) {

      if(!userId) {
        return;
      }

      const creds = await getCredentials();
      const token = creds?.accessToken;

      if(!token) {
        console.warn("No Auth0 token. Skipping fog save");
        return;
      }

      const response = await fetch(`https://capstone-runeroutes-wgp6.onrender.com/auth/users/${userId}/fog`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ fog }),
      });
      if(!response.ok) {
        throw new Error(`Save fog failed ${response.status}`);
      }
    }
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
    
    // Camera re-center
    useEffect(() => {
      if (userLocation && cameraRef.current && recenter){
        cameraRef.current?.flyTo([userLocation.longitude, userLocation.latitude], 1000); // Fly to the user's location
        cameraRef.current?.setCamera({
          centerCoordinate: [userLocation.longitude, userLocation.latitude],
          zoomLevel: 20,
          animationMode: 'flyTo',
        });
        setRecenter(false);
      }
    }, [recenter]);




    // Tile
    useEffect(() => {
      if (!userLocation) return;
    
      const fetchAndCacheTile = async () => {
        const tileId = getTileId(userLocation.latitude, userLocation.longitude);
    
        if (!fetchedTilesRef.current.has(tileId)) {
          try {
            const cached = await AsyncStorage.getItem(`poi_tile_${tileId}`);
            if (cached) {
              const pois = JSON.parse(cached);
              setPois((prev) => [...prev, ...pois]); // or dedupe
              fetchedTilesRef.current.add(tileId);
              console.log('tile cached');
            } else {
              fetchPOIs(userLocation.latitude, userLocation.longitude, async (data) => {
                setPois((prev) => [...prev, ...data]); // or dedupe
                fetchedTilesRef.current.add(tileId);
                await AsyncStorage.setItem(`poi_tile_${tileId}`, JSON.stringify(data));
                console.log('tile fetched');
              });
            }
          } catch (error) {
            console.error('AsyncStorage error:', error);
          }
        }
      };
    
      fetchAndCacheTile();
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
                          //const fog = createPolygon(location.longitude, location.latitude);
                          //setStaticPolygon(fog);

                          let fog: Feature<Polygon> | null = null; // fog variable

                          if(user?.sub) {
                            return getCredentials()
                              .then(({ accessToken }) => fetchFogFromBackend(user.sub, accessToken))
                              .catch(() => null)
                              .then(serverFog => {
                                const fogToUse = serverFog || createPolygon(location.longitude, location.latitude);
                                setStaticPolygon(fogToUse);
                              });
                          } else {
                            const fog = createPolygon(location.longitude, location.latitude); 
                            setStaticPolygon(fog);
                          }
                      }
                  })
                  .catch(err => {
                    console.warn(err)
                  });
            }
        })
        .catch(err => console.warn('Permission denied:', err));
    }, [user]);         // will trigger only on load

    // Dynamic user location
    useEffect(() => {
      const interval = setInterval(async () => {
        if (!user) return; // <- User not authenticated, bail out
    
        const location = await Location.getLatestLocation({ enableHighAccuracy: true });
        if (location) {
          setUserLocation(location);
          //await syncLocationToBackend(location.latitude, location.longitude);
        }
      }, LOCATION_UPDATE_INTERVAL);
    
      return () => clearInterval(interval);
    }, [user]); // Only run this effect once user is available

    // Discover 'fog chomp' main logic
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
              ref={cameraRef}
              defaultSettings={{
                centerCoordinate: DEFAULT_MAP_CENTER,
                zoomLevel: DEFAULT_ZOOM_LEVEL,
              }}
              followUserLocation={!recenter}
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
                    <MarkerView 
                      key={poi.id} 
                      coordinate={[poi.longitude, poi.latitude]}>
                        <TouchableOpacity 
                        onPress={() => setSelectedPOI(poi)}
                        style={styles.markerViewContainer}
                        >
                            <Image
                                source={poi.types ? getPoiIcon(poi.types) : ICONS.DEFAULT} // function to get diff icons 
                                style={{ width: ICON_SIZE, height: ICON_SIZE }}
                            />
                            <View style={styles.markerTitleContainer}>
                                <Text style={styles.markerTitle}>{poi.name}</Text>
                            </View>
                        </TouchableOpacity>
                    </MarkerView>
                ))}
            <Modal
              visible={!!selectedPOI}
              transparent
              animationType="slide"
              onRequestClose={() => setSelectedPOI(null)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{selectedPOI?.name}</Text>
                  <Text style={styles.descriptionText}>{selectedPOI?.types}</Text>
                  <Text style={styles.descriptionText}>⭐ Rating: {selectedPOI?.rate}: 'N/A'</Text>
                  <Button title="Route" onPress={() =>{
                    if (userLocation && selectedPOI) {
                      getDirections(
                        userLocation.latitude,
                        userLocation.longitude,
                        selectedPOI.latitude,
                        selectedPOI.longitude,
                        setRouteCoords 
                      );
                      setSelectedPOI(null);
                  }}} />
                  <Button title="Close" onPress={() => setSelectedPOI(null)} />
                </View>
              </View>
            </Modal>
            {routeCoords && <ShapeSource
              id="routeSource"
              shape={{
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: routeCoords,
                },
              }}>
                <LineLayer
                  id="routeLine"
                  style={{
                    lineColor: '#007AFF',
                    lineWidth: 5,
                    lineJoin: 'round',
                    lineCap: 'round',
                }}
              />
              </ShapeSource>
            
            }

            
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
                  source={ICONS.CUSTOM}
                  style={{ width: ICON_SIZE, height: ICON_SIZE , borderRadius: ICON_SIZE }}
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
        <View style={styles.recenterButtonContainer}>
          <TouchableOpacity style={styles.recenterButton} onPress={recenterMap}>
            <Image
              source={require("../assets/icon/recenter.png")}
              style={{ width: 35, height: 35 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
};

export default Maps;
