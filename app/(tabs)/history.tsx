import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import BASE_API_URL from "@/utils/baseApi";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const token = await SecureStore.getItemAsync("access_token");
    const res = await axios.get(`${BASE_API_URL}/history/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setHistory(res.data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Service History</Text>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.action}>{item.action}</Text>
            <Text style={styles.desc}>{item.description}</Text>
            <Text style={styles.time}>{item.timestamp}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flex: 1 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  card: {
    padding: 15,
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    marginBottom: 12,
  },
  action: { fontWeight: "bold", marginBottom: 5 },
  desc: { color: "#555" },
  time: { marginTop: 6, fontSize: 12, color: "#888" },
});
