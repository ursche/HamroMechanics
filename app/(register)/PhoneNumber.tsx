import { UserContext } from '@/context/UserContext';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const PhoneNumber = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const router = useRouter();

  const userContext = useContext(UserContext);
  if (!userContext){
    return;
  }

  const { user, setUser } = userContext;


  const handleNext = () => {
    setUser(prev => ({
      ...prev,
      phone: phoneNumber
      }));

      router.push('/UserTypeSelect');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Join us via phone number</Text>
      <Text style={styles.subText}>We’ll text a code to verify your phone</Text>

      <View style={styles.inputWrapper}>
        <Text style={styles.flag}>🇳🇵</Text>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          placeholder="+977 98XXXXXXXX"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PhoneNumber;

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
    marginBottom: 25,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#aaa',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    marginBottom: 30,
  },
  flag: {
    fontSize: 20,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
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
