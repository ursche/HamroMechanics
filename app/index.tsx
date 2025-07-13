// app/index.tsx
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';



export default function Index() {
    const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/LoginChoice');
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
      <View style={styles.container}>
        <Image
          source={require('../assets/images/logo.png')} // your logo image path
          style={styles.logo}
        />
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0dcd9', // optional background after splash
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#000'
  }
});


