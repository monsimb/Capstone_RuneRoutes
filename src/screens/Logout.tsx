import React from "react";
import { Button, Text, View } from "react-native";
import {useAuth0, Auth0Provider} from 'react-native-auth0';

function Logout({ navigation }) {
  // return (
  //   <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
  //     <Text>Home Screen</Text>
  //     <Button
  //       title="Go to Details"
  //       onPress={() => navigation.navigate('Details')}
  //     />
  //   </View>
  // );
  const {clearSession} = useAuth0();

  const onPress = async () => {
      try {
          await clearSession();
      } catch (e) {
          console.log(e);
      }
  };

  return <Button onPress={onPress} title="Log out" />
}

export default Logout