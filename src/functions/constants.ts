// Map Configuration
export const CHOMP_DIAMETER = 0.025; // Radius for fog polygon modification (how much gets chomped away)
export const LOCATION_UPDATE_INTERVAL = 1000; // Interval for location updates in milliseconds (lower = more responsive)

// Default Map Settings
export const DEFAULT_MAP_CENTER = [-77.036086, 38.910233]; // Default center coordinates if we can't get user location
export const DEFAULT_ZOOM_LEVEL = 8;

// Icon Paths
export const ICONS = {
  STORE: require('../assets/icon/shopIcon.png'),
  PARK: require('../assets/icon/parkIcon.png'),
  DEFAULT: require('../assets/defaultPin.png'),
};