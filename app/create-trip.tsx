import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, TextInput, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useTrips } from '@/providers/TripProvider';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(dateStr: string): boolean {
  if (!DATE_REGEX.test(dateStr)) return false;
  const d = new Date(dateStr + 'T00:00:00');
  return !isNaN(d.getTime());
}

export default function CreateTripScreen() {
  const router = useRouter();
  const { addTrip } = useTrips();
  const [destination, setDestination] = useState('');
  const [country, setCountry] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState('1');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!destination.trim()) newErrors.destination = 'Destination is required';
    if (destination.length > 100) newErrors.destination = 'Max 100 characters';
    if (!country.trim()) newErrors.country = 'Country is required';
    if (country.length > 60) newErrors.country = 'Max 60 characters';
    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    } else if (!isValidDate(startDate)) {
      newErrors.startDate = 'Use YYYY-MM-DD format';
    }
    if (!endDate) {
      newErrors.endDate = 'End date is required';
    } else if (!isValidDate(endDate)) {
      newErrors.endDate = 'Use YYYY-MM-DD format';
    }
    if (isValidDate(startDate) && isValidDate(endDate) && new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    const travelersNum = parseInt(travelers, 10);
    if (isNaN(travelersNum) || travelersNum < 1 || travelersNum > 999) {
      newErrors.travelers = 'Enter a number between 1 and 999';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;

    addTrip({
      id: `trip-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      destination: destination.trim(),
      country: country.trim(),
      startDate,
      endDate,
      status: 'upcoming',
      coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
      description: '',
      budget: { total: 0, spent: 0, currency: 'USD' },
      tags: [],
      travelers: parseInt(travelers, 10),
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

      <ScrollView style={styles.form} keyboardShouldPersistTaps="handled">
        <View style={styles.field}>
          <Text style={styles.label}>Destination</Text>
          <TextInput
            style={[styles.input, errors.destination && styles.inputError]}
            value={destination}
            onChangeText={(t) => { setDestination(t); setErrors(e => ({ ...e, destination: '' })); }}
            placeholder="e.g. Paris"
            placeholderTextColor={Colors.dark.textMuted}
            maxLength={100}
          />
          {errors.destination ? <Text style={styles.errorText}>{errors.destination}</Text> : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Country</Text>
          <TextInput
            style={[styles.input, errors.country && styles.inputError]}
            value={country}
            onChangeText={(t) => { setCountry(t); setErrors(e => ({ ...e, country: '' })); }}
            placeholder="e.g. France"
            placeholderTextColor={Colors.dark.textMuted}
            maxLength={60}
          />
          {errors.country ? <Text style={styles.errorText}>{errors.country}</Text> : null}
        </View>

        <View style={styles.row}>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>Start Date</Text>
            <TextInput
              style={[styles.input, errors.startDate && styles.inputError]}
              value={startDate}
              onChangeText={(t) => { setStartDate(t); setErrors(e => ({ ...e, startDate: '' })); }}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={Colors.dark.textMuted}
              maxLength={10}
            />
            {errors.startDate ? <Text style={styles.errorText}>{errors.startDate}</Text> : null}
          </View>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>End Date</Text>
            <TextInput
              style={[styles.input, errors.endDate && styles.inputError]}
              value={endDate}
              onChangeText={(t) => { setEndDate(t); setErrors(e => ({ ...e, endDate: '' })); }}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={Colors.dark.textMuted}
              maxLength={10}
            />
            {errors.endDate ? <Text style={styles.errorText}>{errors.endDate}</Text> : null}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Number of Travelers</Text>
          <TextInput
            style={[styles.input, errors.travelers && styles.inputError]}
            value={travelers}
            onChangeText={(t) => { setTravelers(t.replace(/[^0-9]/g, '')); setErrors(e => ({ ...e, travelers: '' })); }}
            placeholder="1"
            placeholderTextColor={Colors.dark.textMuted}
            keyboardType="number-pad"
            maxLength={3}
          />
          {errors.travelers ? <Text style={styles.errorText}>{errors.travelers}</Text> : null}
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
  inputError: { borderColor: Colors.dark.error },
  errorText: { color: Colors.dark.error, fontSize: 12, marginTop: 4 },
});
