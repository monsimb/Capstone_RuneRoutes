// Map Configuration
export const CHOMP_DIAMETER = 0.025; // Radius for fog polygon modification (how much gets chomped away)
export const LOCATION_UPDATE_INTERVAL = 1000; // Interval for location updates in milliseconds (lower = more responsive)

// Default Map Settings
export const DEFAULT_MAP_CENTER = [-77.036086, 38.910233]; // Default center coordinates if we can't get user location
export const DEFAULT_ZOOM_LEVEL = 8;
export const OFFSET = 0.0005;

// Caching
const TILE_CACHE_KEY = 'fetchedTiles';
const POI_CACHE_KEY = 'cachedPOIs';

// Icon Paths
export const ICONS = {
  STORE: require('../assets/icon/shopIcon.png'),
  PARK: require('../assets/icon/parkIcon.png'),
  CAFE: require('../assets/icon/cafeIcon.png'),
  FOOD: require('../assets/icon/foodIcon.png'),
  MUSEUM: require('../assets/icon/museumIcon.png'),
  DEFAULT: require('../assets/icon/signpostIcon.png'),
  CUSTOM: require('../assets/icon/defaultIcon.png')
};

// Icon Width and Height
export const ICON_SIZE = 50;

// User Customization
export const skins = [
  require("../assets/skins/skin1.png"),
  require("../assets/skins/skin2.png"),
  require("../assets/skins/skin3.png"),
];
export const colors = [
  '#F5CBA7', // Light skin tone
  '#D2B48C', // Tan skin tone
  '#8D5524', // Dark skin tone
];
export const hats = [
  require("../assets/hats/hat1.png"),
  require("../assets/hats/hat2.png"),
  require("../assets/hats/hat3.png"),
  require("../assets/hats/hat4.png"),
  require("../assets/hats/hat5.png"),
  require("../assets/hats/hat6.png"),
  require("../assets/hats/hat7.png"),
  require("../assets/hats/hat8.png"),
  require("../assets/hats/hat9.png"),
  null,
];
export const faces = [
  require("../assets/faces/face1.png"),
  require("../assets/faces/face2.png"),
  require("../assets/faces/face3.png"),
  require("../assets/faces/face4.png"),
  require("../assets/faces/face5.png"),
];
export const tops = [
  require("../assets/tops/top00.png"),
  require("../assets/tops/top1.png"),
  require("../assets/tops/top2.png"),
  require("../assets/tops/top3.png"),
  require("../assets/tops/top4.png"), 
  require("../assets/tops/top5.png"),
  require("../assets/tops/top6.png"),
  require("../assets/tops/top7.png"),
  require("../assets/tops/top9.png"),
];
export const bottoms = [
  require("../assets/bottoms/bottom1.png"),
  require("../assets/bottoms/bottom2.png"),
  require("../assets/bottoms/bottom3.png"),
  require("../assets/bottoms/bottom4.png"),
  require("../assets/bottoms/bottom5.png"),
  require("../assets/bottoms/bottom6.png"),
];
export const hatOffsets = [
  17, // hat1: 87
  60, // hat2: 100
  -4, // hat3: 100
  23, // hat4: 98
  -4, // hat5: 100
  13, // hat6: 76
  23, // hat7: 100
  34, // hat8: 130
  5, // hat9: 100
];
