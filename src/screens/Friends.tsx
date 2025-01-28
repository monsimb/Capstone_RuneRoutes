import React, { useState } from "react";
import { Button, Text, View, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useAuth0 } from 'react-native-auth0';
import Ionicons from 'react-native-vector-icons/Ionicons';

const friendsData = [
  { id: 1, name: "Joseph", icon: require("../assets/joseph_icon.png"), milesSquared: 12.5 },
  { id: 2, name: "Freddie", icon: require("../assets/freddie_icon.png"), milesSquared: 8.3 },
  { id: 3, name: "Nidhi", icon: require("../assets/nidhi_icon.png"), milesSquared: 15.7 },
  { id: 4, name: "Monique", icon: require("../assets/monique_icon.png"), milesSquared: 11.7 },
  { id: 5, name: "Ibu", icon: require("../assets/ibu_icon.png"), milesSquared: 45.7 },
  // Add more friends here
];

function FriendsList({ navigation }) {
  const addFriend = () => {
    // plz add logic on how to add friend :'(
    console.log("Add Friend button pressed");
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Friends List</Text>

      {/* Friends List */}
      <ScrollView style={styles.listContainer}>

        {friendsData.map((friend) => (
          <View key={friend.id} style={styles.friendCard}>

            <Image source={friend.icon} style={styles.friendIcon} />
            <View style={styles.friendInfo}>

              <Text style={styles.friendName}>{friend.name}</Text>
              <Text style={styles.friendMiles}>{friend.milesSquared} mi² explored</Text>
            
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Friend Button */}
      <TouchableOpacity style={styles.addButton} onPress={addFriend}>
        <Text style={styles.buttonText}>Add Friend</Text>
      </TouchableOpacity>
    </View>
  );
}

export default FriendsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5b4087",
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
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
