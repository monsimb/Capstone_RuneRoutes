import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
});
