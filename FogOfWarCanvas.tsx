import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Alert } from 'react-native';
import MapView, { Marker, Region, Polygon } from 'react-native-maps';
import { Canvas, useCanvasRef, Circle, Path, Paint, Skia } from "@shopify/react-native-skia";

const FogOfWarCanvas = () => {
  const [color, setColor] = useState('blue');
  const ref = useCanvasRef();

  return(
    <Canvas style={styles.canvas}
      ref={ref}
      pointerEvents="none" // Allow touch events to pass through
      //style={{
      //  ...styles.fogCanvas, // ...styles.fogCanvas copies all the properties of it into this new style object
      //  pointerEvents: interactive ? 'auto' : 'none' // If pointerEvents is interactive, its set to auto. If not, it will be set to none
      //}}
    >
      {/* The Circle is interactive and changes color on touch */}
      <Circle
        cx={200}
        cy={200}
        r={50}
        color={color}
      />
      
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