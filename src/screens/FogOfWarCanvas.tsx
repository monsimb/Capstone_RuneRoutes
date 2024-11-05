import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Alert } from 'react-native';
import MapView, { Marker, Region, Polygon } from 'react-native-maps';
import { Canvas, useCanvasRef, Circle, Path, Paint, Skia } from "@shopify/react-native-skia";

// props for FogOfWarCanvas
interface FogOfWarCanvasProps {
  region: Region;
}

const CLOUD_LATITUDE = 37.78825;
const CLOUD_LONGITUDE = -122.4324;

const FogOfWarCanvas: React.FC<FogOfWarCanvasProps> = ({ region }) => {
  const [color, setColor] = useState('blue');
  const canvasRef = useCanvasRef();
  const [cloudPosition, setCloudPosition] = useState({ cx: 100, cy: 100 });

  useEffect(() => {
    // Calculate the offset to keep the cloud in a fixed geographical location
    const latOffset = (CLOUD_LATITUDE - region.latitude) * 10000; // Scale as needed
    const lonOffset = (CLOUD_LONGITUDE - region.longitude) * 10000;

    // Update the cloud's position based on these offsets
    setCloudPosition({
      cx: 220 + lonOffset, // Adjust the base x position as needed
      cy: 450 - latOffset,  // Adjust the base y position as needed
    });
  }, [region]);

  return(
    <Canvas ref={canvasRef} style={styles.canvas} pointerEvents="none">
      {/* Use the calculated cloudPosition to render the circle at the correct location */}
      <Circle cx={cloudPosition.cx} cy={cloudPosition.cy} r={80} color='rgba(255, 255, 255, 0.3)'/>
      {/* Additional clouds can be rendered here similarly */}
    </Canvas>
      
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent black for fog effect
    
  }
});

export default FogOfWarCanvas;