export interface Activity {
      id: string;
        time: string;
          title: string;
            location?: string;
              type: 'sightseeing' | 'food' | 'transport' | 'accommodation' | 'leisure' | 'devotional';
                notes?: string;
                  duration?: string;
                  }

                  export interface DayItinerary {
                    day: number;
                      date: string;
                        title: string;
                          location?: string;
                            activities: Activity[];
                            }

                            export interface Trip {
                              id: string;
                                destination: string;
                                  country: string;
                                    region?: string;
                                      startDate: string;
                                        endDate: string;
                                          status: 'upcoming' | 'ongoing' | 'completed' | 'draft';
                                            coverImage: string;
                                              description?: string;
                                                budget?: {
                                                    total: number;
                                                        spent: number;
                                                            currency: string;
                                                              };
                                                                itinerary: DayItinerary[];
                                                                  tags?: string[];
                                                                    travelers?: number;
                                                                      tripType?: string;
                                                                      }
}