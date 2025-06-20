import { Link } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

export default function WelcomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to our Auto Mobile service. We need a logo now</Text>

      {/* Navigation to login screen */}
      <Link href="/login" asChild>
        <Text style={{ marginTop: 20, fontSize: 18, color: 'blue' }}>
          Go to Login
        </Text>
      </Link>
    </View>
  );
}
