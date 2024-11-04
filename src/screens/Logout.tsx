/** 
 * Logout.tsx
 * Responsible for creating the Logout page.
 * 
*/

import React from "react";
import { Button, Text, View } from "react-native";
import {useAuth0, Auth0Provider} from 'react-native-auth0';

// TODO: Re-route so this is accessible from the profile page
function Logout({ navigation }) {
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