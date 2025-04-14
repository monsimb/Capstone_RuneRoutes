import React, { useState } from "react";
import { Button, Text, View, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useAuth0 } from 'react-native-auth0';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/Friends.js';

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
      <ScrollView contentContainerStyle={styles.listContainer}>
        {/* Title */}
          <Text style={styles.title}>Friends List</Text>

        {friendsData.map((friend) => (
          <View key={friend.id} style={styles.friendCard}>

            <Image source={friend.icon} style={styles.friendIcon} resizeMode="center"/>
            <View style={styles.friendInfo}>

              <Text style={styles.friendName}>{friend.name}</Text>
              <Text style={styles.friendMiles}>{friend.milesSquared} mi² explored</Text>

            </View>
          </View>
        ))}

        {/* Add Friend Button */}
      <TouchableOpacity style={styles.addButton} onPress={addFriend}>
        <Text style={styles.buttonText}>Add Friend</Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export default FriendsList;