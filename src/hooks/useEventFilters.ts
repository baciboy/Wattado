import { useState, useMemo, useEffect } from 'react';
import { Event, FilterState } from '../types/Event';
import { ticketmasterService } from '../services/ticketmasterService';
import { mockEvents } from '../data/mockEvents';

export const useEventFilters = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    dateRange: { start: '', end: '' },
    location: '',
    categories: [],
    priceRange: { min: 0, max: 1000 },
    platforms: [],
    availability: []
  });

  const [sortBy, setSortBy] = useState<'date' | 'price' | 'popularity'>('date');

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch Ticketmaster events
        const ticketmasterEvents = await ticketmasterService.searchEvents({
          size: 50,
          sort: 'date,asc'
        });

        // Filter mock events to exclude Ticketmaster ones (replace with real data)
        const otherPlatformEvents = mockEvents.filter(event => event.platform !== 'ticketmaster');
        
        // Combine real Ticketmaster events with mock events from other platforms
        const allEvents = [...ticketmasterEvents, ...otherPlatformEvents];
        console.log('Setting events:', {
          ticketmasterCount: ticketmasterEvents.length,
          otherPlatformsCount: otherPlatformEvents.length,
          totalCount: allEvents.length,
          sample: allEvents[0]
        });
        setEvents(allEvents);
      } catch (err) {
      console.error('Error fetching events:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load events. Please try again later.';
      setError(errorMessage);
      console.log('Falling back to mock events');
      setEvents(mockEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Refetch events when search parameters change significantly
  const refetchEvents = async (searchParams?: { keyword?: string; location?: string; dateRange?: { start: string; end: string }; category?: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      let ticketmasterEvents: Event[] = [];
      
      // Build the Ticketmaster search parameters
      const baseSearchParams = {
        size: 50,
        sort: 'date,asc' as const
      };

      if (searchParams?.keyword && searchParams?.location) {
        // If both keyword and location are provided, use them together
        const [city, state] = searchParams.location.split(',').map(s => s.trim());
        ticketmasterEvents = await ticketmasterService.searchEvents({
          ...baseSearchParams,
          keyword: searchParams.keyword,
          city,
          stateCode: state
        });
      } else if (searchParams?.keyword) {
        ticketmasterEvents = await ticketmasterService.getEventsByKeyword(searchParams.keyword);
      } else if (searchParams?.location) {
        const [city, state] = searchParams.location.split(',').map(s => s.trim());
        ticketmasterEvents = await ticketmasterService.getEventsByLocation(city, state);
      } else if (searchParams?.dateRange?.start && searchParams?.dateRange?.end) {
        ticketmasterEvents = await ticketmasterService.getEventsByDateRange(
          searchParams.dateRange.start,
          searchParams.dateRange.end
        );
      } else if (searchParams?.category) {
        ticketmasterEvents = await ticketmasterService.getEventsByCategory(searchParams.category);
      } else {
        ticketmasterEvents = await ticketmasterService.searchEvents(baseSearchParams);
      }

      // Keep mock events for other platforms
      const otherPlatformEvents = mockEvents.filter(event => event.platform !== 'ticketmaster');
      
      // Combine and set events
      const allEvents = [...ticketmasterEvents, ...otherPlatformEvents];
      setEvents(allEvents);
    } catch (err) {
      console.error('Error refetching events:', err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedEvents = useMemo(() => {
    // Pre-process filter values for performance
    const searchTerms = filters.search.toLowerCase().split(/\s+/).filter((term: string) => term.length > 0);
    const locationTerms = filters.location.toLowerCase().split(/\s+/).filter((term: string) => term.length > 0);
    const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
    const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : null;
    const hasCategories = filters.categories.length > 0;
    const hasPlatforms = filters.platforms.length > 0;
    const hasAvailability = filters.availability.length > 0;

    const isInDateRange = (eventDate: Date): boolean => {
      if (!startDate && !endDate) return true;
      if (startDate && eventDate < startDate) return false;
      if (endDate && eventDate > endDate) return false;
      return true;
    };

    // Apply all filters
    const filtered = events.filter(event => {
      // Filter out past events (double check even though API should handle this)
      if (new Date(event.date) < new Date()) return false;

      // Search filter (match all terms)
      if (searchTerms.length > 0) {
        const searchableText = [
          event.title,
          event.description,
          event.location.venue,
          event.location.city,
          event.category,
          event.genre,
          event.subGenre
        ].map(text => text?.toLowerCase() || '').join(' ');

        if (!searchTerms.every(term => searchableText.includes(term))) return false;
      }

      // Date range filter
      if ((startDate || endDate) && !isInDateRange(new Date(event.date))) return false;

      // Location filter (match all terms)
      if (locationTerms.length > 0) {
        const locationText = [
          event.location.venue,
          event.location.city,
          event.location.state,
          event.location.address
        ].map(text => text?.toLowerCase() || '').join(' ');

        if (!locationTerms.every(term => locationText.includes(term))) return false;
      }

  // Category filter
  if (hasCategories) {
    const eventCategories = [
      event.category,
      event.genre,
      event.subGenre
    ].filter(Boolean).map(cat => cat?.toLowerCase());
    
    const matchesCategory = filters.categories.some(category =>
      eventCategories.some(eventCat => eventCat?.includes(category.toLowerCase()))
    );
    
    if (!matchesCategory) return false;
  }      // Price range filter
      if (event.price.min > filters.priceRange.max || event.price.max < filters.priceRange.min) return false;

      // Platform filter
      if (hasPlatforms && !filters.platforms.includes(event.platform)) return false;

      // Availability filter
      if (hasAvailability && !filters.availability.includes(event.availability)) return false;

      return true;
    });

    // Stable sort events
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'price':
          // Sort by min price, then by max price if min prices are equal
          return a.price.min === b.price.min 
            ? a.price.max - b.price.max 
            : a.price.min - b.price.min;
        case 'popularity':
          // Sort by attendees if available, otherwise by date
          if (a.attendees !== undefined && b.attendees !== undefined) {
            return b.attendees - a.attendees;
          }
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        default:
          return 0;
      }
    });
  }, [events, filters, sortBy]);

  return {
    filters,
    setFilters,
    sortBy,
    setSortBy,
    filteredEvents: filteredAndSortedEvents,
    loading,
    error,
    refetchEvents
  };
};