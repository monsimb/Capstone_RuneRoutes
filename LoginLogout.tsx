// LoginLogout.tsx
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import Auth0, { useAuth0 } from "react-native-auth0";

const auth0 = new Auth0({

    domain: "dev-r3fzkkn3e0cei0co.us.auth0.com",
    clientId: "09HW7VQuDfh3S4MeFjcJT6Bl2SZL5Gnj"
  
  });
  
const LoginLogout: React.FC = () => {
    const { authorize, clearSession, user, error, isLoading } = useAuth0();

    const onLogin = async () => {
        try {
            await authorize();
        } catch (e) {
            console.error(e);
        }
    };

    const onLogout = async () => {
        try {
            await clearSession();
        } catch (e) {
            console.log('Log out cancelled');
        }
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    const loggedIn = user !== undefined && user !== null;

    return (
        <View style={styles.container}>
          {loggedIn && <Text>You are logged in as {user.name}</Text>}
          {!loggedIn && <Text>You are not logged in</Text>}
          {error && <Text>{error.message}</Text>}
    
          <Button
            onPress={loggedIn ? onLogout : onLogin}
            title={loggedIn ? 'Log Out' : 'Log In'}
          />
        </View>
      );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    button:{
        backgroundColor: 'purple',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center'
    }
});

export default LoginLogout;
