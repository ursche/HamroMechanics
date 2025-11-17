import BASE_API_URL from '@/utils/baseApi';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function History() {
  const [history, setHistory] = useState([]);
  const [role, setRole] = useState();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const token = await SecureStore.getItemAsync('access_token');
        if (token) {
          const decoded = jwtDecode(token);
          setRole(decoded.role);
          console.log('--------------------------------------------');
          console.log({decoded});

          const res = await axios.get(`${BASE_API_URL}/api/history/list/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(res.data);
          setHistory(res.data);
        }
      };
      fetchData();
      
    }, []), // empty dependency array is fine
    
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Service History</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.action}>{item.action}</Text>
            <Text style={styles.desc}>{role === 'mechanic'?  item.user.full_name :item.mechanic.full_name}</Text>
            <Text style={styles.desc}>{item.description}</Text>
            <Text style={styles.time}>{item.timestamp}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  card: {
    padding: 15,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    marginBottom: 12,
  },
  action: { fontWeight: 'bold', marginBottom: 5 },
  desc: { color: '#555' },
  time: { marginTop: 6, fontSize: 12, color: '#888' },
});
