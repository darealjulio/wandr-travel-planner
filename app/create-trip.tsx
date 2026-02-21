import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useTrips } from '@/providers/TripProvider';

export default function CreateTripScreen() {
  const router = useRouter();
  const { addTrip } = useTrips();
  const [destination, setDestination] = useState('');
  const [country, setCountry] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleCreate = () => {
    if (!destination || !country || !startDate || !endDate) return;
    
    addTrip({
      id: Date.now().toString(),
      destination,
      country,
      startDate,
      endDate,
      status: 'upcoming',
      coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
      description: '',
      budget: { total: 0, spent: 0, currency: 'USD' },
      tags: [],
      travelers: 1,
      tripType: 'Leisure',
      itinerary: [],
    });
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={Colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.title}>New Trip</Text>
        <TouchableOpacity onPress={handleCreate}>
          <Text style={styles.createBtn}>Create</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Destination</Text>
          <TextInput
            style={styles.input}
            value={destination}
            onChangeText={setDestination}
            placeholder="e.g. Paris"
            placeholderTextColor={Colors.dark.textMuted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Country</Text>
          <TextInput
            style={styles.input}
            value={country}
            onChangeText={setCountry}
            placeholder="e.g. France"
            placeholderTextColor={Colors.dark.textMuted}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>Start Date</Text>
            <TextInput
              style={styles.input}
              value={startDate}
              onChangeText={setStartDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={Colors.dark.textMuted}
            />
          </View>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>End Date</Text>
            <TextInput
              style={styles.input}
              value={endDate}
              onChangeText={setEndDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={Colors.dark.textMuted}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20,
    borderBottomWidth: 1, borderBottomColor: Colors.dark.border,
  },
  title: { fontSize: 18, fontWeight: '700', color: Colors.dark.text },
  createBtn: { fontSize: 16, color: Colors.dark.primary, fontWeight: '600' },
  form: { padding: 20 },
  field: { marginBottom: 20 },
  row: { flexDirection: 'row', gap: 12 },
  label: { fontSize: 13, color: Colors.dark.textSecondary, marginBottom: 8, fontWeight: '600' },
  input: {
    backgroundColor: Colors.dark.surface, borderRadius: 12,
    padding: 14, color: Colors.dark.text, fontSize: 15,
    borderWidth: 1, borderColor: Colors.dark.border,
  },
});
