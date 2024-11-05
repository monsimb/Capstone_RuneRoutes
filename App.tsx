/** 
 * App.tsx
 * Entry point of application.
*/

import React, { useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/Login.tsx'
import Logout from './src/screens/Logout.tsx'
import Map from './src/screens/Map.tsx'
import { Auth0Provider } from 'react-native-auth0';
import { SafeAreaView, StyleSheet, View, Alert, Button, TouchableOpacity, Text, Modal } from 'react-native';
import MapView, { Marker, Region, Polygon } from 'react-native-maps';
import { Canvas, useCanvasRef, Circle, Path, Paint, Skia } from "@shopify/react-native-skia";
import FogOfWarCanvas from './FogOfWarCanvas';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <Auth0Provider domain={"dev-r3fzkkn3e0cei0co.us.auth0.com"} clientId={"63jqpjQZkZYz91XhIGkxDr401zJX4h3b"}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Login} />
          <Stack.Screen name="Maps" component={Map} />
          <Stack.Screen name="Logout" component={Logout} />
        </Stack.Navigator>
      </NavigationContainer>
    </Auth0Provider>
  );
};

// Export the App component
export default App;
