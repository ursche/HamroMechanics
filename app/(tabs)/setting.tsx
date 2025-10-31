// SettingsScreen.tsx
import BASE_API_URL from '@/utils/baseApi';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { router, useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import * as SecureStorage from 'expo-secure-store';

const handleLogout = async () => {
  try{
    const accessToken = await SecureStorage.getItemAsync("access_token");
    const refreshToken = await SecureStorage.getItemAsync("refresh_token");

    await axios.post(`${BASE_API_URL}/api/users/logout/`, {'refresh': refreshToken}, {
      headers: {Authorization: `Bearer ${accessToken}`},
      
    });
  }catch(e){
    console.error(e);
  }

  SecureStorage.deleteItemAsync("access_token");
  SecureStorage.deleteItemAsync("refresh_token");

  router.replace('/LoginChoice');
}

const handleDeleteAccount = async () => {
  Alert.alert(
    "Confirm Deletion",
    "Are you sure you want to delete your account? This action cannot be undone.",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const accessToken = await SecureStorage.getItemAsync("access_token");
            await axios.delete(`${BASE_API_URL}/api/users/delete/`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });

            await SecureStorage.deleteItemAsync("access_token");
            await SecureStorage.deleteItemAsync("refresh_token");
            router.replace("/LoginChoice");
            alert("Your account has been deleted.");
          } catch (error) {
            console.error(error);
            alert("Could not delete your account. Please try again.");
          }
        },
      },
    ]
  );
};

export default function Setting() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <SettingItem label="Profile Rating" />
      <SettingItem label="Request History"/>
      <SettingItem label="Language" sub="Default language" />
      <SettingItem label="Rules and Terms" />
      <SettingItem label="Help" />
      <SettingItem label="Safety" />
      <SettingItem label="Log out" onPress={handleLogout} />
      <TouchableOpacity onPress={handleDeleteAccount}>
        <Text style={styles.deleteText}>Delete account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function SettingItem({ label, sub, onPress }: { label: string; sub?: string; onPress?: VoidFunction}) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View>
        <Text style={styles.label}>{label}</Text>
        {sub && <Text style={styles.sub}>{sub}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
  },
  sub: {
    fontSize: 14,
    color: '#888',
  },
  deleteText: {
    color: 'red',
    fontSize: 16,
    marginTop: 30,
  },
});
