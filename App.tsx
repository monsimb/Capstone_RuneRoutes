import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './src/screens/Login.tsx'
import Maps from './src/screens/MapsTrial.tsx'
import Friends from './src/screens/Friends.tsx'
import Welcome from './src/screens/Welcome.tsx'
import Profile from './src/screens/Profile.tsx';
import { Auth0Provider } from 'react-native-auth0';
import { View, StyleSheet } from "react-native";
import Ionicons from 'react-native-vector-icons/FontAwesome6';
import Icon from 'react-native-vector-icons/FontAwesome6';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

//Bottom Tab Navigation
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          //change icons to make them grayed if clicked as well as set icons
          if (route.name === 'Maps') {
            iconName = focused ? 'map' : 'map';  //should work to import from icons repo as map  for dbug: https://sapui5.hana.ondemand.com/sdk/test-resources/sap/m/demokit/iconExplorer/webapp/index.html#/overview/SAP-icons/?tab=grid&search=map
          } else if (route.name === 'Settings') {
            iconName = focused ? 'gear' : 'gear';
          } else if (route.name === 'Friends') {
              iconName = focused ? 'users' : 'users';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'user' : 'user';
        }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#5b4087',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Maps" component={Maps} />
      <Tab.Screen name="Friends" component={Friends} />
      <Tab.Screen name="Profile" component={Profile} /> 
      <Tab.Screen name="Settings" component={Login} /> 

    </Tab.Navigator>
  );
}

//Login Stack Navigator
function LoginStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginMain" component={Login} />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <Auth0Provider domain={"dev-r3fzkkn3e0cei0co.us.auth0.com"} clientId={"63jqpjQZkZYz91XhIGkxDr401zJX4h3b"}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Home" component={MainTabs} />
          <Stack.Screen name="LoginStack" component={LoginStack} />
        </Stack.Navigator>
      </NavigationContainer>
    </Auth0Provider>
  );
 }

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});