import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useTrips } from '@/providers/TripProvider';

export default function ProfileScreen() {
  const { trips, upcomingTrips, completedTrips } = useTrips();
  const countries = new Set(trips.map(t => t.country)).size;

  const stats = [
    { label: 'Total Trips', value: trips.length, icon: 'briefcase' },
    { label: 'Countries', value: countries, icon: 'globe' },
    { label: 'Upcoming', value: upcomingTrips.length, icon: 'calendar' },
    { label: 'Completed', value: completedTrips.length, icon: 'checkmark-circle' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={Colors.dark.primary} />
        </View>
        <Text style={styles.name}>Wanderer</Text>
        <Text style={styles.tagline}>Exploring the world one trip at a time ✈️</Text>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((stat, i) => (
          <View key={i} style={styles.statCard}>
            <Ionicons name={stat.icon as any} size={24} color={Colors.dark.primary} />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        {['Notifications', 'Privacy', 'About', 'Help & Support'].map((item, i) => (
          <TouchableOpacity key={i} style={styles.menuItem}>
            <Text style={styles.menuItemText}>{item}</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.dark.textMuted} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20 },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: Colors.dark.surface,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: Colors.dark.primary, marginBottom: 16,
  },
  name: { fontSize: 24, fontWeight: '700', color: Colors.dark.text },
  tagline: { fontSize: 14, color: Colors.dark.textSecondary, marginTop: 4, textAlign: 'center' },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20,
    gap: 12, marginBottom: 24,
  },
  statCard: {
    width: '47%', backgroundColor: Colors.dark.surface,
    borderRadius: 16, padding: 16, alignItems: 'center', gap: 6,
  },
  statValue: { fontSize: 24, fontWeight: '800', color: Colors.dark.text },
  statLabel: { fontSize: 12, color: Colors.dark.textSecondary },
  section: { paddingHorizontal: 20, marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.dark.text, marginBottom: 12 },
  menuItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.dark.surface, borderRadius: 12,
    padding: 16, marginBottom: 8,
  },
  menuItemText: { fontSize: 15, color: Colors.dark.text },
});
