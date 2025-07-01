import { UserContext } from '@/context/UserContext';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const UserTypeSelect = () => {

  const router = useRouter();

  const userContext = useContext(UserContext);
  if (!userContext){
    return;
  }
  const {user, setUser} = userContext;
  console.log(user);


  const handleUserRole = () => {
    setUser(prev => ({
      ...prev,
      role: 'customer',
    }));

    router.push('/UserForm');
  }

  const handleMechanicRole = () => {
    setUser(prev => ({
      ...prev,
      role: 'mechanic',
    }));

    router.push('/MechanicForm');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Are you a user or a mechanic?</Text>
      <Text style={styles.subText}>You can change the mode later</Text>

      <Image source={require('../assets/images/loginphoto.png')} style={styles.image} />

      <TouchableOpacity
        style={styles.userButton}
        onPress={handleUserRole}  
      >
        <Text style={styles.buttonText}>User</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.mechanicButton}
        onPress={handleMechanicRole} 
      >
        <Text style={styles.buttonText}>Mechanic</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  userButton: {
    backgroundColor: 'orange',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  mechanicButton: {
    backgroundColor: 'orange',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UserTypeSelect;
