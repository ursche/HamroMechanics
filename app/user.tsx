// app/Login.tsx
import React, { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

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
  title: {
    fontSize: 28,
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1a73e8',   // Blue color for title
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',     // Darker color for labels
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
    color: '#000',    // Text color inside input
  },
  button: {
    marginTop: 12,
  },
});
