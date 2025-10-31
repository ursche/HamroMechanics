// // app/Login.tsx
// import React, { useState } from 'react';
// import { Alert, Button, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

// export default function UserForm() {
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [dob, setDob] = useState('');
//   const [contactNo, setContactNo] = useState('');

//   const handleSubmit = () => {
//     if (!firstName || !lastName || !dob || !contactNo) {
//       Alert.alert('Error', 'Please fill all fields');
//       return;
//     }
//     Alert.alert('Success', `Welcome ${firstName} ${lastName}!`);
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {/* Mechanic related image */}
//       <Image
//         source={{ uri: 'loginphoto.png' }} 
//         style={styles.image}
//         resizeMode="contain"
//       />

//       <Text style={styles.title}>User Login</Text>

//       <Text style={styles.label}>First Name</Text>
//       <TextInput
//         placeholder="First Name"
//         placeholderTextColor="#aaa"
//         value={firstName}
//         onChangeText={setFirstName}
//         style={styles.input}
//       />

//       <Text style={styles.label}>Last Name</Text>
//       <TextInput
//         placeholder="Last Name"
//         placeholderTextColor="#aaa"
//         value={lastName}
//         onChangeText={setLastName}
//         style={styles.input}
//       />

//       <Text style={styles.label}>Date of Birth</Text>
//       <TextInput
//         placeholder="YYYY-MM-DD"
//         placeholderTextColor="#aaa"
//         value={dob}
//         onChangeText={setDob}
//         style={styles.input}
//       />

//       <Text style={styles.label}>Contact Number</Text>
//       <TextInput
//         placeholder="Contact Number"
//         placeholderTextColor="#aaa"
//         value={contactNo}
//         onChangeText={setContactNo}
//         style={styles.input}
//         keyboardType="phone-pad"
//       />

//       <View style={styles.button}>
//         <Button title="Submit" onPress={handleSubmit} color="orange" />
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   image: {
//     width: 120,
//     height: 120,
//     alignSelf: 'center',
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 28,
//     marginBottom: 30,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     color: 'black',
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 6,
//     color: '#333',
//     fontWeight: '600',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#888',
//     borderRadius: 6,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     marginBottom: 20,
//     fontSize: 16,
//     color: '#000',
//   },
//   button: {
//     marginTop: 12,
    
//   },
// });


import { UserContext } from '@/context/UserContext';
import BASE_API_URL from '@/utils/baseApi';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

// for saving access and refresh token for auth
import saveTokens from '@/utils/saveTokens';

export default function MechanicForm() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  
  const router = useRouter();

  // User Context. For user registration
  const userContext = useContext(UserContext);
  if (!userContext){
    return;
  }

  const {user, setUser} = userContext;

  

  const handleSubmit = async () => {
    if (!firstname || !lastname) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }
  
    // const formData = new FormData();
  
    // formData.append('phone', user.phone);
    // formData.append('email', user.email);
    // formData.append('role', user.role);
    // formData.append('password', user.password);
  
    // formData.append('full_name', `${firstname} ${lastname}`);

    const userData = {
      'phone': user.phone,
      'email': user.email,
      'role': user.role,
      'password': user.password,
      'full_name': `${firstname} ${lastname}`
    };

  
    try {
      const response = await axios.post(
        `${BASE_API_URL}/api/users/register/`,
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data;
      await saveTokens(data.access, data.refresh);

      // dont save password in state after registering
      setUser({
        full_name: data.user.full_name,
        email: data.user.email,
        role: data.user.role,
        phone: data.user.phone,
        password: "",
      });
  
      console.log('Success:', response.data);
      router.push('/request');
    } catch (err: any) {
      // console.error('Registration failed:', err.response?.data || err.message);
      Alert.alert(`Registration failed: ${err.response?.data["phone"] || 'Something went wrong.'}`);
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.label}>First Name *</Text>
      <TextInput style={styles.input} value={firstname} onChangeText={setFirstname} />

      <Text style={styles.label}>Last Name *</Text>
      <TextInput style={styles.input} value={lastname} onChangeText={setLastname} />

      <Pressable
        onPress={handleSubmit}
        style={({ pressed }) => [
          styles.submitButton,
          pressed && styles.submitButtonPressed,
        ]}
      >
        <Text style={styles.submitButtonText}>Submit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    // marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    // marginBottom: 20,
    fontSize: 16,
    color: '#000',
  },
  submitButton: {
    backgroundColor: 'orange',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonPressed: {
    backgroundColor: '#388E3C',
  },
  submitButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
