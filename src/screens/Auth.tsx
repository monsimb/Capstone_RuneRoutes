import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, LogBox } from "react-native";
import { useAuth0 } from 'react-native-auth0';
import { styles } from "../styles/UI";

const API_URL = "https://capstone-runeroutes-wgp6.onrender.com"; // Replace with your Render API URL
LogBox.ignoreLogs(['new NativeEventEmitter()']);

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
  const addUserToDB = async (userId, userName, avatarSelections, travelDistance) => {
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
      //console.log("Auth result: ", result);
      const accessToken = result?.accessToken;
      console.log('-> got tokens', result);

      const userInfo = await fetch(
        `https://dev-r3fzkkn3e0cei0co.us.auth0.com/userinfo`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then(res => res.json());
      console.log('-> got userInfo', userInfo);

      await addUserToDB(
        userInfo.sub,
        userInfo.name,
        [0,0,0,0,0],
        0,
        { lat: 0, lon: 0 }
      );

      navigation.navigate("Home");

    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
    
  };


  return (
    <View style={styles.container}>
      {/* Logo Image */}
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require("../assets/icon/logo_1.png")}
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
              <Text style={styles.welcomeButtonText}>Get Started</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

export default AuthScreen;
