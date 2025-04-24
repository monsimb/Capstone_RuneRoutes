import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch, Image } from "react-native";
import { useAuth0 } from 'react-native-auth0';
import { styles } from "../styles/UI";

function Settings({ navigation }) {
    const { clearSession, user, isAuthenticated } = useAuth0();
    const [isDriveMode, setIsDriveMode] = useState(false);
    const [fogOption, setFogOption] = useState("Light");
    const [fogOpacity, setFogOpacity] = useState(0); // New state for fog opacity


    // Toggle function
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

    // Fog options
    const fogOptions = ["None", "Light", "Heavy"];

    const handleFogOptionChange = (option) => {
        setFogOption(option);
        let opacity = 0;
        switch (option) {
            case "None":
                opacity = 0; // No fog
                break;
            case "Light":
                opacity = 0.7; // Light fog
                break;
            case "Heavy":
                opacity = 1.0; // Heavy fog
                break;
        }
        setFogOpacity(opacity);
    
        // Pass fogOpacity to Maps screen
        navigation.navigate("Maps", { fogOpacity: opacity });
    };

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
        <Image style={styles.image} source={require('../assets/icon/logo_1.png')} resizeMode="contain" />
      </View>

      
       {/* Toggle Switches */}
        <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>Driving Mode</Text>
            <Switch
                value={isDriveMode}
                onValueChange={toggleDriveMode}
                trackColor={{ false: "#767577", true: "#f3d88b" }}
                thumbColor={isDriveMode ? "#ffffff" : "#f4f3f4"} />
        </View>
    
        <View style={styles.fogOptionsContainer}>
            <Text style={styles.toggleText}>Fog Level</Text>
            {fogOptions.map((option) => (
                <TouchableOpacity
                    key={option}
                    style={[
                        styles.fogOptionButton,
                        fogOption === option && styles.fogOptionSelected,
                    ]}
                    onPress={() => handleFogOptionChange(option)} // Use handleFogOptionChange here
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

            
      {/* User information */}
      <Text style={styles.userIdText}>User: {user?.name || "Unknown User"}</Text>
      {/* <Text style={styles.userIdText}>User ID: {user?.sub || "N/A"}</Text> */}

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}


export default Settings;