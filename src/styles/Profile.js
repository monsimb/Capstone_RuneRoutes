import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-space-between',
    alignItems: "center",
    backgroundColor: 'rgba(208,188,180,1)',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: 'rgba(32, 0, 36, 0.75)',
    marginTop: 10,
  },
  statsContainer: {
    position: 'absolute',
    marginTop: '155%',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 22,
    color: 'rgba(0, 0, 0, 0.75)',
    marginVertical: 5,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  skinSelector: {
    flexDirection: "row",
    alignItems: "center",
    position: 'absolute',
    bottom: '29%',
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
  skinButton: {
    width: 60,
    height: 60,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e6e6e6',
    borderRadius: 10,
  },
  selectedSkinButton: {
    borderColor: 'purple',
  },
  skinPreview: {
    width: 60,
    height: 60,
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