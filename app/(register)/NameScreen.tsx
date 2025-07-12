import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const NameScreen = () => {
  const [firstName, setFirstName] = useState('');

  const handleNext = () => {
    console.log('Proceeding with name:', firstName);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to Hamro Mechanics!</Text>
      <Text style={styles.subText}>Please introduce yourself</Text>

      <TextInput
        style={styles.input}
        placeholder="First name"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subText: {
    fontSize: 15,
    color: '#555',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#aaa',
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 30,
  },
  nextButton: {
    backgroundColor: 'orange',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
