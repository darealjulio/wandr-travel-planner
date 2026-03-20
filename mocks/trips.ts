import { Trip } from '../types/trip';

export const sampleTrips: Trip[] = [
  {
    id: 'greece-2026',
    destination: 'Athens & Greece',
    country: 'Greece',
    startDate: '2026-03-14',
    endDate: '2026-03-22',
    status: 'upcoming',
    coverImage: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800',
    description: 'UWG Study Abroad - Christian Heritage & Historical Sites of Greece. 26 students exploring the footsteps of Paul and early Christianity.',
    travelers: 26,
    tags: ['Study Abroad', 'Christian Heritage', 'History', 'UWG'],
    itinerary: [
      {
        day: 1,
        date: '2026-03-14',
        title: 'Departure Day',
        location: 'Atlanta, GA to Athens, Greece',
        activities: [
          { 
            id: 'a1', 
            time: '06:00', 
            title: 'Depart from Atlanta Airport', 
            type: 'transport',
            aiDescription: 'Departure from Hartsfield-Jackson Atlanta International Airport (ATL), one of the world\'s busiest aviation hubs.',
            aiTips: ['Arrive at least 3 hours early for international group travel.', 'Check terminal information as international flights usually depart from Terminal F.'],
            coordinates: { latitude: 33.6407, longitude: -84.4277 }
          },
          { 
            id: 'a2', 
            time: '20:00', 
            title: 'Arrive Athens International Airport', 
            type: 'transport',
            aiDescription: 'Arrival at Athens International Airport "Eleftherios Venizelos" (ATH).',
            aiTips: ['Have your passport ready for immigration.', 'The airport is about 35km from Athens city center.'],
            coordinates: { latitude: 37.9356, longitude: 23.9484 }
          }
        ],
      },
      {
        day: 2,
        date: '2026-03-15',
        title: 'Ancient Corinth',
        location: 'Corinth & Athens',
        activities: [
          { 
            id: 'b1', 
            time: '09:00', 
            title: 'Ancient Corinth Archaeological Site', 
            location: 'Ancient Corinth', 
            type: 'sightseeing',
            aiDescription: 'Ancient Corinth was a major city-state of the Peloponnese. It is famously linked to the Apostle Paul\'s ministry.',
            price: '€8.00',
            ticketsRequired: true,
            aiTips: ['The Temple of Apollo is the most iconic landmark here.', 'Visit the museum on-site to see Roman era statues.'],
            coordinates: { latitude: 37.9056, longitude: 22.8789 }
          },
          { 
            id: 'b2', 
            time: '11:00', 
            title: 'Bema of Corinth', 
            location: 'Corinth', 
            type: 'devotional',
            aiDescription: 'The Bema is a large elevated rostrum where St. Paul stood trial before the Roman proconsul Gallio.',
            price: 'Included in site ticket',
            ticketsRequired: true,
            aiTips: ['This is a significant site for Christian history, perfect for a moment of reflection.'],
            coordinates: { latitude: 37.9059, longitude: 22.8795 }
          }
        ],
      },
      {
        day: 3,
        date: '2026-03-16',
        title: 'Athens - Acropolis & Areopagus',
        location: 'Athens',
        activities: [
          { 
            id: 'c2', 
            time: '09:00', 
            title: 'Acropolis of Athens', 
            location: 'Acropolis Hill', 
            type: 'sightseeing',
            aiDescription: 'The Acropolis is the most famous ancient citadel in the world, home to the Parthenon and other architectural masterpieces.',
            price: '€20.00',
            ticketsRequired: true,
            aiTips: ['Book tickets in advance online to skip the long lines.', 'The site opens at 8:00 AM; arriving early is highly recommended.'],
            coordinates: { latitude: 37.9715, longitude: 23.7257 }
          },
          { 
            id: 'c3', 
            time: '11:00', 
            title: 'Areopagus Hill (Mars Hill)', 
            location: 'Areopagus', 
            type: 'devotional',
            aiDescription: 'Mars Hill is where the Apostle Paul delivered his famous sermon to the Athenians about the "Unknown God".',
            price: 'Free',
            ticketsRequired: false,
            aiTips: ['The rock is extremely slippery; use the metal stairs for safety.', 'Best views of the Parthenon are from here.'],
            coordinates: { latitude: 37.9722, longitude: 23.7236 }
          }
        ],
      }
    ],
  },
  {
    id: 'kyoto-2025',
    destination: 'Kyoto',
    country: 'Japan',
    startDate: '2025-04-09',
    endDate: '2025-04-16',
    status: 'completed',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1000',
    itinerary: []
  },
  {
    id: 'santorini-2025',
    destination: 'Santorini',
    country: 'Greece',
    startDate: '2025-07-15',
    endDate: '2025-07-22',
    status: 'completed',
    coverImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=1000',
    itinerary: []
  }
];
