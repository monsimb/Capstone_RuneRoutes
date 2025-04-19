// MapUtils.ts
// includes functions for retrieving POI's, setting POI's icon, and creating initial polygon

import axios from 'axios';
import { polygon } from '@turf/helpers';
import { ICONS, OFFSET } from './constants';
import { MAP_BOX_ACCESS_TOKEN } from '@env';
import { SetStateAction } from 'react';
let count = 0;


// RAPID API Local Business data to enrich information?
export const fetchRapidPlaces = async(
  latitude: number,
  longitude: number,
  setPois: { (value: SetStateAction<{ id: string; name: string; latitude: number; longitude: number; types: []; }[]>): void; (arg0: any[]): void; }) => 
  {
  if (count <=1){
    const options = {
      method: 'GET',
      url: 'https://opentripmap-places-v1.p.rapidapi.com/en/places/bbox',
      params: {
        lon_max: longitude+OFFSET+.2,
        lon_min: longitude-OFFSET-.2,
        lat_min: latitude-OFFSET-.2,
        lat_max: latitude+OFFSET+.2,
        limit: '150',
        rate: 1,
    },
      headers: {
        'x-rapidapi-key': '98d848e108msh9774aeab8bdc785p14975fjsnb6f10e6bfe17',
        'x-rapidapi-host': 'opentripmap-places-v1.p.rapidapi.com'
      }
    };
    
    try {
      // console.log('latitudeMAX: ',latitude+OFFSET,'longitudeMAX :',longitude+OFFSET)
      const response = await axios.request(options);
      // console.log(response.data.features);
      // console.log(response.data.features[0].properties);
      const pois= response.data.features.map((poi) => ({
        id: poi.properties.xid,
        name: poi.properties.name, // Use `name` or fallback to `text`
        rate: poi.properties.rate,
        types: poi.properties.kinds || [], // Use `kinds` for types
        longitude: poi.geometry.coordinates[0],
        latitude: poi.geometry.coordinates[1],
      }));
      console.log(pois);
      setPois(pois);

    } catch (error) {
      console.error(error);
    }
  }
  count +=1;
};
























//https://rapidapi.com/letscrape-6bRBa3QguO5/api/local-business-data
export const fetchPOIs = async (latitude: number, longitude: number, setPois: { (value: SetStateAction<{ id: string; name: string; latitude: number; longitude: number; types: []; }[]>): void; (arg0: any[]): void; }) => {
  try {
    const delta = 0.2;
    const bbox = [
      longitude - delta, // minLon
      latitude - delta,  // minLat
      longitude + delta, // maxLon
      latitude + delta   // maxLat
    ].join(',');

    // Retrieving places with an outdoors tag
    const response_a = await axios.get(
      `https://api.mapbox.com/search/searchbox/v1/category/outdoors?`,
      {
        params: {
          // q: `monument`,
          proximity: `${longitude},${latitude}`,
          limit: 10,
          bbox: bbox,
          // session_token: 'tempUUID',
          access_token: MAP_BOX_ACCESS_TOKEN,
        },
      }
    );
    const pois_outdoors = response_a.data.features.map((poi) => ({
      name: poi.properties.name, // Use `name` or fallback to `text`
      types: poi.properties.poi_category || [], // Use `categories` for types
      longitude: poi.geometry.coordinates[0],
      latitude: poi.geometry.coordinates[1],
    }));

    // Retrieving places with a food_and_drink tag
    const response_b = await axios.get(
      `https://api.mapbox.com/search/searchbox/v1/category/food_and_drink?`,
      {
        params: {
          // q: `monument`,
          proximity: `${longitude},${latitude}`,
          limit: 10,
          bbox: bbox,
          // session_token: 'tempUUID',
          access_token: MAP_BOX_ACCESS_TOKEN,
        },
      }
    );
    const pois_food = response_b.data.features.map((poi) => ({
      name: poi.properties.name, // Use `name` or fallback to `text`
      types: poi.properties.poi_category || [], // Use `categories` for types
      longitude: poi.geometry.coordinates[0],
      latitude: poi.geometry.coordinates[1],
    }));

    console.log("! POI HIT !")
    const pois = [...pois_outdoors, ...pois_food];
    setPois(pois);

  } catch (error) {
    console.error("Error fetching POIs:", error);
  }
};

export const getPoiIcon = (types: string | string[]) => {
  if (types.includes('store')||types.includes('shopping')) return ICONS.STORE;
  if (types.includes('park')) return ICONS.PARK;
  if (types.includes('café')) return ICONS.CAFE;
  if (types.includes('food')||types.includes('restaurant')) return ICONS.FOOD;
  return ICONS.DEFAULT;
};

export async function getDirections(
  startLat: number,
  startLon: number,
  endLat: number,
  endLon: number,
  setCoords: (coords: number[][]) => void
) {
  try {
    const response = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/walking/${startLon},${startLat};${endLon},${endLat}`, {
      params: {
        geometries: 'geojson',
        access_token: MAP_BOX_ACCESS_TOKEN,
      },
    });
    const coords = response.data.routes[0].geometry.coordinates;
    setCoords(coords);
  } catch (err) {
    console.error("Error fetching directions:", err);
  }
};

export const createPolygon = (longitude: number, latitude: number) => {

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


