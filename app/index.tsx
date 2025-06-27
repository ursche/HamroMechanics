// app/index.tsx
import Map from '@/components/Map';
import { Link, useNavigation } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState<Boolean>(true);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: !isAuthenticated,
      title: 'Home',
    });
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return (
      <Map />
    )
  } else {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <Text>Welcome to our Auto Mobile service. We need a logo now</Text>
        {/* Link to login page */}
        <Link href="/LoginChoice" style={{ marginTop: 20, fontSize: 18, color: 'blue' }}>
          Go to Login
        </Link>
    </View>
    )
  }
}

export const options = {
  title: 'Home',
};