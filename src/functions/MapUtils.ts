// MapUtils.ts
// includes functions for retrieving POI's, setting POI's icon, routing to POIs, and creating initial polygon

import axios from 'axios';
import { polygon } from '@turf/helpers';
import { ICONS, OFFSET } from './constants';
import { MAP_BOX_ACCESS_TOKEN } from '@env';
import { SetStateAction } from 'react';
let count = 0;


// https://rapidapi.com/letscrape-6bRBa3QguO5/api/local-business-data ?? 
export const fetchPOIs = async (
  latitude: number,
  longitude: number,
  setPois: {
    (value: SetStateAction<{
      id: string;
      name: string;
      latitude: number;
      longitude: number;
      summary: string;
      types: string[];
      rate: number;
      accessibility: Record<string, boolean>;
      workingHours?: Record<string, string>;
      photoUrl?: string;
    }[]>): void;
  }
) => {
  try {
    const queryTypes = ['parks', 'cafes', 'museums','restaurants'];
    const allResults: any[] = [];

    // get response for each of the queries instead of batch querying
    for (const query of queryTypes) {
      const options = {
        method: 'POST',
        url: 'https://local-business-data.p.rapidapi.com/search',
        headers: {
          'x-rapidapi-key': '98d848e108msh9774aeab8bdc785p14975fjsnb6f10e6bfe17',
          'x-rapidapi-host': 'local-business-data.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        data: {
          queries: [query],
          limit: 20, // Lower limit per type
          region: 'us',
          language: 'en',
          coordinates: `${latitude},${longitude}`,
          zoom: 17,
          dedup: true
        }
      };

      const response = await axios.request(options);
      allResults.push(...response.data.data);
    }

    const pois = allResults.map((entry: any) => {
      const workingHoursRaw = entry.working_hours || {};
      const workingHours: Record<string, string> = {};

      for (const [day, value] of Object.entries(workingHoursRaw)) {
        // Coerce to string for safety
        workingHours[day.toString()] = Array.isArray(value) ? String(value[0]) : String(value);
      }

      const summary = entry?.about?.summary || '';    // some summaries are null

      return {
        id: `${entry.business_id || entry.place_id || entry.google_id || `${entry.latitude},${entry.longitude}`}-${entry.name}`,
        name: entry.name,
        latitude: entry.latitude,
        longitude: entry.longitude,
        summary,
        types: (entry.subtypes || [entry.type || 'unknown']).map((type: string) =>
          type.toLowerCase()
        ),
        rate: entry.rating,
        accessibility: entry.about?.details?.Accessibility || {},
        workingHours,
        photoUrl: entry.photos_sample?.[0]?.photo_url || null
      };
    });

    // sanitize data -> deduplicate
    const uniquePois = Array.from(
      new Map(pois.map(poi => [poi.id, poi])).values()
    );

    // console.log(uniquePois);
    console.log('POIs fetched:', pois.length);
    setPois(uniquePois);
  } catch (error) {
    console.error('Error fetching POIs:', error);
  }
};

// Defines which ICON to give to a POI given type tags
export const getPoiIcon = (types: string | string[]) => {
  // normalized types to avoid issues with tags like [chicken wing restaurant] -> now [chicken,wing,restaurant]
  const typeArray = Array.isArray(types) ? types : [types];
  const normalizedTypes = typeArray
    .flatMap(type => type.toLowerCase().split(/\s+/)); // split by spaces

  if (normalizedTypes.includes('store') || normalizedTypes.includes('shopping')) return ICONS.STORE;
  if (normalizedTypes.includes('park')) return ICONS.PARK;
  if (normalizedTypes.includes('café') || normalizedTypes.includes('cafe')) return ICONS.CAFE;
  if (normalizedTypes.includes('food') || normalizedTypes.includes('restaurant')) return ICONS.FOOD;
  if (normalizedTypes.includes('museum')) return ICONS.MUSEUM;

  return ICONS.DEFAULT;
};

// Retrieve directions from MAPBOX DIRECTIONS API
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

// Creates original polygon (if user is not already inside of a polygon based on db)
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


