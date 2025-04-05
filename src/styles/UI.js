// styles for Auth.tsx and Settings.tsx

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#6159a2",
		padding: 20,
	  },
	  backButton: {
		position: 'absolute',
		top: 40,
		//bottom: 90,
		left: 20,
		zIndex: 1,
	  },
	  title: {
		fontSize: 36,
		fontWeight: "bold",
		color: "white",
		justifyContent: "top",
		alignItems: "center",
		marginTop: "45%",
		bottom: "30%",
	  },
	  welcomeTitle: {
		fontSize: 44,
		fontWeight: "bold",
		textAlign: "center",
		marginTop: "-5%",
		marginBottom: "30%",
		marginHorizontal: "10%",
		color: "white",
	  },
	imageContainer: {
		width: 200,
		height: 200,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: "10%",
		marginTop: '-50%',
	  },
	image: {
		width: "100%",
		height: "100%",
	  },
	getStartedButton: {
	  backgroundColor: "#4CAF50",
	  paddingVertical: 12,
	  paddingHorizontal: 30,
	  borderRadius: 5,
	  width: "80%",
	  alignItems: "center",
	  marginBottom: "-15%",
	},
	logoutButton: {
	  backgroundColor: "#FF6347",
	  paddingVertical: 12,
	  paddingHorizontal: 30,
	  borderRadius: 5,
	  width: "80%",
	  alignItems: "center",
	  marginTop: 20,
	},
	toggleContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 20,
	},
	toggleText: {
		fontSize: 16,
		marginRight: 10,
		color: "white",
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "black",
		marginBottom: 10,
	  },
	  fogOptionsContainer: {
		flexDirection: "row",
		justifyContent: "center",
		marginBottom: 20,
	  },
	  fogOptionButton: {
		padding: 10,
		marginHorizontal: 5,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: "purple",
		backgroundColor: "#fff",
	  },
	  fogOptionSelected: {
		backgroundColor: "purple",
	  },
	  fogOptionText: {
		color: "purple",
		fontWeight: "bold",
	  },
	  fogOptionTextSelected: {
		color: "#fff",
	  },
	buttonText: {
	  color: "#FFF",
	  fontSize: 16,
	  fontWeight: "bold",
	},
	userIdText: {
	  color: "white",
	  fontSize: 18,
	  marginBottom: 20,
	},
  });

  