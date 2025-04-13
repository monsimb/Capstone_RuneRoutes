import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-space-between',
    alignItems: "center",
    backgroundColor: 'rgba(208,188,180,1)',
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: '#605795',
    marginTop: 30,
    marginBottom: 30,
  },
  statsContainer: {
    position: 'absolute',
    marginTop: '150%',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 18,
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
    marginTop: '125%',
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    marginTop: '-140%',
  },
  toggleText: {
    fontSize: 18,
    marginRight: 10,
    color: "black",
    zIndex: 3,
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
  },
  FacePart: {
    width: 50,    // change the size of the face
    height: 50,
    padding: 10,
    right: 6,
    top: -423,    // change the position of the face
  },
  TopPart: {
    width: 100,     // change the size of the top
    height: 165,
    top: -628,    // change the position of the top
  },
  BottomPart: {
    width: 118,   // change the size of the bottom
    height: 135,
    left: 1,
    top: -422,    // change the position of the bottom
  },
  skinButton: {
    width: 50,
    height: 50,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e6e6e6',
    borderRadius: 10,
  },
  selectedSkinButton: {
    borderColor: '#605795',
  },
  skinPreview: {
    width: 60,
    height: 60,
  },
  buttonHat: {
    top: -360, // change the position of the hat button
  },
  buttonFace: {
    top: -430, // change the position of the face button
    padding: 45,
  },
  buttonTop: {
    top: -655, // change the position of the top button
    padding: 15,
  },
  buttonBottom: {
    top: -390, // change the position of the bottom button
    padding: 10,
  },
});
