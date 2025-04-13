import React, { useState, useEffect } from "react";
import { Button, Text, View, Image, TouchableOpacity, StyleSheet, ScrollView, Switch } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/Profile';

const skins = [
  require("../assets/skins/skin1.png"),
  require("../assets/skins/skin2.png"),
  require("../assets/skins/skin3.png"),
];

const colors = [
  '#F5CBA7', // Light skin tone
  '#D2B48C', // Tan skin tone
  '#8D5524', // Dark skin tone
]

const hats = [
  require("../assets/hats/hat1.png"),
  require("../assets/hats/hat2.png"),
  require("../assets/hats/hat3.png"),
  require("../assets/hats/hat4.png"),
  require("../assets/hats/hat5.png"),
  require("../assets/hats/hat6.png"),
  require("../assets/hats/hat7.png"),
  require("../assets/hats/hat8.png"),
  require("../assets/hats/hat9.png"),
  null,
];

const faces = [
  require("../assets/faces/face1.png"),
  require("../assets/faces/face2.png"),
  require("../assets/faces/face3.png"),
  require("../assets/faces/face4.png"),
  require("../assets/faces/face5.png"),
];

const tops = [
  require("../assets/tops/top00.png"),
  require("../assets/tops/top1.png"),
  require("../assets/tops/top2.png"),
  require("../assets/tops/top3.png"),
  require("../assets/tops/top4.png"), 
  require("../assets/tops/top5.png"),
  require("../assets/tops/top6.png"),
  require("../assets/tops/top7.png"),
  require("../assets/tops/top9.png"),
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
  -380, // hat2: 100
  -316, // hat3: 100
  -343, // hat4: 98
  -316, // hat5: 100
  -333, // hat6: 76
  -343, // hat7: 100
  -355, // hat8: 130
  -325, // hat9: 100
];

function Profile({ navigation, route }) {
  const { chompedArea = 0 } = route.params || {}; // Default to 0 if not passed
  const [currentSkinIndex, setCurrentSkinIndex] = useState(0);
  const [currentHatIndex, setCurrentHatIndex] = useState(0);
  const [currentFaceIndex, setCurrentFaceIndex] = useState(0);
  const [currentTopIndex, setCurrentTopIndex] = useState(0);
  const [currentBottomIndex, setCurrentBottomIndex] = useState(0);


  // ADD BACKEND (THIS IS TEMPORARY STATS)
  const userStats = {
    distanceTraveled: chompedArea, 
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

  const [isCape, setCape] = useState(false);
  const toggleCape = () => setCape((prevState) => !prevState);

  return (
    // <ScrollView contentContainerStyle={{ flexGrow: 1 }}>     // not working rn
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.selector}>
        <Image source={skins[currentSkinIndex]} style={styles.avatarPart} resizeMode="contain" />
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

      {/* Skin Selector */}
      <View style={styles.skinSelector}>
        {skins.map((skin, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => setCurrentSkinIndex(index)}
              style={[
                styles.skinButton,
                { backgroundColor: colors[index] },
                currentSkinIndex === index && styles.selectedSkinButton,
              ]}
            >
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Cape Toggle */}
      <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>Cape</Text>
          <Switch
              value={isCape}
              onValueChange={toggleCape}
              trackColor={{ false: "#767577", true: "#fcba03" }}
              thumbColor={isCape ? "#ffffff" : "#f4f3f4"} />
      </View>

      {/* User Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Distance Traveled: {userStats.distanceTraveled} km^2</Text>
        <Text style={styles.statsText}>POIs Discovered: {userStats.poisDiscovered}</Text>
        <Text style={styles.statsText}>Current Streak: {userStats.currentStreak} days</Text>
      </View>

    </View>
    // </ScrollView>
  );
}
export default Profile;
