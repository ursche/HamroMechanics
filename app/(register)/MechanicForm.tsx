import { UserContext } from '@/context/UserContext';
import BASE_API_URL from '@/utils/baseApi';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// for saving access and refresh token for auth
import saveTokens from '@/utils/saveTokens';

export default function MechanicForm() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [nationalId, setNationalId] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [license, setLicense] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [experienceYears, setExperienceYears] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [affiliatedTo, setAffiliatedTo] = useState('');
  const [affiliationProof, setAffiliationProof] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const router = useRouter();

  // User Context. For user registration
  const userContext = useContext(UserContext);
  if (!userContext) {
    return null;
  }

  const { user, setUser } = userContext;

  const [lat, setLat] = useState<Number>();
  const [lng, setLng] = useState<Number>();

  useEffect(() => {
      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission to access location was denied');
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        setLat(loc.coords.latitude);
        setLng(loc.coords.longitude);
      })();
    }, []);
    if (!location) return null;



  const pickDocument = async (
    setter: React.Dispatch<React.SetStateAction<DocumentPicker.DocumentPickerAsset | null>>
  ) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
      });

      if (!result.canceled && result.assets.length > 0) {
        setter(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document: ' + error);
    }
  };

  const fileToBase64 = async (fileUri: string) => {
    return await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  };

  const handleSubmit = async () => {
    if (!firstname || !lastname || !nationalId || !license) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    if (affiliatedTo && !affiliationProof) {
      Alert.alert('Error', 'Please upload proof of affiliation.');
      return;
    }

    const formData = new FormData();

    formData.append('phone', user.phone);
    formData.append('email', user.email);
    formData.append('role', user.role);
    formData.append('password', user.password);

    formData.append('full_name', `${firstname} ${lastname}`);
    formData.append('affiliated_to', affiliatedTo);
    formData.append('specialization', specialization);
    formData.append('experience_years', experienceYears);

    formData.append('current_lat', String(lat));
    formData.append('current_lng', String(lng));

    formData.append('citizenship_doc', {
      uri: nationalId.uri,
      name: nationalId.name,
      type: nationalId.mimeType || 'application/pdf',
    });

    formData.append('license_doc', {
      uri: license.uri,
      name: license.name,
      type: license.mimeType || 'application/pdf',
    });

    if (affiliationProof) {
      formData.append('company_affiliation_doc', {
        uri: affiliationProof.uri,
        name: affiliationProof.name,
        type: affiliationProof.mimeType || 'application/pdf',
      });
    }

    try {
      const response = await axios.post(`${BASE_API_URL}/api/users/register/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data;
      await saveTokens(data.access, data.refresh);

      // don’t save password in state after registering
      setUser({
        full_name: data.user.full_name,
        email: data.user.email,
        role: data.user.role,
        phone: data.user.phone,
        password: '',
      });

      console.log('Success:', response.data);
      router.push('/request');
    } catch (err: any) {
      console.error('Upload error:', err.response?.data || err.message);
      Alert.alert('Upload failed', err.response?.data?.detail || 'Something went wrong.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.label}>First Name *</Text>
          <TextInput style={styles.input} value={firstname} onChangeText={setFirstname} />

          <Text style={styles.label}>Last Name *</Text>
          <TextInput style={styles.input} value={lastname} onChangeText={setLastname} />

          <Text style={styles.label}>Citizenship or National ID Card *</Text>
          <View style={styles.fileContainer}>
            <Pressable style={styles.fileButton} onPress={() => pickDocument(setNationalId)}>
              <Text>{nationalId ? nationalId.name : 'Select File'}</Text>
            </Pressable>
            {nationalId && (
              <Pressable onPress={() => setNationalId(null)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>Remove</Text>
              </Pressable>
            )}
          </View>

          <Text style={styles.label}>License *</Text>
          <View style={styles.fileContainer}>
            <Pressable style={styles.fileButton} onPress={() => pickDocument(setLicense)}>
              <Text>{license ? license.name : 'Select File'}</Text>
            </Pressable>
            {license && (
              <Pressable onPress={() => setLicense(null)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>Remove</Text>
              </Pressable>
            )}
          </View>

          <Text style={styles.label}>Experience Years *</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={experienceYears}
            onChangeText={setExperienceYears}
          />

          <Text style={styles.label}>Specialization *</Text>
          <TextInput style={styles.input} value={specialization} onChangeText={setSpecialization} />

          <Text style={styles.label}>Affiliated To (Optional)</Text>
          <TextInput style={styles.input} value={affiliatedTo} onChangeText={setAffiliatedTo} />

          {affiliatedTo.length > 0 && (
            <>
              <Text style={styles.label}>Proof of Affiliation *</Text>
              <View style={styles.fileContainer}>
                <Pressable style={styles.fileButton} onPress={() => pickDocument(setAffiliationProof)}>
                  <Text>{affiliationProof ? affiliationProof.name : 'Select File'}</Text>
                </Pressable>
                {affiliationProof && (
                  <Pressable onPress={() => setAffiliationProof(null)} style={styles.removeButton}>
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </Pressable>
                )}
              </View>
            </>
          )}

          <Pressable
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.submitButtonPressed,
            ]}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 50,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  fileButton: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  removeButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: 'orange',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonPressed: {
    backgroundColor: '#388E3C',
  },
  submitButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
