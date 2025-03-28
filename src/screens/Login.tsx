import React, { useEffect, useState } from "react";
import { Button, Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth0 } from 'react-native-auth0';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/Login';

function Login({ navigation }) {
  const { clearSession, user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [userId, setUserId] = useState(null);

  // Get userId only after the user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setUserId(user.sub); // user.sub is the unique identifier for the user
      console.log("userID " + userId);
    }
  }, [isAuthenticated, user]);

  const Logout = async () => {
    try {
      await clearSession();
    } catch (e) {
      console.log(e);
    }
    console.log("userID " + user.sub); // for testing purposed
    navigation.navigate('Welcome');
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Settings</Text>

      {/* Image placeholder */}
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={require('../assets/roune_routes_logo.png')} resizeMode="contain" />
      </View>

      {/* Display User ID if available */}
      {userId ? (
        <Text style={styles.userIdText}>User ID: {userId}</Text>
      ) : (
        <Text style={styles.userIdText}>User not logged in</Text>
      )}

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={Logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Login;