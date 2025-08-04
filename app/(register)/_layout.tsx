import { AuthProvider } from "@/context/AuthContext";
import { UserProvider } from "@/context/UserContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <UserProvider>
        <Stack>
          <Stack.Screen name="LoginChoice" options={{ title: 'Choose a registration method' }} />
          <Stack.Screen name="MechanicForm" options={{ title: 'Mechanic Registration' }} />
          <Stack.Screen name="Name`Screen" options={{ title: '' }} />
          <Stack.Screen name="PhoneNumber" options={{ title: 'Enter Your Phone Number' }} />
          <Stack.Screen name="UserForm" options={{ title: 'User Registration' }} />
          <Stack.Screen name="UserTypeSelect" options={{ title: 'User Selection' }} />
        </Stack>
      </UserProvider>
    </AuthProvider>
  );
}
