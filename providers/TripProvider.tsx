import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trip } from '@/types/trip';
import { sampleTrips } from '@/mocks/trips';

const CURRENT_TRIPS_VERSION = '3';
const TRIPS_STORAGE_KEY = `@wandr_trips_v${CURRENT_TRIPS_VERSION}`;

interface TripContextType {
  trips: Trip[];
  upcomingTrips: Trip[];
  completedTrips: Trip[];
  addTrip: (trip: Trip) => void;
  updateTrip: (trip: Trip) => void;
  deleteTrip: (id: string) => void;
  getTrip: (id: string) => Trip | undefined;
  isLoading: boolean;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const stored = await AsyncStorage.getItem(TRIPS_STORAGE_KEY);
      if (stored) {
        setTrips(JSON.parse(stored));
      } else {
        setTrips(sampleTrips);
        await AsyncStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(sampleTrips));
      }
    } catch (error) {
      setTrips(sampleTrips);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTrips = async (newTrips: Trip[]) => {
    try {
      await AsyncStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(newTrips));
    } catch (error) {
      console.error('Error saving trips:', error);
    }
  };

  const addTrip = (trip: Trip) => {
    const newTrips = [...trips, trip];
    setTrips(newTrips);
    saveTrips(newTrips);
  };

  const updateTrip = (trip: Trip) => {
    const newTrips = trips.map(t => t.id === trip.id ? trip : t);
    setTrips(newTrips);
    saveTrips(newTrips);
  };

  const deleteTrip = (id: string) => {
    const newTrips = trips.filter(t => t.id !== id);
    setTrips(newTrips);
    saveTrips(newTrips);
  };

  const getTrip = (id: string) => trips.find(t => t.id === id);

  const upcomingTrips = trips
    .filter(t => t.status === 'upcoming')
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const completedTrips = trips.filter(t => t.status === 'completed');

  return (
    <TripContext.Provider value={{
      trips,
      upcomingTrips,
      completedTrips,
      addTrip,
      updateTrip,
      deleteTrip,
      getTrip,
      isLoading,
    }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const context = useContext(TripContext);
  if (!context) throw new Error('useTrips must be used within TripProvider');
  return context;
}
