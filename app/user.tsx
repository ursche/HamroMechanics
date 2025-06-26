// app/Login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Image } from 'react-native';

export default function Login() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [contactNo, setContactNo] = useState('');

  const handleSubmit = () => {
    if (!firstName || !lastName || !dob || !contactNo) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    Alert.alert('Success', `Welcome ${firstName} ${lastName}!`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Mechanic related image */}
      <Image
        source={{ uri: 'loginphoto.png' }} 
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>User Login</Text>

      <Text style={styles.label}>First Name</Text>
      <TextInput
        placeholder="First Name"
        placeholderTextColor="#aaa"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        placeholder="Last Name"
        placeholderTextColor="#aaa"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />

      <Text style={styles.label}>Date of Birth</Text>
      <TextInput
        placeholder="YYYY-MM-DD"
        placeholderTextColor="#aaa"
        value={dob}
        onChangeText={setDob}
        style={styles.input}
      />

      <Text style={styles.label}>Contact Number</Text>
      <TextInput
        placeholder="Contact Number"
        placeholderTextColor="#aaa"
        value={contactNo}
        onChangeText={setContactNo}
        style={styles.input}
        keyboardType="phone-pad"
      />

      <View style={styles.button}>
        <Button title="Submit" onPress={handleSubmit} color="#007AFF" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1a73e8',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#000',
  },
  button: {
    marginTop: 12,
  },
});
