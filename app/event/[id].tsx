import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Linking, Platform, Share, TextInput, Switch, Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useTrips } from '@/providers/TripProvider';

// Inline editable text field component
function EditableField({
  label,
  value,
  onSave,
  placeholder,
  multiline = false,
  icon,
}: {
  label: string;
  value: string;
  onSave: (val: string) => void;
  placeholder: string;
  multiline?: boolean;
  icon?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => { setDraft(value); }, [value]);

  if (editing) {
    return (
      <View style={editStyles.container}>
        <Text style={editStyles.label}>{label}</Text>
        <TextInput
          style={[editStyles.input, multiline && editStyles.multilineInput]}
          value={draft}
          onChangeText={setDraft}
          placeholder={placeholder}
          placeholderTextColor={Colors.dark.textMuted}
          multiline={multiline}
          autoFocus
        />
        <View style={editStyles.actions}>
          <TouchableOpacity
            style={editStyles.cancelBtn}
            onPress={() => { setDraft(value); setEditing(false); }}
          >
            <Text style={editStyles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={editStyles.saveBtn}
            onPress={() => { onSave(draft); setEditing(false); }}
          >
            <Text style={editStyles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity style={editStyles.display} onPress={() => setEditing(true)}>
      {icon && <Ionicons name={icon as any} size={16} color={Colors.dark.primary} />}
      <Text style={[editStyles.displayText, !value && editStyles.placeholder]} numberOfLines={multiline ? 6 : 1}>
        {value || placeholder}
      </Text>
      <Ionicons name="pencil" size={14} color={Colors.dark.textMuted} />
    </TouchableOpacity>
  );
}

export default function EventDetailScreen() {
  const router = useRouter();
  const { id, tripId } = useLocalSearchParams<{ id: string; tripId: string }>();
  const { getTrip, updateActivity } = useTrips();

  const trip = getTrip(tripId);
  const activity = trip?.itinerary
    .flatMap(day => day.activities)
    .find(a => a.id === id);

  if (!activity) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.notFound}>Event not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const save = (updates: Record<string, any>) => {
    updateActivity(tripId, activity.id, updates);
  };

  const openInMaps = () => {
    if (!activity.location) return;
    // Sanitize: strip control characters and limit length
    const sanitized = activity.location.replace(/[\x00-\x1f]/g, '').slice(0, 200);
    const query = encodeURIComponent(sanitized);
    const url = Platform.select({
      ios: `maps:0,0?q=${query}`,
      android: `geo:0,0?q=${query}`,
      default: `https://www.google.com/maps/search/?api=1&query=${query}`,
    });
    if (url) Linking.openURL(url);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this event: ${activity.title} at ${activity.location || 'various locations'}!`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={Colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
        <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color={Colors.dark.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Title & Type */}
        <View style={styles.section}>
          <View style={[styles.typeBadge, { backgroundColor: getActivityColor(activity.type) + '20' }]}>
            <Text style={[styles.typeText, { color: getActivityColor(activity.type) }]}>
              {activity.type.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.title}>{activity.title}</Text>
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={16} color={Colors.dark.textSecondary} />
            <Text style={styles.timeText}>{activity.time} {activity.duration ? `\u2022 ${activity.duration}` : ''}</Text>
          </View>
        </View>

        {/* AI Description (Editable) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="sparkles" size={18} color={Colors.dark.primary} />
            <Text style={styles.sectionLabel}>Description</Text>
          </View>
          <EditableField
            label="Description"
            value={activity.aiDescription || activity.notes || ''}
            onSave={(val) => save({ aiDescription: val })}
            placeholder="Tap to add a description..."
            multiline
          />
        </View>

        {/* Logistics Card (Editable) */}
        <View style={styles.logisticsCard}>
          <View style={styles.logisticsItem}>
            <View style={styles.logisticsIcon}>
              <Ionicons name="wallet-outline" size={20} color={Colors.dark.primary} />
            </View>
            <Text style={styles.logisticsLabel}>Price</Text>
            <EditableField
              label="Price"
              value={activity.price || ''}
              onSave={(val) => save({ price: val })}
              placeholder="Tap to set price"
            />
          </View>

          <View style={styles.logisticsDivider} />

          <View style={styles.logisticsItem}>
            <View style={styles.logisticsIcon}>
              <Ionicons name="ticket-outline" size={20} color={Colors.dark.secondary} />
            </View>
            <Text style={styles.logisticsLabel}>Tickets</Text>
            <TouchableOpacity
              style={styles.ticketToggle}
              onPress={() => save({ ticketsRequired: !activity.ticketsRequired })}
            >
              <Text style={[
                styles.ticketValue,
                activity.ticketsRequired && { color: Colors.dark.warning }
              ]}>
                {activity.ticketsRequired ? 'Required' : 'Not Required'}
              </Text>
              <Ionicons name="swap-horizontal" size={14} color={Colors.dark.textMuted} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Tips */}
        {activity.aiTips && activity.aiTips.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Pro Tips</Text>
            {activity.aiTips.map((tip, i) => (
              <View key={i} style={styles.tipRow}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.dark.success} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Location (Editable) & Maps */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Location</Text>
          <View style={styles.locationCard}>
            <View style={styles.locationEditRow}>
              <Ionicons name="location" size={20} color={Colors.dark.primary} />
              <EditableField
                label="Location"
                value={activity.location || ''}
                onSave={(val) => save({ location: val })}
                placeholder="Tap to set location"
              />
            </View>
            {activity.location ? (
              <TouchableOpacity style={styles.mapButton} onPress={openInMaps}>
                <Text style={styles.mapButtonText}>View on Map</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.dark.primary} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Notes (Editable) */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Personal Notes</Text>
          <EditableField
            label="Notes"
            value={activity.notes || ''}
            onSave={(val) => save({ notes: val })}
            placeholder="Tap to add your own notes..."
            multiline
          />
        </View>

        {/* Book Tickets CTA */}
        {activity.ticketsRequired && activity.bookingUrl && (
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => {
              const url = activity.bookingUrl || '';
              if (url.startsWith('https://') || url.startsWith('http://')) {
                Linking.openURL(url);
              }
            }}
          >
            <Text style={styles.bookButtonText}>Book Tickets Now</Text>
            <Ionicons name="open-outline" size={18} color="#000" />
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
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

const editStyles = StyleSheet.create({
  container: { marginBottom: 8 },
  label: { fontSize: 11, color: Colors.dark.textMuted, marginBottom: 6 },
  input: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 10, padding: 12,
    color: Colors.dark.text, fontSize: 14,
    borderWidth: 1, borderColor: Colors.dark.primary + '60',
  },
  multilineInput: { minHeight: 80, textAlignVertical: 'top' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 },
  cancelBtn: { paddingVertical: 6, paddingHorizontal: 14 },
  cancelText: { color: Colors.dark.textMuted, fontSize: 13, fontWeight: '600' },
  saveBtn: {
    backgroundColor: Colors.dark.primary, borderRadius: 8,
    paddingVertical: 6, paddingHorizontal: 14,
  },
  saveText: { color: '#000', fontSize: 13, fontWeight: '700' },
  display: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 6,
  },
  displayText: { flex: 1, fontSize: 14, color: Colors.dark.text, lineHeight: 22 },
  placeholder: { color: Colors.dark.textMuted, fontStyle: 'italic' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  centered: { justifyContent: 'center', alignItems: 'center' },
  notFound: { fontSize: 18, color: Colors.dark.textMuted },
  backBtn: { marginTop: 16, padding: 12 },
  backBtnText: { color: Colors.dark.primary, fontSize: 16 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.dark.border,
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.dark.text },
  iconButton: { padding: 4 },
  scrollContent: { padding: 20 },
  section: { marginBottom: 28 },
  typeBadge: {
    alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 8, marginBottom: 12,
  },
  typeText: { fontSize: 11, fontWeight: '700' },
  title: { fontSize: 28, fontWeight: '800', color: Colors.dark.text, marginBottom: 8 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timeText: { fontSize: 14, color: Colors.dark.textSecondary },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionLabel: { fontSize: 16, fontWeight: '700', color: Colors.dark.text, marginBottom: 12 },
  logisticsCard: {
    flexDirection: 'row', backgroundColor: Colors.dark.surface,
    borderRadius: 16, padding: 16, marginBottom: 28,
    borderWidth: 1, borderColor: Colors.dark.border,
  },
  logisticsItem: { flex: 1, alignItems: 'center', gap: 6 },
  logisticsIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center', alignItems: 'center',
  },
  logisticsLabel: { fontSize: 11, color: Colors.dark.textMuted },
  logisticsDivider: { width: 1, backgroundColor: Colors.dark.border, marginHorizontal: 8 },
  ticketToggle: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 4,
  },
  ticketValue: { fontSize: 13, color: Colors.dark.text, fontWeight: '700' },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  tipText: { flex: 1, fontSize: 14, color: Colors.dark.textSecondary, lineHeight: 20 },
  locationCard: {
    backgroundColor: Colors.dark.surface, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: Colors.dark.border,
  },
  locationEditRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  mapButton: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    marginTop: 12, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: Colors.dark.border,
    justifyContent: 'center',
  },
  mapButtonText: { fontSize: 13, color: Colors.dark.primary, fontWeight: '600' },
  bookButton: {
    backgroundColor: Colors.dark.primary, borderRadius: 16, padding: 18,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10,
  },
  bookButtonText: { fontSize: 16, fontWeight: '700', color: '#000' },
});
