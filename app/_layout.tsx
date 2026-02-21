import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TripProvider } from '@/providers/TripProvider';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <TripProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="trip/[id]" options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="destination/[id]" options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="create-trip" options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </TripProvider>
    </QueryClientProvider>
  );
}
