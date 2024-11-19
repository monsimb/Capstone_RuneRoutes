import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/Login.tsx'
import Maps from './src/screens/Maps.tsx'
import { Auth0Provider } from 'react-native-auth0';

const Stack = createNativeStackNavigator();

function App() {

  return (
    <Auth0Provider domain={"dev-r3fzkkn3e0cei0co.us.auth0.com"} clientId={"63jqpjQZkZYz91XhIGkxDr401zJX4h3b"}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Login} />
          <Stack.Screen name="Maps" component={Maps} />
        </Stack.Navigator>
      </NavigationContainer>
    </Auth0Provider>
  );
}

export default App;