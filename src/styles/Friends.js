import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#605795",
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    justifyContent: "top",
    alignItems: "center",
    marginBottom: "5%",
  },
  listContainer: {
    width: "100%",
    marginBottom: 20,
    alignItems: 'center',
  },
  friendCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 15,
    marginBottom: 12,
    height: 110,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  friendIcon: {
    width: 50,
    height: 90,
    borderRadius: 1,
    marginRight: 10,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  friendMiles: {
    fontSize: 14,
    color: "#666",
  },
  addButton: {
    backgroundColor: "#f3d88b",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
    width: "80%",
    alignItems: "center",
    marginTop: '5%',
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },




  // AI GENERATED: Some tweaking likely necessary... [place holder for now]
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    textDecorationColor: '#ffff',
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#aaa',
    padding: 10,
    borderRadius: 5,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
});