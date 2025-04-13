import React, { useState, useEffect } from "react";
import { Button, Text, View, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';

const skins = [
  require("../assets/skins/skin1.png"),
  require("../assets/skins/skin2.png"),
  require("../assets/skins/skin3.png"),
];

const hats = [
  require("../assets/hats/hat1.png"),
  require("../assets/hats/hat2.png"),
  require("../assets/hats/hat3.png"),
  require("../assets/hats/hat4.png"),
  require("../assets/hats/hat5.png"),
  require("../assets/hats/hat6.png"),
  require("../assets/hats/hat7.png"),
  require("../assets/hats/hat8.png"),
];

const faces = [
  require("../assets/faces/face1.png"),
  require("../assets/faces/face2.png"),
  require("../assets/faces/face3.png"),
  require("../assets/faces/face4.png"),
  require("../assets/faces/face5.png"),
];

const tops = [
  require("../assets/tops/top1.png"),
  require("../assets/tops/top2.png"),
  require("../assets/tops/top3.png"),
  require("../assets/tops/top4.png"), 
  require("../assets/tops/top5.png"),
  require("../assets/tops/top6.png"),
  require("../assets/tops/top7.png"),
];

const bottoms = [
  require("../assets/bottoms/bottom1.png"),
  require("../assets/bottoms/bottom2.png"),
  require("../assets/bottoms/bottom3.png"),
  require("../assets/bottoms/bottom4.png"),
  require("../assets/bottoms/bottom5.png"),
  require("../assets/bottoms/bottom6.png"),
];

const hatTopOffsets = [
  -337, // hat1: 87
  -370, // hat2: 65
  -300, // hat3: 87
  -343, // hat4: 98
  -307, // hat5: 87
  -330, // hat6: 76
  -337, // hat7: 87
  -355, // hat8: 130
];

function Profile({ navigation }) {
  const [currentSkinIndex, setCurrentSkinIndex] = useState(0);
  const [currentHatIndex, setCurrentHatIndex] = useState(0);
  const [currentFaceIndex, setCurrentFaceIndex] = useState(0);
  const [currentTopIndex, setCurrentTopIndex] = useState(0);
  const [currentBottomIndex, setCurrentBottomIndex] = useState(0);


  // ADD BACKEND (THIS IS TEMPORARY STATS)
  const userStats = {
    distanceTraveled: 120.5, 
    poisDiscovered: 4, 
    currentStreak: 7, 
  };


  const handleNext = (type) => {
    if (type === 'skin') {
      setCurrentSkinIndex((prevIndex) => (prevIndex + 1) % skins.length);
    } else if (type === 'hat') {
      setCurrentHatIndex((prevIndex) => (prevIndex + 1) % hats.length);
    } else if (type === 'face') {
      setCurrentFaceIndex((prevIndex) => (prevIndex + 1) % faces.length);
    } else if (type === 'top') {
      setCurrentTopIndex((prevIndex) => (prevIndex + 1) % tops.length);
    } else if (type === 'bottom') {
      setCurrentBottomIndex((prevIndex) => (prevIndex + 1) % bottoms.length);
    }
  };

  const handlePrevious = (type) => {
    if (type === 'skin') {
      setCurrentSkinIndex((prevIndex) => (prevIndex - 1 + skins.length) % skins.length);
    } else if (type === 'hat') {
      setCurrentHatIndex((prevIndex) => (prevIndex - 1 + hats.length) % hats.length);
    } else if (type === 'face') {
      setCurrentFaceIndex((prevIndex) => (prevIndex - 1 + faces.length) % faces.length);
    } else if (type === 'top') {
      setCurrentTopIndex((prevIndex) => (prevIndex - 1 + tops.length) % tops.length);
    } else if (type === 'bottom') {
      setCurrentBottomIndex((prevIndex) => (prevIndex - 1 + bottoms.length) % bottoms.length);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {/* Skin Selector */}
      <View style={styles.selector}>
        <TouchableOpacity onPress={() => handlePrevious('skin')} style={styles.buttonSkin}>
          <Ionicons name="chevron-back" size={80} color="black" />
        </TouchableOpacity>
        <Image source={skins[currentSkinIndex]} style={styles.avatarPart} resizeMode="contain" />
        <TouchableOpacity onPress={() => handleNext('skin')} style={styles.buttonSkin}>
          <Ionicons name="chevron-forward" size={80} color="black" />
        </TouchableOpacity>
      </View>

      {/* Hat Selector */}
      <View style={styles.selector}>
        <TouchableOpacity onPress={() => handlePrevious('hat')} style={styles.buttonHat}>
          <Ionicons name="chevron-back" size={60} color="black" />
        </TouchableOpacity>

        <Image 
          source={hats[currentHatIndex]} 
          style={[styles.HatPart, { top: hatTopOffsets[currentHatIndex] }]} 
          resizeMode="contain" 
        />
        
        <TouchableOpacity onPress={() => handleNext('hat')} style={styles.buttonHat}>
          <Ionicons name="chevron-forward" size={60} color="black" />
        </TouchableOpacity>
      </View>

      {/* Face Selector */}
      <View style={styles.selector}>
        <TouchableOpacity onPress={() => handlePrevious('face')} style={styles.buttonFace}>
          <Ionicons name="chevron-back" size={60} color="black" />
        </TouchableOpacity>
        <Image source={faces[currentFaceIndex]} style={styles.FacePart} resizeMode="contain" />
        <TouchableOpacity onPress={() => handleNext('face')} style={styles.buttonFace}>
          <Ionicons name="chevron-forward" size={60} color="black" />
        </TouchableOpacity>
      </View>

      

      {/* Bottom Selector */}
      <View style={styles.selector}>
        <TouchableOpacity onPress={() => handlePrevious('bottom')} style={styles.buttonBottom}>
          <Ionicons name="chevron-back" size={60} color="black" />
        </TouchableOpacity>

        <Image source={bottoms[currentBottomIndex]} style={styles.BottomPart} resizeMode="contain" />
        
        <TouchableOpacity onPress={() => handleNext('bottom')} style={styles.buttonBottom}>
          <Ionicons name="chevron-forward" size={60} color="black" />
        </TouchableOpacity>
      </View>

      {/* Top Selector */}
      <View style={styles.selector}>
        <TouchableOpacity onPress={() => handlePrevious('top')} style={styles.buttonTop}>
          <Ionicons name="chevron-back" size={60} color="black" />
        </TouchableOpacity>

        <Image source={tops[currentTopIndex]} style={styles.TopPart} resizeMode="contain" />
        
        <TouchableOpacity onPress={() => handleNext('top')} style={styles.buttonTop}>
          <Ionicons name="chevron-forward" size={60} color="black" />
        </TouchableOpacity>
      </View>

      {/* User Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Distance Traveled: {userStats.distanceTraveled} km</Text>
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
  statsContainer: {
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 22,   // stats text size
    color: 'rgba(0, 0, 0, 0.75)',
    marginVertical: 5,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  skinSelector: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    position: 'absolute',
    bottom: 20,
  },
  avatarPart: {
    width: 100,
    height: 300,
    padding: 10,
    top: 50,
  },
  avatarContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  HatPart: {
    width: 140,   // change the size of the hat
    height: 120,
    padding: 10,
    left: 0,
    top: -330,    // change the position of the hat
  },
  FacePart: {
    width: 50,    // change the size of the face
    height: 50,
    padding: 10,
    left: 0,
    top: -422,    // change the position of the face
  },
  TopPart: {
    width: 98,     // change the size of the top
    height: 110,
    padding: 10,
    left: 0,
    top: -600,    // change the position of the top
  },
  BottomPart: {
    width: 86,   // change the size of the bottom
    height: 100,
    padding: 10,
    left: -0,
    top: -395,    // change the position of the bottom
  },
  buttonSkin: {
    top: 250,  // change the position of the skin button
  },
  buttonHat: {
    top: -340, // change the position of the hat button
  },
  buttonFace: {
    top: -420, // change the position of the face button
    padding: 45,
  },
  buttonTop: {
    top: -610, // change the position of the top button
    padding: 15,
  },
  buttonBottom: {
    top: -390, // change the position of the bottom button
    padding: 15,
  },
});
