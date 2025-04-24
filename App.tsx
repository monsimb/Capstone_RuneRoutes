import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Maps from './src/screens/Maps.tsx';
import Friends from './src/screens/Friends.tsx';
import AuthScreen from './src/screens/Auth.tsx';
import Profile from './src/screens/Profile.tsx';
import Setting from './src/screens/Setting.tsx';
import { Auth0Provider } from 'react-native-auth0';
import { View, StyleSheet, Settings } from "react-native";
import Ionicons from 'react-native-vector-icons/FontAwesome6';
import { ProfileProvider } from './src/context/ProfileContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

//Bottom Tab Navigation
function MainTabs() {
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {backgroundColor: '#fff6db'},
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // change icons to make them grayed if clicked as well as set icons
          if (route.name === 'Maps') {
            iconName = focused ? 'map' : 'map';  //should work to import from icons repo as map  for dbug: https://sapui5.hana.ondemand.com/sdk/test-resources/sap/m/demokit/iconExplorer/webapp/index.html#/overview/SAP-icons/?tab=grid&search=map
          } else if (route.name === 'Setting') {
            iconName = focused ? 'gear' : 'gear';
          } else if (route.name === 'Friends') {
              iconName = focused ? 'users' : 'users';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'user' : 'user';
        }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#605795',
        tabBarInactiveTintColor: 'black',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Maps" component={Maps} />
      <Tab.Screen name="Friends" component={Friends} />
      <Tab.Screen name="Profile" component={Profile} /> 
      <Tab.Screen name="Setting" component={Setting} /> 

    </Tab.Navigator>
  );
}


function App() {
  return (
    <Auth0Provider 
      domain={"dev-r3fzkkn3e0cei0co.us.auth0.com"} 
      clientId={"63jqpjQZkZYz91XhIGkxDr401zJX4h3b"}>
      <ProfileProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={AuthScreen} />
            <Stack.Screen name="Home" component={MainTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </ProfileProvider>
    </Auth0Provider>
  );
 }

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});