// SettingsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Setting() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <SettingItem label="Profile Rating" />
      <SettingItem label="Request History"/>
      <SettingItem label="Language" sub="Default language" />
      <SettingItem label="Rules and Terms" />
      <SettingItem label="Help" />
      <SettingItem label="Safety" />
      <SettingItem label="Log out" />
      <TouchableOpacity>
        <Text style={styles.deleteText}>Delete account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function SettingItem({ label, sub }: { label: string; sub?: string }) {
  return (
    <TouchableOpacity style={styles.item}>
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
