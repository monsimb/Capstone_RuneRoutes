import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-space-between',
    alignItems: "center",
    backgroundColor: '#c0bae0',
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: '#605795',
    justifyContent: "top",
    marginTop: '10%',
    marginBottom: "8%",
  },
  statsContainer: {
    alignItems: 'center',
    marginTop: '4%',
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
  selectorContainer: {
    width: 300,
    height: 375,
    top: '17%',
    position: 'absolute',
  },
  skinSelector: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: '10%',
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: '5%',
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
    top: 70,
    zIndex: 1,
  },
  avatarContainer: {
    width: 300,
    height: 375,
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
    bottom: '95%',    // change the position of the face
    zIndex: 2,
  },
  TopPart: {
    width: 90,     // change the size of the top
    height: 165,
    bottom: '125%',    // change the position of the top
    zIndex: 3,
  },
  BottomPart: {
    width: 118,   // change the size of the bottom
    height: 135,
    left: 1,
    bottom: '1%',    // change the position of the bottom
    zIndex: 2,
  },
  CapePart: {
    position: 'absolute',
    width: 135,
    top: 43,
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
  arrows: {
    paddingHorizontal: '20%',
    top: '8%',
  },
  save: {
    alignItems: 'center',
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: "40%",
    alignItems: "center",
    marginTop: '5%',
  },
  saveText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});