import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

const destinations = [
  { id: 'd1', name: 'Santorini', country: 'Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400', tags: ['Islands', 'Romance'] },
  { id: 'd2', name: 'Kyoto', country: 'Japan', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400', tags: ['Culture', 'Temples'] },
  { id: 'd3', name: 'Athens', country: 'Greece', image: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=400', tags: ['History', 'Culture'] },
  { id: 'd4', name: 'Barcelona', country: 'Spain', image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400', tags: ['Architecture', 'Beach'] },
  { id: 'd5', name: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', tags: ['City', 'Technology'] },
  { id: 'd6', name: 'Rome', country: 'Italy', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400', tags: ['History', 'Food'] },
];

export default function ExploreScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = destinations.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>Discover your next destination</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.dark.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search destinations..."
          placeholderTextColor={Colors.dark.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.grid}>
        {filtered.map(dest => (
          <TouchableOpacity key={dest.id} style={styles.card}>
            <Image source={{ uri: dest.image }} style={styles.cardImage} />
            <View style={styles.cardOverlay}>
              <Text style={styles.destName}>{dest.name}</Text>
              <Text style={styles.destCountry}>{dest.country}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.dark.text },
  subtitle: { fontSize: 14, color: Colors.dark.textSecondary, marginTop: 4 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.dark.surface, borderRadius: 14,
    paddingHorizontal: 16, marginHorizontal: 20, marginBottom: 24,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: Colors.dark.text, fontSize: 15, paddingVertical: 14 },
  grid: { paddingHorizontal: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 32 },
  card: { width: '47%', borderRadius: 14, overflow: 'hidden', height: 160 },
  cardImage: { width: '100%', height: '100%' },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end', padding: 12,
  },
  destName: { fontSize: 16, fontWeight: '700', color: '#fff' },
  destCountry: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
});
