import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useTrips } from '@/providers/TripProvider';

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export default function TripsScreen() {
  const router = useRouter();
  const { upcomingTrips, completedTrips } = useTrips();

  const TripCard = ({ trip }: { trip: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/trip/${trip.id}`)}
    >
      <Image source={{ uri: trip.coverImage }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.destination}>{trip.destination}</Text>
          <View style={[styles.statusBadge, trip.status === 'upcoming' ? styles.upcomingBadge : styles.completedBadge]}>
            <Text style={styles.statusText}>{trip.status}</Text>
          </View>
        </View>
        <Text style={styles.country}>{trip.country}</Text>
        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={14} color={Colors.dark.textMuted} />
          <Text style={styles.metaText}>{formatDate(trip.startDate)} — {formatDate(trip.endDate)}</Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="people-outline" size={14} color={Colors.dark.textMuted} />
          <Text style={styles.metaText}>{trip.travelers} travelers</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>My Trips</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/create-trip')}>
          <Ionicons name="add" size={24} color={Colors.dark.primary} />
        </TouchableOpacity>
      </View>

      {upcomingTrips.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming ({upcomingTrips.length})</Text>
          {upcomingTrips.map(trip => <TripCard key={trip.id} trip={trip} />)}
        </View>
      )}

      {completedTrips.length > 0 && (
        <View style={[styles.section, { marginBottom: 32 }]}>
          <Text style={styles.sectionTitle}>Completed ({completedTrips.length})</Text>
          {completedTrips.map(trip => <TripCard key={trip.id} trip={trip} />)}
        </View>
      )}

      {upcomingTrips.length === 0 && completedTrips.length === 0 && (
        <View style={styles.empty}>
          <Ionicons name="briefcase-outline" size={64} color={Colors.dark.textMuted} />
          <Text style={styles.emptyText}>No trips yet</Text>
          <TouchableOpacity style={styles.createBtn} onPress={() => router.push('/create-trip')}>
            <Text style={styles.createBtnText}>Plan a Trip</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16,
  },
  title: { fontSize: 28, fontWeight: '800', color: Colors.dark.text },
  addBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.dark.surface, justifyContent: 'center', alignItems: 'center',
  },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.dark.textSecondary, marginBottom: 12 },
  card: {
    backgroundColor: Colors.dark.surface, borderRadius: 16,
    marginBottom: 12, overflow: 'hidden',
  },
  cardImage: { width: '100%', height: 140 },
  cardContent: { padding: 14 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  destination: { fontSize: 18, fontWeight: '700', color: Colors.dark.text, flex: 1 },
  statusBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  upcomingBadge: { backgroundColor: Colors.dark.primary + '30' },
  completedBadge: { backgroundColor: Colors.dark.success + '30' },
  statusText: { fontSize: 12, fontWeight: '600', color: Colors.dark.primary },
  country: { fontSize: 14, color: Colors.dark.textSecondary, marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  metaText: { fontSize: 13, color: Colors.dark.textMuted },
  empty: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 20 },
  emptyText: { fontSize: 18, color: Colors.dark.textMuted, marginTop: 16, marginBottom: 24 },
  createBtn: {
    backgroundColor: Colors.dark.primary, borderRadius: 25,
    paddingHorizontal: 32, paddingVertical: 14,
  },
  createBtnText: { color: '#000', fontWeight: '700', fontSize: 16 },
});
