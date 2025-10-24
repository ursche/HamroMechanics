import { UserContext } from '@/context/UserContext';
import saveTokens from '@/utils/saveTokens';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';


import BASE_API_URL from '@/utils/baseApi';

const PasswordScreen = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const userContext = useContext(UserContext);
  if (!userContext) {
    return null;
  }

  const { user, setUser } = userContext;

  const handleNext = async () => {
    setUser(prev => ({
      ...prev,
      password: password,
    }));

    const formData = new FormData();

    formData.append('phone', user.phone);
    formData.append('password', password)

    try{
      const response = await axios.post(
        `${BASE_API_URL}/api/users/token/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const data = response.data;
      await saveTokens(data.access, data.refresh);
      console.log(data);
      

  
      // console.log('Register login Response:', response.data);

      if (data){

        router.push('/request');
      }
      router.push('/UserTypeSelect');

    } catch (err: any) {
      // console.error('Upload error:', err.response?.data || err.message);
      // Alert.alert('Upload failed', err.response?.data?.detail || 'Something went wrong.');
      router.push('/UserTypeSelect');
    }
    

  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Password</Text>
      <Text style={styles.subText}>
        Your password must be at least 6 characters
      </Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.toggleText}>
            {showPassword ? 'Hide' : 'Show'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PasswordScreen;

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
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  toggleText: {
    fontSize: 14,
    color: 'blue',
    marginLeft: 10,
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
