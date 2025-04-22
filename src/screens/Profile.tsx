import React, { useState, useEffect } from "react";
import { Button, Text, View, Image, TouchableOpacity, StyleSheet, ScrollView, Switch } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth0 } from 'react-native-auth0';
import { styles } from '../styles/Profile';
import { useProfileContext } from '../context/ProfileContext';

import { skins, colors, hats, faces, tops, bottoms, hatOffsets } from '../functions/constants';


function Profile({ }) {
  // const { chompedArea = 0 } = route.params || {}; // Default to 0 if not passed
  const [currentSkinIndex, setCurrentSkinIndex] = useState(0);
  const [currentHatIndex, setCurrentHatIndex] = useState(0);
  const [currentFaceIndex, setCurrentFaceIndex] = useState(0);
  const [currentTopIndex, setCurrentTopIndex] = useState(0);
  const [currentBottomIndex, setCurrentBottomIndex] = useState(0);
  const { totalExploredArea } = useProfileContext();
  const [profileData, setProfileData] = useState(null);
  const { getCredentials, user } = useAuth0();
  const userId = user?.sub;

  useEffect(() => { 
    const fetchProfile = async () => {
      try {
        const creds = await getCredentials();
        const token = creds?.accessToken;
        if(!token || !user?.sub) {
          console.warn("Missing access token or user ID");
          return;
        }

        const response = await fetch(`https://capstone-runeroutes-wgp6.onrender.com/auth/users/${user.sub}`, {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if(!response.ok) {
          const errorText = await response.text();
          console.warn(`Server error ${response.status}:`, errorText);
          return;
        }

        const data = await response.json();
        console.log("Profile data fetched:", data);
        setProfileData(data);

        const arr = Array.isArray(data.avatarSelections?.[0])
          ? data.avatarSelections[0]
          : data.avatarSelections;

        // seed your indices from the returned array
        const [skin, hat, face, top, bottom] = arr || [];
        setCurrentSkinIndex(skin    ?? 0);
        setCurrentHatIndex(hat      ?? 0);
        setCurrentFaceIndex(face    ?? 0);
        setCurrentTopIndex(top      ?? 0);
        setCurrentBottomIndex(bottom?? 0);
    

      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    if(user && user.sub) {
      fetchProfile();
    }
  }, [userId, getCredentials]);

  const updateAvatar = async (userId: string | undefined, avatarSelections: number[]) => {
    try {
      const credentials = await getCredentials();
      const token = credentials?.accessToken;

      const response = await fetch("https://capstone-runeroutes-wgp6.onrender.com/auth/update-avatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify({
          userId,
          avatarSelections: [
            currentSkinIndex,
            currentHatIndex,
            currentFaceIndex,
            currentTopIndex,
            currentBottomIndex,
          ],
        }),
      });
      
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}: ${JSON.stringify(data)}`);
      }
      console.log("Avatar updated: ", data);
    } catch (err) {
      console.error("Error sending user to backend:", err.message);
    }
  };



  // ADD BACKEND (THIS IS TEMPORARY STATS)
  const userStats = {
    distanceTraveled: totalExploredArea.toFixed(2), 
    poisDiscovered: 4, 
    currentStreak: 7, 
  };
  console.log('total explored area:', totalExploredArea)


  const handleNext = (type: string) => {
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

  const handlePrevious = (type: string) => {
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

  

  if (
    !profileData ||
    [currentSkinIndex, currentHatIndex, currentFaceIndex, currentTopIndex, currentBottomIndex].some(i => i === null || i === undefined)
  ) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.selector}>
        <Image source={skins[currentSkinIndex]} style={styles.avatarPart} resizeMode="contain" />
        {isCape && (
          <Image
            source={require("../assets/cape.png")} // Path to the cape image
            style={styles.CapePart} // Add a style for the cape
            resizeMode="contain"
          />
          )}
      </View>
      <View style={styles.avatarContainer}>
        {/* Hat Selector */}
        <View style={styles.selector}>
          <TouchableOpacity onPress={() => handlePrevious('hat')} style={styles.buttonHat}>
            <Ionicons name="chevron-back" size={60} color="black" />
          </TouchableOpacity>

          <Image 
            source={hats[currentHatIndex]} 
            style={[styles.HatPart, { top: hatOffsets[currentHatIndex] }]} 
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
              trackColor={{ false: "#767577", true: "#605795" }}
              thumbColor={isCape ? "#ffffff" : "#f4f3f4"} />
      </View>

      {/* User Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Distance Traveled: {userStats.distanceTraveled} m^2</Text>
        <Text style={styles.statsText}>POIs Discovered: {userStats.poisDiscovered}</Text>
        <Text style={styles.statsText}>Current Streak: {userStats.currentStreak} days</Text>
      </View>

      <View style={styles.changeMeContainer}>
        <Button title="Save Profile" onPress={() => updateAvatar(userId, [currentSkinIndex, currentHatIndex, currentFaceIndex, currentTopIndex, currentBottomIndex])} /> 
      </View>
    </View>
    </ScrollView>
  );
}
export default Profile;
