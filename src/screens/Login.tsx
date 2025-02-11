import React, { useState } from "react";
import { Button, Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth0 } from 'react-native-auth0';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/Login';

function Login({ navigation }) {
  const {clearSession} = useAuth0();

  const Logout = async () => {
      try {
          await clearSession();
      } catch (e) {
          console.log(e);
      }
      navigation.navigate('Welcome')
  };

  return (
    <View style={styles.container}>
       {/* Title */}
       <Text style={styles.title}>Settings</Text>

      {/* Image placeholder */}
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={require('../assets/roune_routes_logo.png')} resizeMode="contain" />
      </View>


      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={Logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Login;