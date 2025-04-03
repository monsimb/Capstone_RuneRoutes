import React, { useState } from "react";
import { Button, Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth0 } from 'react-native-auth0';

function Welcome({ navigation }) {
  const { authorize, user } = useAuth0();
  const [isLoading, setIsLoading] = useState(false);

  if (user) {
    navigation.navigate('Home'); // Navigate to Maps if user is defined
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

  return (
    <View style={styles.container}>

      {/* Logo Image */}
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require('../assets/roune_routes_logo.png')}
          resizeMode="contain"
        />
      </View>


       <Text style={styles.title}>Welcome to Rune Routes!</Text>

      <TouchableOpacity
        style={styles.getStartedButton}
        onPress={onPress}
      >

        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5b4087",
    padding: 20,
  },
  imageContainer: {
    width: 300,
    height: 300,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 30,
    textAlign: 'center',
  },
  getStartedButton: {
    backgroundColor: "#4CAF50",
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

export default Welcome;