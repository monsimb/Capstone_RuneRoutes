import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch, Image } from "react-native";
import { useAuth0 } from 'react-native-auth0';
import { styles } from "../styles/UI";

function Settings({ navigation }) {
    const { clearSession, user, isAuthenticated } = useAuth0();
    const [isDriveMode, setIsDriveMode] = useState(false);
    const [fogOption, setFogOption] = useState("None");


    // toggle function
    const toggleDriveMode = () => setIsDriveMode((prevState) => !prevState);

    // Logout function
    const handleLogout = async () => {
        try {
            await clearSession();
            navigation.navigate("Welcome"); // redirect to the login screen
        } catch (e) {
            console.error("Logout Error:", e);
        }
    };

    // fog options
    const fogOptions = ["None", "Light", "Heavy"];

//     return (
//             {/* {isAuthenticated ? ( */}
//             <>
//                 {/* Toggle Switch */}
//                 <View style={styles.toggleContainer}>
//                     <Text style={styles.toggleText}>Driving Mode</Text>
//                     <Switch
//                         value={isDriveMode}
//                         onValueChange={toggleDriveMode}
//                         trackColor={{ false: "#767577", true: "#5b4087" }}
//                         thumbColor={isDriveMode ? "#ffffff" : "#f4f3f4"} />
//                 </View>

//                 {/* Logout Button */}
//                 <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//                     <Text style={styles.buttonText}>Logout</Text>
//                 </TouchableOpacity>
//             </>
//             {/* ) : (
//               <Text style={styles.subtitle}>Please log in to access settings.</Text>
//             )} */}
//         </View>
//     );
// }
return (
    <View style={styles.container}>
       {/* Title */}
       <Text style={styles.title}>Settings</Text>

      {/* Image placeholder */}
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={require('../assets/roune_routes_logo.png')} resizeMode="contain" />
      </View>

      {/* User information */}
      <Text style={styles.userIdText}>User: {user?.name || "Unknown User"}</Text>
      <Text style={styles.userIdText}>User ID: {user?.sub || "N/A"}</Text>
      
       {/* Toggle Switches */}
        <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>Driving Mode</Text>
            <Switch
                value={isDriveMode}
                onValueChange={toggleDriveMode}
                trackColor={{ false: "#767577", true: "#fcba03" }}
                thumbColor={isDriveMode ? "#ffffff" : "#f4f3f4"} />
        </View>
    
        <View style={styles.fogOptionsContainer}>
            <View style={styles.toggleContainer}>
                <Text style={styles.toggleText}>Fog Level</Text>
                {fogOptions.map((option) => (
                    <TouchableOpacity
                    key={option}
                    style={[
                        styles.fogOptionButton,
                        fogOption === option && styles.fogOptionSelected,
                    ]}
                    onPress={() => setFogOption(option)}
                    >
                    <Text
                        style={[
                        styles.fogOptionText,
                        fogOption === option && styles.fogOptionTextSelected,
                        ]}
                    >
                        {option}
                    </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>



      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}


export default Settings;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f5f5f5",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//     color:"black",
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "purple",
//   },
//   userIdText: {
//     fontSize: 14,
//     marginVertical: 5,
//     color: "purple"
//   },
//   toggleContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 20,
//   },
//   toggleText: {
//     fontSize: 16,
//     marginRight: 10,
//     color: "purple",
//   },
//   logoutButton: {
//     marginTop: 20,
//     backgroundColor: "#d9534f",
//     padding: 10,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: "black",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });
