/**
 * Login.tsx
 * Responsible for creating the homepage that routes user to AUTH0 login.
 * @returns the 'first page'.
*/

import React, { useState } from "react";
import { Button, Text, View } from "react-native";
import { useAuth0 } from 'react-native-auth0';
import { styles } from "../styles/Login";

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

  return (
    <View style={styles.container}>
      <Text>Login to Rune Routes</Text>
      <Button onPress={onPress} title={isLoading ? "Logging in..." : "Log in"} disabled={isLoading} />
      {/* Optional: You can remove this button or implement a logout function */}
      <Button
        title="Logout"
        onPress={() => navigation.navigate('Logout')}
      />
    </View>
  );
}

export default Login;