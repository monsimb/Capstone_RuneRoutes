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
    marginBottom: 30,
  },
  statsContainer: {
    position: 'absolute',
    marginTop: '163%',
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
    bottom: '25%',
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
    width: 135,   // change the size of the hat
    height: 120,
    padding: 10,
    left: 0,
    top: -330,    // change the position of the hat
    zIndex: 0,
  },
  FacePart: {
    width: 50,    // change the size of the face
    height: 50,
    padding: 10,
    left: 0,
    top: -422,    // change the position of the face
  },
  TopPart: {
    width: 100,     // change the size of the top
    height: 165,
    top: -628,    // change the position of the top
//    zIndex: 3,
  },
  BottomPart: {
    width: 121,   // change the size of the bottom
    height: 135,
    left: 0,
    top: -422,    // change the position of the bottom
//    zIndex: 1,
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
    top: -655, // change the position of the top button
    padding: 15,
  },
  buttonBottom: {
    top: -390, // change the position of the bottom button
    padding: 15,
  },
});
