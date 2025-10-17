import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import { EventModal } from './components/EventModal';
import { useState, useEffect } from 'react';
import { Event, TicketmasterEvent, TicketmasterResponse, FilterState } from './types/Event';

function App() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  // Consolidated filter state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    dateRange: { start: '', end: '' },
    location: '',
    categories: [],
    priceRange: { min: 0, max: 1000 },
    platforms: [],
    availability: []
  });

  const [debouncedCity, setDebouncedCity] = useState('');

  // Set up debounced city update
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCity(filters.location);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [filters.location]);

  useEffect(() => {
    let isSubscribed = true;
    const fetchEvents = async () => {
      if (!isSubscribed) return;
      setLoading(true);
      setError(null);
      const baseUrl = new URL('https://app.ticketmaster.com/discovery/v2/events.json');
      baseUrl.searchParams.append('apikey', import.meta.env.VITE_TICKETMASTER_API_KEY);
  baseUrl.searchParams.append('size', '200');
      baseUrl.searchParams.append('countryCode', 'GB');
      if (debouncedCity) baseUrl.searchParams.append('city', debouncedCity.trim());
      // Use start date from date range if available
      if (filters.dateRange.start) {
        baseUrl.searchParams.append('startDateTime', filters.dateRange.start + 'T00:00:00Z');
      }
      // Use first category for API call (Ticketmaster limitation)
      if (filters.categories.length > 0) {
        baseUrl.searchParams.append('classificationName', filters.categories[0]);
      }
      try {
        const res = await fetch(baseUrl);
        const data: TicketmasterResponse = await res.json();
        if (!data._embedded?.events) {
          setEvents([]);
          setError('No events found. Try a different search.');
          return;
        }
        // Improved grouping: group by name and venue, aggregate all dates and times
        const eventMap = new Map<string, {
          id: string;
          title: string;
          description: string;
          location: Event['location'];
          price: Event['price'];
          category: string;
          platform: Event['platform'];
          image: string;
          url: string;
          availability: Event['availability'];
          rating?: number;
          attendees?: number;
          ticketmasterId?: string;
          genre?: string;
          subGenre?: string;
          promoter?: string;
          dates: string[];
          times: string[];
        }>();
        data._embedded.events.forEach((event: TicketmasterEvent) => {
          // Normalize name: remove all time and day-of-week patterns from name
          const rawName = event.name || 'Untitled Event';
          // Remove all time and day-of-week patterns from anywhere in the name
          const cleanTitle = rawName
            .replace(/(Sun|Mon|Tue|Wed|Thu|Fri|Sat)/gi, '')
            .replace(/\d{1,2}:\d{2}/g, '')
            .replace(/\s*&\s*/g, ' ')
            .replace(/\s+/g, ' ')
            .replace(/-\s*$/g, '')
            .trim();
          const normalizedName = cleanTitle.toLowerCase();
          const venue = (event._embedded?.venues?.[0]?.name || 'Unknown').trim().toLowerCase();
          const key = `${normalizedName}__${venue}`;
          const date = event.dates?.start?.localDate || '';
          const time = event.dates?.start?.localTime || '';
          if (eventMap.has(key)) {
            const grouped = eventMap.get(key)!;
            if (!grouped.dates.includes(date)) grouped.dates.push(date);
            if (time && !grouped.times.includes(time)) grouped.times.push(time);
          } else {
            eventMap.set(key, {
              id: key,
              title: cleanTitle,
              description: '',
              location: {
                venue: event._embedded?.venues?.[0]?.name || 'Unknown',
                city: event._embedded?.venues?.[0]?.city?.name || 'Unknown',
                state: event._embedded?.venues?.[0]?.state?.name || '',
                address: event._embedded?.venues?.[0]?.address?.line1 || '',
                coordinates: event._embedded?.venues?.[0]?.location ? {
                  latitude: Number(event._embedded.venues[0].location.latitude),
                  longitude: Number(event._embedded.venues[0].location.longitude)
                } : undefined
              },
              price: event.priceRanges && event.priceRanges.length > 0 ? {
                min: event.priceRanges[0].min,
                max: event.priceRanges[0].max,
                currency: event.priceRanges[0].currency
              } : { min: 0, max: 0, currency: 'GBP' },
              category: event.classifications?.[0]?.segment?.name || '',
              platform: 'ticketmaster',
              image: event.images?.[0]?.url || 'https://via.placeholder.com/400',
              url: event.url || '',
              availability: 'available',
              rating: undefined,
              attendees: undefined,
              ticketmasterId: event.id,
              genre: event.classifications?.[0]?.genre?.name,
              subGenre: event.classifications?.[0]?.subGenre?.name,
              promoter: event.promoter?.name,
              dates: [date],
              times: time ? [time] : []
            });
          }
        });
        // Convert grouped events to array and set date range and time summary
        const sortedDates = (dates: string[]) => dates.filter(d => d).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        // Aggregate price range for grouped events
        const groupedEvents: Event[] = Array.from(eventMap.values()).map(e => {
          const validDates = sortedDates(e.dates);
          // Find all priceRanges for grouped events
          let minPrice = Number.POSITIVE_INFINITY;
          let maxPrice = 0;
          let currency = e.price.currency;
          let foundPrice = false;
          if (data._embedded && data._embedded.events) {
            data._embedded.events.forEach((ev: TicketmasterEvent) => {
              const evName = (ev.name || 'Untitled Event').replace(/(Sun|Mon|Tue|Wed|Thu|Fri|Sat)/gi, '').replace(/\d{1,2}:\d{2}/g, '').replace(/\s*&\s*/g, ' ').replace(/\s+/g, ' ').replace(/-\s*$/g, '').trim().toLowerCase();
              const evVenue = (ev._embedded?.venues?.[0]?.name || 'Unknown').trim().toLowerCase();
              const evKey = `${evName}__${evVenue}`;
              if (evKey === e.id && ev.priceRanges && ev.priceRanges.length > 0) {
                ev.priceRanges.forEach(pr => {
                  if (pr.min > 0) {
                    minPrice = Math.min(minPrice, pr.min);
                    foundPrice = true;
                  }
                  maxPrice = Math.max(maxPrice, pr.max);
                  currency = pr.currency;
                });
              }
            });
          }
          if (!foundPrice) minPrice = 0;
          return {
            ...e,
            price: {
              min: minPrice,
              max: maxPrice,
              currency
            },
            date: validDates.length > 1
              ? `${validDates[0]} - ${validDates[validDates.length - 1]}`
              : (validDates[0] || ''),
            time: e.times.length > 1
              ? e.times.join(', ')
              : (e.times[0] || '')
          };
        });
        setEvents(groupedEvents);
      } catch {
        setError('Failed to fetch events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
    return () => { isSubscribed = false; };
  }, [debouncedCity, filters.dateRange.start, filters.categories]);

  // Client-side filtering for all other filters
  const filteredEvents: Event[] = events.filter((event: Event) => {
    // Search filter (title, venue, description)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesTitle = event.title?.toLowerCase().includes(searchLower);
      const matchesVenue = event.location?.venue?.toLowerCase().includes(searchLower);
      const matchesDescription = event.description?.toLowerCase().includes(searchLower);
      if (!matchesTitle && !matchesVenue && !matchesDescription) {
        return false;
      }
    }

    // Date range filter (end date)
    if (filters.dateRange.end) {
      const eventDate = event.date.includes(' - ')
        ? event.date.split(' - ')[0] // Use first date if it's a range
        : event.date;
      if (eventDate > filters.dateRange.end) {
        return false;
      }
    }

    // Price range filter
    if (filters.priceRange.min > 0 && event.price.max < filters.priceRange.min) {
      return false;
    }
    if (filters.priceRange.max < 1000 && event.price.min > filters.priceRange.max) {
      return false;
    }

    // Platform filter (when we have multiple platforms)
    if (filters.platforms.length > 0 && !filters.platforms.includes(event.platform)) {
      return false;
    }

    // Availability filter
    if (filters.availability.length > 0 && !filters.availability.includes(event.availability)) {
      return false;
    }

    // Categories filter (for additional categories beyond API filter)
    if (filters.categories.length > 1) {
      // Check if event matches any of the selected categories
      const matchesCategory = filters.categories.some(cat =>
        event.category?.toLowerCase().includes(cat.toLowerCase())
      );
      if (!matchesCategory) {
        return false;
      }
    }

    return true;
  });

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-xl text-purple-600">Loading...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              filteredEvents={filteredEvents}
              filters={filters}
              onFiltersChange={setFilters}
              handleEventClick={handleEventClick}
            />
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </Router>
  );
}

export default App;