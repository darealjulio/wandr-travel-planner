import React from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Image, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useTrips } from '@/providers/TripProvider';

const { width } = Dimensions.get('window');

function formatDate(dateStr: string) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getDaysUntil(dateStr: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function HomeScreen() {
  const router = useRouter();
  const { upcomingTrips, completedTrips } = useTrips();
  const nextTrip = upcomingTrips[0];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.name}>Wanderer ✈️</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn}>
          <Ionicons name="notifications-outline" size={24} color={Colors.dark.text} />
        </TouchableOpacity>
      </View>

      {nextTrip && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Adventure</Text>
          <TouchableOpacity
            style={styles.nextTripCard}
            onPress={() => router.push(`/trip/${nextTrip.id}`)}
          >
            <Image source={{ uri: nextTrip.coverImage }} style={styles.nextTripImage} />
            <View style={styles.nextTripOverlay}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {getDaysUntil(nextTrip.startDate) > 0
                    ? `${getDaysUntil(nextTrip.startDate)} days away`
                    : 'Today!'}
                </Text>
              </View>
              <View style={styles.nextTripInfo}>
                <Text style={styles.destination}>{nextTrip.destination}</Text>
                <Text style={styles.country}>{nextTrip.country}</Text>
                <View style={styles.metaRow}>
                  <Ionicons name="calendar-outline" size={14} color={Colors.dark.primary} />
                  <Text style={styles.metaText}>
                    {formatDate(nextTrip.startDate)} — {formatDate(nextTrip.endDate)}
                  </Text>
                </View>
                <View style={styles.metaRow}>
                  <Ionicons name="people-outline" size={14} color={Colors.dark.secondary} />
                  <Text style={styles.metaText}>{nextTrip.travelers} travelers</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{upcomingTrips.length}</Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{completedTrips.length}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {new Set([...upcomingTrips, ...completedTrips].map(t => t.country)).size}
          </Text>
          <Text style={styles.statLabel}>Countries</Text>
        </View>
      </View>

      {completedTrips.length > 0 && (
        <View style={[styles.section, { marginBottom: 32 }]}>
          <Text style={styles.sectionTitle}>Recent Trips</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {completedTrips.map(trip => (
              <TouchableOpacity
                key={trip.id}
                style={styles.recentCard}
                onPress={() => router.push(`/trip/${trip.id}`)}
              >
                <Image source={{ uri: trip.coverImage }} style={styles.recentImage} />
                <Text style={styles.recentDestination}>{trip.destination}</Text>
                <Text style={styles.recentCountry}>{trip.country}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20,
  },
  greeting: { fontSize: 14, color: Colors.dark.textSecondary },
  name: { fontSize: 24, fontWeight: '700', color: Colors.dark.text },
  notifBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.dark.surface, justifyContent: 'center', alignItems: 'center',
  },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.dark.text, marginBottom: 12 },
  nextTripCard: { borderRadius: 20, overflow: 'hidden', height: 280 },
  nextTripImage: { width: '100%', height: '100%' },
  nextTripOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    padding: 20, justifyContent: 'space-between',
  },
  badge: {
    alignSelf: 'flex-start', backgroundColor: Colors.dark.primary,
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
  },
  badgeText: { color: '#000', fontWeight: '700', fontSize: 13 },
  nextTripInfo: { gap: 4 },
  destination: { fontSize: 26, fontWeight: '800', color: '#fff' },
  country: { fontSize: 15, color: 'rgba(255,255,255,0.8)', marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { color: 'rgba(255,255,255,0.9)', fontSize: 13 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1, backgroundColor: Colors.dark.surface,
    borderRadius: 16, padding: 16, alignItems: 'center',
  },
  statNumber: { fontSize: 28, fontWeight: '800', color: Colors.dark.primary },
  statLabel: { fontSize: 12, color: Colors.dark.textSecondary, marginTop: 2 },
  recentCard: { width: 140, marginRight: 12 },
  recentImage: { width: 140, height: 100, borderRadius: 12, marginBottom: 6 },
  recentDestination: { fontSize: 14, fontWeight: '600', color: Colors.dark.text },
  recentCountry: { fontSize: 12, color: Colors.dark.textSecondary },
});
