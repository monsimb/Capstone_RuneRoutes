import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useAuth0 } from 'react-native-auth0';

import { styles } from "../styles/Auth";

const API_URL = "https://capstone-runeroutes.onrender.com"; // Replace with your Render API URL

function AuthScreen({ navigation }) {
  const { authorize, clearSession, user, isAuthenticated } = useAuth0();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  // Extract and set user ID when the user is authenticated
  useEffect(() => {
    if (user) {
      setUserId(user.sub); // 'sub' is the unique identifier from Auth0
      console.log(user.sub);
    }
  }, [user]);

  // If user successfully authenticated, navigate to Home (Maps.tsx)
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await authorize();

    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
    navigation.navigate("Home");
  };


  return (
    <View style={styles.container}>
      {/* Logo Image */}
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require("../assets/roune_routes_logo.png")}
          resizeMode="contain"
        />
      </View>

      {/* If user is authenticated, show settings screen */}
      {isAuthenticated ? (
        <>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.userIdText}>User ID: {userId}</Text>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>Welcome to Rune Routes!</Text>

          {/* Login Button */}
          <TouchableOpacity style={styles.getStartedButton} onPress={handleLogin} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Get Started</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

export default AuthScreen;
