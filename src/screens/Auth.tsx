import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useAuth0 } from 'react-native-auth0';
import { styles } from "../styles/UI";

const API_URL = "https://capstone-runeroutes-wgp6.onrender.com"; // Replace with your Render API URL

function AuthScreen({ navigation }) {
  const { authorize, clearSession, user, isAuthenticated, getCredentials } = useAuth0();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  // Extract and set user ID when the user is authenticated
  useEffect(() => {
    if (user) {
      console.log("User: ", user);
      setUserId(user.sub); // 'sub' is the unique identifier from Auth0
      //addUserToDB(user.sub, user.name, [0,0,0,0,0], 10, { lat: 40.7128, lon: -74.0060 });
    }
  }, [user]);

  // Function to send user data to backend
  const addUserToDB = async (userId, userName, avatarSelections, travelDistance, coordinates) => {
    try {
      const credentials = await getCredentials();
      const token = credentials?.accessToken;
      console.log("Token in addUserToDB: ", token);

      const response = await fetch("https://capstone-runeroutes-wgp6.onrender.com/auth/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify({
          userId,
          userName,
          avatarSelections,
          travelDistance,
          lat: coordinates.lat,
          lon: coordinates.lon,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}: ${JSON.stringify(data)}`);
      }
      console.log("User added: ", data);
    } catch (err) {
      console.error("Error sending user to backend:", err.message);
    }
  };
  


  // If user successfully authenticated, navigate to Home (Maps.tsx)
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await authorize({
        audience: 'https://dev-r3fzkkn3e0cei0co.us.auth0.com/api/v2/', // 👈 or your Auth0 API identifier
        scope: 'openid profile email offline_access',
      });
      console.log("Auth result: ", result);
      if(user && result?.accessToken) {
        setUserId(user.sub);
      }
      else{
        console.log("Failed to setUserId");
      }

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
          source={require("../assets/icon/AppFaceLogo3.png")}
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
          <Text style={styles.welcomeTitle}>Welcome to Rune Routes!</Text>

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
