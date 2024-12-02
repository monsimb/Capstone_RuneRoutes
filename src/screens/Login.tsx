import React, { useState } from "react";
import { Button, Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth0 } from 'react-native-auth0';
import Ionicons from 'react-native-vector-icons/Ionicons';

function Login({ navigation }) {
  const { authorize, user } = useAuth0();
  const [isLoading, setIsLoading] = useState(false);

  if (user) {
    navigation.navigate('Maps'); // Navigate to Maps if user is defined
  }

  const onPress = async () => {
    setIsLoading(true);
    try {
      await authorize();
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const {clearSession} = useAuth0();

  const Logout = async () => {
      try {
          await clearSession();
      } catch (e) {
          console.log(e);
      }
  };

  return (
    <View style={styles.container}>
      

      {/* Back button to return to Maps */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.navigate('Home', { screen: 'MapView' })}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>


      {/* Image placeholder */}
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={require('../assets/roune_routes_logo.png')} resizeMode="contain" />
      </View>


      {/* Title */}
      <Text style={styles.title}>Login to Rune Routes</Text>


      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={onPress} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? "Logging in..." : "Log in"}</Text>
      </TouchableOpacity>


      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={Logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5b4087",
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    //bottom: 90,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 30,
  },
  imageContainer: {
    width: 300,
    height: 300,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
    marginBottom: 50,
    marginTop: '-50%',
  },
  image: {
    width: "100%",
    height: "100%",
  },
  loginButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 15,
    width: "80%",
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#F44336",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});