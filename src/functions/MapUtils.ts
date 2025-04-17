// includes functions for retrieving POI's, setting POI's icon, and creating initial polygon

import axios from 'axios';
import { polygon } from '@turf/helpers';
import { ICONS } from './constants';
import { MAP_BOX_ACCESS_TOKEN } from '@env';

export const fetchPOIs = async (latitude, longitude, setPois) => {
  try {
    const delta = 0.4;
    const bbox = [
      longitude - delta, // minLon
      latitude - delta,  // minLat
      longitude + delta, // maxLon
      latitude + delta   // maxLat
    ].join(',');
    const response = await axios.get(
      `https://api.mapbox.com/search/searchbox/v1/suggest?`,
      {
        params: {
          q: `food`,
          proximity: `${longitude},${latitude}`,
          limit: 10,
          bbox: bbox,
          session_token: 'tempUUID',
          access_token: MAP_BOX_ACCESS_TOKEN,
        },
      }
    );

    const pois = response.data.suggestions.map((poi) => ({
      name: poi.name, // Use `name` or fallback to `text`
      id: poi.mapbox_id,
      types: poi.poi_category || [], // Use `categories` for types
    }));

    const featurePromises = pois.map(poi => fetchFeature(poi.id));
    const features = await Promise.all(featurePromises);
    
    const enriched_pois = features.map((feature) => ({
      name: feature.name,
      id: feature.mapbox_id,
      longitude: feature.coordinates[0],
      latitude: feature.coordinates[1],
      types: feature.types || [],
    }));
    console.log(enriched_pois)


    setPois(enriched_pois);

  } catch (error) {
    console.error("Error fetching POIs:", error);
  }
};


export const fetchFeature = async (id) => {
  try {
    // console.log(id);
    const response = await axios.get(
      `https://api.mapbox.com/search/searchbox/v1/retrieve/${id}`,
      {
        params: {
          session_token: 'tempUUID',
          access_token: MAP_BOX_ACCESS_TOKEN,
        },
      }
    );

    const feature = response.data.features?.[0];
    const coordinates = feature.geometry?.coordinates || [null, null];
    const name = feature.properties?.name || '';
    const types = feature.properties?.poi_category || [];

    return {
      id,
      name,
      coordinates,
      types,
    };
  } catch (error) {
    console.error(`Error retrieving POI details for ${id}:`, error);
    return null;
  }
};




export const getPoiIcon = (types) => {
  if (types.includes('store')||types.includes('shopping')) return ICONS.STORE;
  if (types.includes('park')) return ICONS.PARK;
  if (types.includes('café')) return ICONS.CAFE;
  if (types.includes('food')||types.includes('restaurant')) return ICONS.FOOD;
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


