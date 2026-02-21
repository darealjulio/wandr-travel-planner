import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Image, Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useTrips } from '@/providers/TripProvider';

const { width } = Dimensions.get('window');

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'long', day: 'numeric',
  });
}

function getDuration(start: string, end: string) {
  const s = new Date(start + 'T00:00:00');
  const e = new Date(end + 'T00:00:00');
  return Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

export default function TripDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTrip } = useTrips();
  const trip = getTrip(id);
  const [activeDay, setActiveDay] = useState(0);

  if (!trip) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.notFound}>Trip not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const duration = getDuration(trip.startDate, trip.endDate);
  const currentDayData = trip.itinerary?.[activeDay];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: trip.coverImage }} style={styles.heroImage} />
          <View style={styles.heroOverlay}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.heroInfo}>
            <View style={[styles.statusBadge, trip.status === 'upcoming' ? styles.upcomingBadge : styles.completedBadge]}>
              <Text style={styles.statusText}>{trip.status.toUpperCase()}</Text>
            </View>
            <Text style={styles.heroTitle}>{trip.destination}</Text>
            <Text style={styles.heroCountry}>{trip.country}</Text>
          </View>
        </View>

        {/* Trip Meta */}
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={20} color={Colors.dark.primary} />
            <View>
              <Text style={styles.metaLabel}>Dates</Text>
              <Text style={styles.metaValue}>{formatDate(trip.startDate)} – {formatDate(trip.endDate)}</Text>
            </View>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={20} color={Colors.dark.secondary} />
            <View>
              <Text style={styles.metaLabel}>Duration</Text>
              <Text style={styles.metaValue}>{duration} days</Text>
            </View>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={20} color={Colors.dark.accent} />
            <View>
              <Text style={styles.metaLabel}>Travelers</Text>
              <Text style={styles.metaValue}>{trip.travelers}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        {trip.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Trip</Text>
            <Text style={styles.description}>{trip.description}</Text>
          </View>
        )}

        {/* Tags */}
        {trip.tags && trip.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {trip.tags.map((tag, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Itinerary */}
        {trip.itinerary && trip.itinerary.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Itinerary</Text>
            
            {/* Day Selector */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelector}>
              {trip.itinerary.map((day, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.dayTab, activeDay === i && styles.dayTabActive]}
                  onPress={() => setActiveDay(i)}
                >
                  <Text style={[styles.dayTabText, activeDay === i && styles.dayTabTextActive]}>
                    Day {day.day}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Day Activities */}
            {currentDayData && (
              <View style={styles.dayContent}>
                <Text style={styles.dayTitle}>{currentDayData.title}</Text>
                {currentDayData.location && (
                  <View style={styles.dayLocation}>
                    <Ionicons name="location-outline" size={14} color={Colors.dark.primary} />
                    <Text style={styles.dayLocationText}>{currentDayData.location}</Text>
                  </View>
                )}
                {currentDayData.activities?.map((activity, i) => (
                  <View key={i} style={styles.activityCard}>
                    <View style={styles.activityTime}>
                      <Text style={styles.activityTimeText}>{activity.time}</Text>
                    </View>
                    <View style={styles.activityInfo}>
                      <Text style={styles.activityTitle}>{activity.title}</Text>
                      {activity.location && (
                        <Text style={styles.activityLocation}>{activity.location}</Text>
                      )}
                      {activity.notes && (
                        <Text style={styles.activityNotes}>{activity.notes}</Text>
                      )}
                    </View>
                    <View style={[styles.activityDot, { backgroundColor: getActivityColor(activity.type) }]} />
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function getActivityColor(type?: string) {
  const colors: Record<string, string> = {
    transport: Colors.dark.info,
    sightseeing: Colors.dark.primary,
    food: Colors.dark.warning,
    accommodation: Colors.dark.accent,
    devotional: Colors.dark.secondary,
    leisure: Colors.dark.success,
  };
  return colors[type || ''] || Colors.dark.textMuted;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  centered: { justifyContent: 'center', alignItems: 'center' },
  notFound: { fontSize: 18, color: Colors.dark.textMuted },
  backBtn: { marginTop: 16, padding: 12 },
  backBtnText: { color: Colors.dark.primary, fontSize: 16 },
  heroContainer: { height: 320, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingTop: 50, paddingHorizontal: 20,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center',
  },
  heroInfo: {
    position: 'absolute', bottom: 20, left: 20, right: 20,
  },
  statusBadge: {
    alignSelf: 'flex-start', borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 4, marginBottom: 8,
  },
  upcomingBadge: { backgroundColor: Colors.dark.primary },
  completedBadge: { backgroundColor: Colors.dark.success },
  statusText: { fontSize: 11, fontWeight: '700', color: '#000' },
  heroTitle: { fontSize: 30, fontWeight: '800', color: '#fff' },
  heroCountry: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  metaContainer: {
    flexDirection: 'row', backgroundColor: Colors.dark.surface,
    margin: 16, borderRadius: 16, padding: 16,
  },
  metaItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  metaDivider: { width: 1, backgroundColor: Colors.dark.border },
  metaLabel: { fontSize: 11, color: Colors.dark.textMuted },
  metaValue: { fontSize: 13, color: Colors.dark.text, fontWeight: '600' },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.dark.text, marginBottom: 12 },
  description: { fontSize: 14, color: Colors.dark.textSecondary, lineHeight: 22 },
  tagsContainer: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8,
    paddingHorizontal: 16, marginBottom: 24,
  },
  tag: {
    backgroundColor: Colors.dark.primary + '25',
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6,
  },
  tagText: { fontSize: 13, color: Colors.dark.primary, fontWeight: '600' },
  daySelector: { marginBottom: 16 },
  dayTab: {
    marginRight: 10, paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, backgroundColor: Colors.dark.surface,
  },
  dayTabActive: { backgroundColor: Colors.dark.primary },
  dayTabText: { fontSize: 13, color: Colors.dark.textSecondary, fontWeight: '600' },
  dayTabTextActive: { color: '#000' },
  dayContent: { gap: 8 },
  dayTitle: { fontSize: 17, fontWeight: '700', color: Colors.dark.text, marginBottom: 4 },
  dayLocation: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  dayLocationText: { fontSize: 13, color: Colors.dark.primary },
  activityCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: Colors.dark.surface, borderRadius: 12, padding: 12, gap: 12,
  },
  activityTime: { minWidth: 50 },
  activityTimeText: { fontSize: 12, color: Colors.dark.primary, fontWeight: '600' },
  activityInfo: { flex: 1 },
  activityTitle: { fontSize: 14, fontWeight: '600', color: Colors.dark.text },
  activityLocation: { fontSize: 12, color: Colors.dark.textSecondary, marginTop: 2 },
  activityNotes: { fontSize: 12, color: Colors.dark.textMuted, marginTop: 4, fontStyle: 'italic' },
  activityDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
});
