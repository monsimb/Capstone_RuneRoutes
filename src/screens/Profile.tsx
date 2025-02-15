import React, { useState } from "react";
import { Button, Text, View, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { rgbaColor } from "react-native-reanimated/lib/typescript/Colors";
import Ionicons from 'react-native-vector-icons/Ionicons';

//ADD BACKEND
const friendsData = [
  { id: 1, name: "Joseph", icon: require("../assets/joseph_icon.png"), milesSquared: 12.5 },
  { id: 2, name: "Freddie", icon: require("../assets/freddie_icon.png"), milesSquared: 8.3 },
  { id: 3, name: "Nidhi", icon: require("../assets/nidhi_icon.png"), milesSquared: 15.7 },
  { id: 4, name: "Monique", icon: require("../assets/monique_icon.png"), milesSquared: 11.7 },
  { id: 5, name: "Ibu", icon: require("../assets/ibu_icon.png"), milesSquared: 45.7 },
  // Add more friends here
];

function Profile({ navigation }) {
  const [currentAvatarIndex, setCurrentAvatarIndex] = useState(0);

  const handleNextAvatar = () => {
    setCurrentAvatarIndex((prevIndex) => (prevIndex + 1) % friendsData.length);
  };

  const handlePreviousAvatar = () => {
    setCurrentAvatarIndex((prevIndex) => (prevIndex - 1 + friendsData.length) % friendsData.length);
  };

  // ADD BACKEND (THIS IS TEMPORARY STATS)
  const userStats = {
    distanceTraveled: 120.5, 
    poisDiscovered: 4, 
    currentStreak: 7, 
  };

  return (

    <View style={styles.container}>

      {/* Title */}
            <Text style={styles.title}>Profile</Text>

      {/* Avatar Selector */}
      <View style={styles.avatarSelector}>
        <TouchableOpacity onPress={handlePreviousAvatar}>
          <Ionicons name="chevron-back" size={70} color="black" />
        </TouchableOpacity>
        <Image source={friendsData[currentAvatarIndex].icon} style={styles.avatarIcon} />
        <TouchableOpacity onPress={handleNextAvatar}>
          <Ionicons name="chevron-forward" size={70} color="black" />
        </TouchableOpacity>
      </View>

      {/* User Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsTextTitle}>User Stats</Text>
        <Text style={styles.statsText}>Distance Traveled: {userStats.distanceTraveled} miles</Text>
        <Text style={styles.statsText}>POIs Discovered: {userStats.poisDiscovered}</Text>
        <Text style={styles.statsText}>Current Streak: {userStats.currentStreak} days</Text>
      </View>

  

     
    </View>
  );
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: "center",
    backgroundColor: 'rgba(208,188,180,1)',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: 'rgba(32, 0, 36, 0.75)',
    marginBottom: 20,
  },
  avatarSelector: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  avatarIcon: {
    width: 300,
    height: 300,
    borderRadius: 20,
    marginHorizontal: 1,
  },
  statsContainer: {
    marginBottom: 20,
    alignItems: "flex-start",
  },
  statsTextTitle: {
    fontSize: 30,
    color: "black",
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginBottom: 10,
  },
  statsText: {
    fontSize: 25,
    color: "black",
    fontWeight: "bold",
    marginBottom: 10,
  },
  listContainer: {
    width: "100%",
    marginBottom: 20,
  },
  friendCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 15,
    marginBottom: 12,
    height: 70,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  friendIcon: {
    width: 70,
    height: 70,
    borderRadius: 1,
    marginRight: 10,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  friendMiles: {
    fontSize: 14,
    color: "#666",
  },
  addButton: {
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
