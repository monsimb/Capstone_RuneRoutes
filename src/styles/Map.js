import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
      map: {
        flex: 1,
      },
      markerViewContainer: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      marker: {
        height: 40,
        width: 40,
        backgroundColor: 'red',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
      },
      markerText: {
        color: 'white',
        fontWeight: 'bold',
      },
      modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
      },
      modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
      },
      markerContainer: {
        alignItems: 'center',
      },
      markerTitleContainer: {
        backgroundColor: 'white',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginTop: 2,
        borderWidth: 1,
        borderColor: '#5b4087',
      },
      markerTitle: {
        color: '#5b4087',
        fontSize: 12,
        fontWeight: 'bold',
      },
      modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#5b4087',
        textAlign: 'center',
      },
      markerImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 15,
      },
      noImageContainer: {
        width: '100%',
        height: 200,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 15,
      },
      noImageText: {
        color: '#666',
      },
      descriptionLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#5b4087',
      },
      descriptionText: {
        fontSize: 16,
        marginBottom: 20,
        lineHeight: 24,
        color: 'black'
      },
      markerButtonContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 10,
      },
      button: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 5,
      },
      deleteButton: {
        backgroundColor: '#ff4444',
      },
      closeButton: {
        backgroundColor: '#5b4087',
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
        color: 'black'
      },
    buttonContainer: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3.84,
        elevation: 5,
    },
    recenterButtonContainer: {
      position: 'absolute',
      bottom: 15,
      right: 15,
    },
    recenterButton: {
      backgroundColor: '#ffecb5',
      opacity: 0.9,
      padding: 3,
      elevation: 5,
    },
    poiImage: {
      width: '100%',
      height: 200,
      borderRadius: 12,
      marginBottom: 10,
    },
  clearRouteButtonContainer: {
    position: 'absolute',
    bottom: 80,
    right: 1,
    zIndex: 10,
  },
  clearRouteButton: {
      opacity: 0.9,
      opacity: 0.9,
      padding: 3,
      elevation: 5,
    },
  });