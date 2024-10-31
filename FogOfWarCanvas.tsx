import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Alert } from 'react-native';
import MapView, { Marker, Region, Polygon } from 'react-native-maps';
import { Canvas, useCanvasRef, Circle, Path, Paint, usePaintRef, Skia, useValue } from "@shopify/react-native-skia";

const FogOfWarCanvas = ({ interactive }) => {
  const [color, setColor] = useState('green');
  const ref = useCanvasRef();

  const handleTouch = () => {
    console.log('Circle tapped!');
    setColor(prevColor => (prevColor === 'blue' ? 'red' : 'blue'));
  };

  return(
    <Canvas style={styles.canvas}
      ref={ref}
      style={{
        ...styles.fogCanvas,
        pointerEvents: interactive ? 'auto' : 'none'
      }}
    >
      {/* The Circle is interactive and changes color on touch */}
      <Circle
        cx={200}
        cy={200}
        r={50}
        color={color}
        onTouch={handleTouch}
      />
    </Canvas>
  );
};

const styles = StyleSheet.create({
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  }
});

export default FogOfWarCanvas;