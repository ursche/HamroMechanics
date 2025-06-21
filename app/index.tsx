// app/index.tsx
import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function WelcomeScreen() {
  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Text>Welcome to our Auto Mobile service. We need a logo now</Text>
      {/* Link to login page */}
      <Link href="/LoginChoice" style={{ marginTop: 20, fontSize: 18, color: 'blue' }}>
        Go to Login
      </Link>
    </View>
  );
}
