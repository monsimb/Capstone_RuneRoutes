import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useAuth0 } from 'react-native-auth0';
import { styles } from '../styles/Login';

const API_URL = "https://your-app.onrender.com"; // Replace with your Render API URL

function Login({ navigation }) {
  const { clearSession, user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      setUserId(user.sub); // Auth0 user ID
      console.log("User ID:", user.sub);

      // Send data to backend
      addUserToDB(user.sub, 'momo', ['slipknot'], 40.7128, -74.0060);
    }
  }, [isAuthenticated, user]);

  // Function to send user data to backend
  const addUserToDB = async (userId: string, userName: string, avatarSelections: string[], lat: number, lon: number) => {
    try {
      const response = await fetch(`${API_URL}/addUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, userName, avatarSelections, lat, lon }),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Error adding user");
      }
    } catch (error) {
      console.error("❌ Error sending data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={require('../assets/roune_routes_logo.png')} resizeMode="contain" />
      </View>

      {userId ? <Text style={styles.userIdText}>User ID: {userId}</Text> : <Text style={styles.userIdText}>User not logged in</Text>}

      <TouchableOpacity style={styles.logoutButton} onPress={async () => {
        await clearSession();
        navigation.navigate('Welcome');
      }}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Login;
