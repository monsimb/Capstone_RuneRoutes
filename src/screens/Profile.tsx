import React, { useEffect, useState } from "react";
import { Button, Text, View, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth0 } from 'react-native-auth0';

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
  require("../assets/tops/top8.png"),
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

function Profile({ navigation }) {
  const [currentSkinIndex, setCurrentSkinIndex] = useState(0);
  const [currentHatIndex, setCurrentHatIndex] = useState(0);
  const [currentFaceIndex, setCurrentFaceIndex] = useState(0);
  const [currentTopIndex, setCurrentTopIndex] = useState(0);
  const [currentBottomIndex, setCurrentBottomIndex] = useState(0);
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

        // If avatarSelections exist, update the local indices to match
        if (data.avatarSelections && Array.isArray(data.avatarSelections)) {
          setCurrentSkinIndex(data.avatarSelections[0] ?? 0);
          setCurrentHatIndex(data.avatarSelections[1] ?? 0);
          setCurrentFaceIndex(data.avatarSelections[2] ?? 0);
          setCurrentTopIndex(data.avatarSelections[3] ?? 0);
          setCurrentBottomIndex(data.avatarSelections[4] ?? 0);
        }

      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    if(user && user.sub) {
      fetchProfile();
    }
  }, [user, userId, getCredentials]);

  const updateAvatar = async (userId, avatarSelections) => {
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
          avatarSelections,
        }),
      });
      
      const data = await response.json();
      console.log(data);
      console.log("Schmeh");
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
        <Image source={hats[currentHatIndex]} style={styles.HatPart} resizeMode="contain" />
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

      {/* User Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Distance Traveled: {userStats.distanceTraveled} km</Text>
        <Text style={styles.statsText}>POIs Discovered: {userStats.poisDiscovered}</Text>
        <Text style={styles.statsText}>Current Streak: {userStats.currentStreak} days</Text>
      </View>

      <View style={styles.changeMeContainer}>
        <Button title="Save Profile" onPress={() => updateAvatar(userId, [currentSkinIndex, currentHatIndex, currentFaceIndex, currentTopIndex, currentBottomIndex])} /> 
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
    fontSize: 22,
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
    width: 140,
    height: 120,
    padding: 10,
    left: 0,
    top: -330,
  },
  FacePart: {
    width: 50,
    height: 50,
    padding: 10,
    left: 0,
    top: -422,
  },
  TopPart: {
    width: 110,
    height: 110,
    padding: 10,
    left: 0,
    top: -475,
  },
  BottomPart: {
    width: 100,
    height: 100,
    padding: 10,
    left: -0,
    top: -520,
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
    top: -490, // change the position of the hat button
    padding: 15,
  },
  buttonBottom: {
    top: -520, // change the position of the hat button
    padding: 15,
  },
  changeMeContainer: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
  },
});
