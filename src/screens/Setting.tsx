import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { useAuth0 } from 'react-native-auth0';

const Settings = ({ navigation }) => {
  const { clearSession, user, isAuthenticated } = useAuth0();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // toggle function
  const toggleDarkMode = () => setIsDarkMode((prevState) => !prevState);

  // Logout function
  const handleLogout = async () => {
    try {
      await clearSession();
      navigation.navigate("Welcome");  // redirect to the login screen
    } catch (e) {
      console.error("Logout Error:", e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {isAuthenticated ? (
        <>
          <Text style={styles.userIdText}>User: {user?.name || "Unknown User"}</Text>
          <Text style={styles.userIdText}>User ID: {user?.sub || "N/A"}</Text>

          {/* Toggle Switch */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>Dark Mode</Text>
            <Switch 
              value={isDarkMode} 
              onValueChange={toggleDarkMode} 
              trackColor={{ false: "#767577", true: "#5b4087" }}
              thumbColor={isDarkMode ? "#ffffff" : "#f4f3f4"}
            />
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.subtitle}>Please log in to access settings.</Text>
      )}
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color:"black",
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
  },
  userIdText: {
    fontSize: 14,
    marginVertical: 5,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  toggleText: {
    fontSize: 16,
    marginRight: 10,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#d9534f",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});
