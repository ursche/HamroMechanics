import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function MechanicForm() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [nationalId, setNationalId] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [license, setLicense] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [affiliatedTo, setAffiliatedTo] = useState('');
  const [affiliationProof, setAffiliationProof] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

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

  const handleSubmit = () => {
    if (!firstname || !lastname || !nationalId || !license) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    if (affiliatedTo && !affiliationProof) {
      Alert.alert('Error', 'Please upload proof of affiliation.');
      return;
    }

    Alert.alert('Success', 'Mechanic form submitted successfully!');
    // Add your form submission logic here
  };

  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
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
