import React, { useState } from "react";
import { Button, Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth0 } from 'react-native-auth0';

function Welcome({ navigation }) {
  const { authorize, user } = useAuth0();
  const [isLoading, setIsLoading] = useState(false);

  const onPress = async () => {
    setIsLoading(true);
    try {
      const authResult = await authorize();
      console.log("Auth result: ", authResult);
//
//       const accessToken = authResult?.accessToken;
//       if(accessToken) {
//         const response = await fetch('http://localhost:3001/login', { // Not going to work right now, we need to figure out host
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${accessToken}`,
//           },
//           body: JSON.stringify({}),
//         });
//
//         const data = await response.json();
//         console.log("Backend response: ", data);
//       }
//       else {
//         console.log("No access token received");
//       }
//
      navigation.navigate('Home');
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