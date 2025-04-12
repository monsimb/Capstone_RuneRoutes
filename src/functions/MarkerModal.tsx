import React, { useState } from 'react';
import { Modal, View, TextInput, Button } from 'react-native';
import { styles } from '../styles/Map';

const AddMarkerModal = ({ visible, onClose, onAddMarker }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = () => {
    onAddMarker({ id: Math.random().toString(), title, description });
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
          <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
          <Button title="Add Marker" onPress={handleAdd} />
          <Button title="Cancel" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};


export default AddMarkerModal;
