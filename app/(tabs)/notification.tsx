  import BASE_API_URL from '@/utils/baseApi';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';

import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';

const NotificationPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const router = useRouter();

    const API_URL = `${BASE_API_URL}/api/tracking/notifications/list/`;

    useFocusEffect(
      useCallback(() => {
        const fetchData = async () => {
          try {
            const token = await SecureStore.getItemAsync('access_token');
            if (token) {
              const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` },
              });
              const notif = response!.data.filter((n: any) => n.accepted === false);
              console.log('----------------------');
              console.log(notif);
              
              setNotifications(notif);
            }
          } catch (error) {
            console.error('Error fetching notifications:', error);

          } finally {
            setLoading(false);

          }

        }
          fetchData();

      }, [])
    );

    const handleAccept = async (notificationId: number) => {
      const access = await SecureStore.getItemAsync("access_token");
      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        const lat = currentLocation.coords.latitude;
        const lng = currentLocation.coords.longitude;

        const response = await axios.post(
          `${BASE_API_URL}/api/tracking/notifications/accept/${notificationId}/?lat=${lat}&lng=${lng}`,
          {},
          { headers: { Authorization: `Bearer ${access}`, "Content-Type": 'application-json' } }
        );

        Alert.alert("Success", "Request accepted!");

        // Optionally update the local notification list
        setNotifications(prev =>
          prev.map(n =>
            n.id === notificationId ? { ...n, accepted: true } : n
          )
        );

        router.push("/request");

      } catch (err: any) {
        Alert.alert("Error", err.response?.data?.detail || "Something went wrong");
      }
    };

    const handleReject = async (notificationId: number) => {
      const access = await SecureStore.getItemAsync("access_token");
      try {
        const response = await axios.post(
          `${BASE_API_URL}/api/tracking/notifications/reject/${notificationId}/`,
          {},
          { headers: { Authorization: `Bearer ${access}`, "Content-Type": 'application-json' } }
        );

        Alert.alert("Success", "Request Rejected!");

        // Optionally update the local notification list
        setNotifications(prev =>
          prev.map(n =>
            n.id === notificationId ? { ...n, rejected: true } : n
          )
        );


      } catch (err: any) {
        Alert.alert("Error", err.response?.data?.detail || "Something went wrong");
      }
    };

    const openImageModal = (uri) => {
      setSelectedImage(uri);
      setModalVisible(true);
    };

    const renderItem = ({ item }) => (
      <View style={styles.notificationCard}>
        <Text style={styles.userText}>
          From: {item.from_user.full_name} → To: {item.to_user.full_name}
        </Text>
        <Text
          style={[styles.statusText, item.accepted ? styles.accepted : styles.pending]}
        >
          {item.accepted ? 'Accepted' : item.rejected? 'Rejected':  'Pending'}
        </Text>

        {item.images && item.images.length > 0 && (
          <FlatList
            horizontal
            data={item.images}
            keyExtractor={(img) => img.id.toString()}
            renderItem={({ item: img }) => (
              <TouchableOpacity onPress={() => openImageModal(img.image)}>
                <Image source={{ uri: img.image }} style={styles.notificationImage} />
              </TouchableOpacity>
            )}
            style={{ marginTop: 10 }}
          />
        )}

        {(!item.accepted || item.rejected) && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={() => handleAccept(item.id)}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={() => handleReject(item.id)}
            >
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );

    if (loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      );
    }

    return (
      notifications && (
        <View style={{ flex: 1 }}>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.container}
        />

        {/* Modal for fullscreen image */}
        <Modal visible={modalVisible} transparent={true}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalBackground}
              onPress={() => setModalVisible(false)}
              activeOpacity={1}
            >
              <Image source={{ uri: selectedImage }} style={styles.fullImage} />
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
      )
    );
  };

  const styles = StyleSheet.create({
    container: {
      padding: 10,
      paddingBottom: 20,
    },
    notificationCard: {
      backgroundColor: '#fff',
      padding: 15,
      marginBottom: 15,
      borderRadius: 15,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    userText: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 5,
    },
    statusText: {
      marginBottom: 10,
      fontWeight: '600',
    },
    accepted: {
      color: 'green',
    },
    pending: {
      color: 'orange',
    },
    notificationImage: {
      width: 90,
      height: 90,
      marginRight: 10,
      borderRadius: 12,
    },
    buttonContainer: {
      flexDirection: 'row',
      marginTop: 12,
      justifyContent: 'space-between',
    },
    button: {
      flex: 0.48,
      paddingVertical: 10,
      borderRadius: 10,
      alignItems: 'center',
    },
    acceptButton: {
      backgroundColor: '#4CAF50',
    },
    rejectButton: {
      backgroundColor: '#F44336',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    loading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.9)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalBackground: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    fullImage: {
      width: '90%',
      height: '70%',
      resizeMode: 'contain',
      borderRadius: 15,
    },
  });

  export default NotificationPage;
