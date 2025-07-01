import { UserProvider } from "@/context/UserContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </UserProvider>
  );
}
