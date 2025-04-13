// includes functions for retrieving POI's, setting POI's icon, and creating initial polygon


import axios from 'axios';
import { polygon } from '@turf/helpers';
import { ICONS } from './constants';
import { GOOGLE_PLACES_ACCESS_TOKEN } from '@env';

export const fetchPOIs = async (latitude, longitude, setPois) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location: `${latitude},${longitude}`,
          radius: 1000,
          type: 'point_of_interest',
          key: GOOGLE_PLACES_ACCESS_TOKEN,
        },
      }
    );
    const pois = response.data.results.map((poi) => ({
      id: poi.place_id,
      name: poi.name,
      latitude: poi.geometry.location.lat,
      longitude: poi.geometry.location.lng,
      types: poi.types || [],
    }));
    setPois(pois);
  } catch (error) {
    console.error("Error fetching POIs:", error);
  }
};

export const getPoiIcon = (types) => {
  if (types.includes('store')) return require('../assets/icon/shopIcon.png');
  if (types.includes('park')) return require('../assets/icon/parkIcon.png');
  return ICONS.DEFAULT;
};

export const createPolygon = (longitude, latitude) => {
  const OFFSET = 0.0005;
  const outerBoundary = [
    [-180, -90],
    [180, -90],
    [180, 90],
    [-180, 90],
    [-180, -90],
  ];
  const hole = [
    [longitude - OFFSET, latitude - OFFSET],
    [longitude + OFFSET, latitude - OFFSET],
    [longitude + OFFSET, latitude + OFFSET],
    [longitude - OFFSET, latitude + OFFSET],
    [longitude - OFFSET, latitude - OFFSET],
  ];
  return polygon([outerBoundary, hole]);
};


