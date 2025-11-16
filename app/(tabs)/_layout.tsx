import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";

export default function RootLayout(){
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: 'orange',
            headerStyle: {
                backgroundColor: '#25292e',
            },
            headerShadowVisible: false,
            headerTintColor: '#fff',
            tabBarStyle: {
                backgroundColor: '#25292e',
            },
        }}
        >
            <Tabs.Screen
            name="request"
            options={{
                title: 'Request',
                tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused? "car-sharp": "car-outline"} size={24} color={color} />
                ),
            }}
            />

            <Tabs.Screen
            name="notification"
            options={{
                title: 'Notifications',
                tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused? "notifications-sharp": "notifications-outline"} size={24} color={color} />
                ),
            }}
            />

            <Tabs.Screen
            name="setting"
            options={{
                title: 'Settings',
                tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused? "settings-sharp" :"settings-outline"} size={24} color={color} />
                ),
            }}
            />

            <Tabs.Screen
            name="history"
            options={{
                title: 'History',
                tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused? "hourglass-sharp" :"hourglass-outline"} size={24} color={color} />
                ),
            }}
            />



        </Tabs>
    )
}