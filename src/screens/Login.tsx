import React, { useEffect, useState } from "react";
import { Button, Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth0 } from 'react-native-auth0';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/Login';

function Login({ navigation }) {
  const { clearSession, user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [userId, setUserId] = useState(null);

  // Function to send user data to backend API
  const addUser = async (userId: string) => {
    try {
      const response = await fetch('http://localhost:5000/addUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userName: 'momo',
          avatarSelections: 'slipknot',
          travelDistance: 555
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('User added:', data);
      } else {
        console.log('Error:', data.message);
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  // Get userId only after the user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const newUserId = user.sub; // Directly use user.sub
      
      setUserId(newUserId); 
      console.log("UserID:", newUserId);

      // Call addUser function to send user data to the backend
      addUser(newUserId);
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