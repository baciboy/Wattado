import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { EventCard } from './components/EventCard';
import { EventModal } from './components/EventModal';
import { FilterSidebar } from './components/FilterSidebar';
import { Event, FilterState } from './types/Event';
import { Calendar, Loader2, AlertCircle } from 'lucide-react';

function App() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const ukCities = [
    'London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Glasgow', 'Edinburgh', 'Bristol', 'Cardiff', 'Belfast', 'Newcastle', 'Sheffield', 'Nottingham', 'Southampton', 'Brighton'
  ];
  const [city, setCity] = useState('');
  const [debouncedCity, setDebouncedCity] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [type, setType] = useState('');
  const [search, setSearch] = useState('');

  // Set up debounced city update
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCity(city);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [city]);

  useEffect(() => {
    let isSubscribed = true;

    const fetchEvents = async () => {
      if (!isSubscribed) return;
      setLoading(true);
      setError(null);

      const baseUrl = new URL('https://app.ticketmaster.com/discovery/v2/events.json');
      baseUrl.searchParams.append('apikey', import.meta.env.VITE_TICKETMASTER_API_KEY);
      baseUrl.searchParams.append('size', '100'); // Fetch more events
      baseUrl.searchParams.append('countryCode', 'GB'); // Focus on UK events

      if (debouncedCity) {
        baseUrl.searchParams.append('city', debouncedCity.trim());
      }

      if (date) {
        const isoDate = date.toISOString().split('T')[0] + 'T00:00:00Z';
        baseUrl.searchParams.append('startDateTime', isoDate);
      }

      if (type) {
        baseUrl.searchParams.append('classificationName', type);
      }

      try {
        const res = await fetch(baseUrl);
        const data = await res.json();

        if (!data._embedded?.events) {
          if (isSubscribed) {
            setEvents([]);
            setError('No events found. Try a different search.');
          }
          return;
        }

        const apiEvents = data._embedded.events.map((event: {
          id: string;
          name: string;
          dates: { start: { localDate: string } };
          _embedded?: { venues?: Array<{ name: string; city?: { name: string }; state?: { name: string }; address?: { line1: string } }> };
          url: string;
          classifications?: Array<{ segment?: { name: string } }>;
          images?: Array<{ url: string }>;
          priceRanges?: Array<{ min: number; max: number; currency: string }>;
        }) => ({
          id: event.id,
          title: event.name || 'Untitled Event',
          description: event.description || '',
          date: event.dates?.start?.localDate || '',
          time: event.dates?.start?.localTime || '',
          source: 'Ticketmaster',
          location: {
            venue: event._embedded?.venues?.[0]?.name || 'Unknown',
            city: event._embedded?.venues?.[0]?.city?.name || 'Unknown',
            state: event._embedded?.venues?.[0]?.state?.name || '',
            address: event._embedded?.venues?.[0]?.address?.line1 || ''
          },
          url: event.url || '',
          category: event.classifications?.[0]?.segment?.name || '',
          platform: 'ticketmaster',
          image: event.images?.[0]?.url || 'https://via.placeholder.com/400',
          price: (() => {
            if (event.priceRanges && event.priceRanges.length > 0) {
              const pr = event.priceRanges[0];
              return {
                min: typeof pr.min === 'number' ? pr.min : 0,
                max: typeof pr.max === 'number' ? pr.max : 0,
                currency: pr.currency || 'GBP'
              };
            }
            return { min: 0, max: 0, currency: 'GBP' };
          })(),
          availability: 'available'
        }));

        if (isSubscribed) {
          setEvents(apiEvents);
          setError(null);
        }
      } catch (error) {
        if (!isSubscribed) return;
        console.error('Error fetching events:', error);
        setError('Failed to fetch events. Please try a different search.');
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    fetchEvents();
    
    return () => {
      isSubscribed = false;
    };
  }, [debouncedCity, date, type]);

  const filteredEvents = events.filter((e) =>
    search 
      ? e.title.toLowerCase().includes(search.toLowerCase())
      : true
  );

  const handleEventClick = (event: Event) => {
  console.log('Event clicked:', event);
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
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Events</h2>
          <p className="text-gray-600">Fetching the latest events from Ticketmaster...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Events</h2>
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
    <div className="min-h-screen bg-gray-50">
      <Header 
        onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
        totalEvents={filteredEvents.length}
      />
      <div className="max-w-7xl mx-auto flex">
        <FilterSidebar
          filters={{
            search,
            dateRange: { 
              start: date ? date.toISOString().split('T')[0] : '',
              end: ''
            },
            location: city,
            categories: type ? [type] : [],
            priceRange: { min: 0, max: 1000 },
            platforms: ['ticketmaster'],
            availability: []
          }}
          onFiltersChange={(newFilters: FilterState) => {
            setSearch(newFilters.search);
            setCity(newFilters.location);
            setDate(newFilters.dateRange.start ? new Date(newFilters.dateRange.start) : null);
            setType(newFilters.categories[0] || '');
          }}
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          eventCount={filteredEvents.length}
        />

        <div className="flex-1 p-6">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filters to find more events.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setCity('');
                  setDate(null);
                  setType('');
                }}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEventClick={handleEventClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}

export default App;