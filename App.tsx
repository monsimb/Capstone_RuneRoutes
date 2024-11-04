import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/Login.tsx'
import Logout from './src/screens/Logout.tsx'
import Map from './src/screens/Map.tsx'
import { Auth0Provider } from 'react-native-auth0';


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
}

export default App;