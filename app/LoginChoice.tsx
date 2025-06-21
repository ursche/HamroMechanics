import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LoginChoice() {
  return (
    <View style={styles.container}>
      

      <Image
        source={require('../assets/images/logo.png')} // Replace with your actual image
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>Your app for fair Gadi Service</Text>
      <Text style={styles.subtitle}>Sahar dekhi gaun samma</Text>

      <View style={styles.pagination}>
        <View style={styles.activeDot} />
        <View style={styles.inactiveDot} />
      </View>

      <TouchableOpacity style={styles.phoneButton}>
        <Text style={styles.buttonText}>Continue with phone</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleButton}>
        <Text style={styles.googleText}>Continue with Google</Text>
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
  googleText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
