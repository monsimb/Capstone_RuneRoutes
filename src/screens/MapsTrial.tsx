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
const LOCATION_UPDATE_INTERVAL = 100; // 10 seconds interval
const OFFSET = 0.0001;  // Increase this to make the polygon larger (OFFSET from the user location)

const Maps: React.FC = () => {
    const [userLocation, setUserLocation] = useState<LocationType | null>(null);
    const [initialUserLocation, setInitialUserLocation] = useState<LocationType | null>(null);
    const [staticPolygon, setStaticPolygon] = useState<Feature<polygon> | null>(null);

    // Function to create a polygon around a given location
    const createPolygon = (longitude: number, latitude: number) => {
        // Define the OFFSET for the polygon
        // const OFFSET = 0.0001; // Increase this to make the polygon larger

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
            [longitude - OFFSET, latitude - OFFSET],
            [longitude + OFFSET, latitude - OFFSET],
            [longitude + OFFSET, latitude + OFFSET],
            [longitude - OFFSET, latitude + OFFSET],
            [longitude - OFFSET, latitude - OFFSET]
        ];

        const turfPolygon = polygon([outerBoundary, hole]);
        return turfPolygon;
        };
    
    // Function to chomp away at fog polygon
      function subtractPoly() {
        if (!userLocation || !staticPolygon) return;
    
        const rad = 0.005;
        const centerPtn = point([userLocation.longitude, userLocation.latitude]);
        const playerCircle = circle(centerPtn, rad);
    
        // Subtract circle from fog polygon
        const fog = staticPolygon;
        const newFogLayer = difference(featureCollection([fog, playerCircle])); // Subtract circle from fog
        console.log(area(staticPolygon));
    
        if (newFogLayer) {
          setStaticPolygon(newFogLayer);
          console.log('Updated fog layer!!!!');
          console.log(area(staticPolygon));
    
        } else {
          console.warn("Difference operation returned null, check polygon validity!");
        }
      };

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

    // Request permission and get user location. Create initial fog polygon
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
                
                const userPoint = point([prevLocation.longitude, prevLocation.latitude]);
    
                if (booleanPointInPolygon(userPoint, staticPolygon)) {
                    console.log("USER OUTSIDE POLYGON");
                    subtractPoly();
                } else {
                    console.log("USER INSIDE POLYGON");
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
                centerCoordinate: [-77.036086, 38.910233],
                zoomLevel: 8,
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
        </MapView>
    </View>
    );
};

export default Maps;
