import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import * as SecureStore from "expo-secure-store";
import { useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function LoginChoice() {
  const router = useRouter();

  useEffect(() => {
    const refresh = SecureStore.getItem("refresh_token");
    if (refresh){
      router.replace('/request');
    };
    
  })

  return (
    <View style={styles.container}>
      

      <Image
        source={require('@/assets/images/logo.png')} // Replace with your actual image
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>Your app for fair Gadi Service</Text>
      <Text style={styles.subtitle}>Sahar dekhi gaun samma</Text>

      <View style={styles.pagination}>
        <View style={styles.activeDot} />
        <View style={styles.inactiveDot} />
      </View>

      <TouchableOpacity style={styles.phoneButton} onPress={() => router.push('/PhoneNumber')}>
        <View style={styles.phoneContent}>
          <Feather name="phone" size={24} color="black" style={styles.phoneIcon} />
          <Text style={styles.buttonText}>Continue with phone</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleButton}>
        <View style={styles.googleContent}>
          <AntDesign name="google" size={24} color="black" style={styles.googleIcon} />
          <Text style={styles.googleText}>Continue with Google</Text>
        </View>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // White background
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoText: {
    color: '#FFA500', 
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  title: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFA500',
    margin: 5,
  },
  inactiveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#444',
    margin: 5,
  },
  phoneContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneIcon: {
    marginRight: 10,
  },
  phoneButton: {
    backgroundColor:'orange',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  googleButton: {
    backgroundColor: '#F3F2ED',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  googleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    marginRight: 10,
  },
  googleText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
});
