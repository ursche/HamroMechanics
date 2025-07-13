import Map from '@/app/Map';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';


export default function RequestService() {
  const [problemStatement, setProblemStatement] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [startRequest, setStartRequest] = useState<Boolean>(false);
  const [showRequestButton, setShowRequestButton] = useState<Boolean>(true);

  // Request permission and pick multiple images from gallery
  const pickImages = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Please grant gallery permissions to select images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.7,
      });

      if (!result.canceled && result.assets.length > 0) {
        const uris = result.assets.map(asset => asset.uri);
        setPhotos(prev => [...prev, ...uris]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick images: ' + (error as string));
    }
  };

  const handleRemove = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!problemStatement.trim()) {
      Alert.alert('Error', 'Please enter a problem statement.');
      return;
    }
    if (photos.length === 0) {
      Alert.alert('Error', 'Please attach at least one photo.');
      return;
    }

    console.log('Problem:', problemStatement);
    console.log('Photos:', photos);
    setStartRequest(false);
    Alert.alert('Submitted', 'Your request has been submitted.');
    // Send data to backend here
  };

  const handleRequestButton = () => {
    setShowRequestButton(false);
    setStartRequest(true);
  }


  if (startRequest){
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Problem Statement *</Text>
        <TextInput
          placeholder="Describe the issue..."
          style={[styles.input, styles.textArea]}
          value={problemStatement}
          onChangeText={setProblemStatement}
          multiline
          textAlignVertical="top"
        />
  
        <Text style={styles.label}>Photos *</Text>
        <View style={styles.photosContainer}>
          {photos.map((uri, idx) => (
            <View key={idx} style={styles.photoWrapper}>
              <Image source={{ uri }} style={styles.photo} />
              <Pressable style={styles.removeButton} onPress={() => handleRemove(idx)}>
                <Text style={styles.removeButtonText}>×</Text>
              </Pressable>
            </View>
          ))}
        </View>
  
        <TouchableOpacity style={styles.button} onPress={pickImages}>
          <Text style={styles.buttonText}>Attach Photos</Text>
        </TouchableOpacity>
  
        <TouchableOpacity style={[styles.button, { backgroundColor: 'orange' }]} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
  else{
    return (
      <View style={styles.mapContainer}>
        <Map />
        {showRequestButton && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.floatingButton} onPress={handleRequestButton}>
              <Text style={styles.buttonText}>Request</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  textArea: {
    height: 120,
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  photoWrapper: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 18,
  },
  button: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16,
  },
  mapContainer: {
    height: '100%',
    position: 'relative'
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    // backgroundColor: 'red',
    alignItems: 'center'
  },
  floatingButton: {
    width: '100%',
    backgroundColor: 'orange',
    paddingVertical: 12,
    alignItems: 'center',
    // borderRadius: 10,
  }
});
