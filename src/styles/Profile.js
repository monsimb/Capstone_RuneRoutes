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
    justifyContent: "top",
    marginTop: '6%',
    marginBottom: "8%",
  },
  statsContainer: {
    alignItems: 'center',
    marginTop: '5%',
  },
  statsText: {
    fontSize: 18,
    color: 'rgba(2, 2, 2, 0.75)',
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
    marginTop: '90%',
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: '6%',
  },
  toggleText: {
    fontSize: 18,
    marginRight: 10,
    color: "black",
    zIndex: 3,
  },
  avatarPart: {
    position: 'absolute',
    width: 100,
    height: 300,
    top: 50,
    zIndex: 1,
  },
  avatarContainer: {
    position: 'absolute',
    width: 300,
    height: 100,
    marginBottom: 20,
  },
  HatPart: {
    width: 135,   // change the size of the hat
    height: 120,
    padding: 10,
    left: 0,
    zIndex: 1,
  },
  FacePart: {
    width: 50,    // change the size of the face
    height: 50,
    padding: 0,
    right: 6,
    top: 53,    // change the position of the face
    zIndex: 2,
  },
  TopPart: {
    width: 100,     // change the size of the top
    height: 165,
    bottom: 112,    // change the position of the top
    zIndex: 3,
  },
  BottomPart: {
    width: 118,   // change the size of the bottom
    height: 135,
    left: 1,
    top: 95,    // change the position of the bottom
    zIndex: 2,
  },
  CapePart: {
    position: 'absolute',
    width: 135,
    top: 23,
    zIndex: 0, // Place it behind the avatar
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
    top: 80,
  },
  buttonFace: {
    top: 50, // change the position of the face button
    paddingHorizontal: '15%',
  },
  buttonTop: {
    bottom: 150, // change the position of the top button
    paddingHorizontal: '8%',
  },
  buttonBottom: {
    top: 105, // change the position of the bottom button
    paddingHorizontal: '5%',
  },
  changeMeContainer: {
    alignItems: 'center',
  },
});