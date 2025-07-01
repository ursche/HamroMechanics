import { UserProvider } from "@/context/UserContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="LoginChoice" options={{ title: '' }} />
        <Stack.Screen name="MechanicForm" options={{ title: 'Mechanic Registration' }} />
        <Stack.Screen name="NameScreen" options={{ title: '' }} />
        <Stack.Screen name="PhoneNumber" options={{ title: '' }} />
        <Stack.Screen name="UserForm" options={{ title: 'User Registration' }} />
        <Stack.Screen name="UserTypeSelect" options={{ title: '' }} />
        <Stack.Screen name="Map" options={{ headerShown: false, title: '' }} />
      </Stack>
    </UserProvider>
  );
}
