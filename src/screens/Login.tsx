import React from "react";
import { Button, Text, View } from "react-native";
import {useAuth0, Auth0Provider} from 'react-native-auth0';

function Login({ navigation }) {
  // return (
  //   <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
  //     <Text>Home Screen</Text>
  //     <Button
  //       title="Go to Details"
  //       onPress={() => navigation.navigate('Details')}
  //     />
  //   </View>
  // );
  const {authorize} = useAuth0();

    const onPress = async () => {
        try {
            await authorize();
            navigation.navigate('Maps');
        } catch (e) {
            console.log(e);
        }
    };

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Login to Rune Routes</Text>
        <Button onPress={onPress} title="Log in" />
        <Button
        title="Logout"
        onPress={() => navigation.navigate('Logout')}
        />
      </View>
    )
}

export default Login