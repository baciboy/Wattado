import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import { EventModal } from './components/EventModal';
import { useState, useEffect } from 'react';
import { Event, TicketmasterEvent, TicketmasterResponse } from './types/Event';

function App() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
    // Removed unused ukCities array
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
  baseUrl.searchParams.append('size', '200');
      baseUrl.searchParams.append('countryCode', 'GB');
      if (debouncedCity) baseUrl.searchParams.append('city', debouncedCity.trim());
      if (date) baseUrl.searchParams.append('startDateTime', date.toISOString().split('T')[0] + 'T00:00:00Z');
      if (type) baseUrl.searchParams.append('classificationName', type);
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
  }, [debouncedCity, date, type]);

  const filteredEvents: Event[] = events.filter((e: Event) =>
    search
      ? typeof e.title === 'string' && e.title.toLowerCase().includes(search.toLowerCase())
      : true
  );

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
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              filteredEvents={filteredEvents}
              isFilterOpen={isFilterOpen}
              setIsFilterOpen={setIsFilterOpen}
              search={search}
              setSearch={setSearch}
              city={city}
              setCity={setCity}
              date={date}
              setDate={setDate}
              type={type}
              setType={setType}
              handleEventClick={handleEventClick}
            />
          }
        />
        <Route path="/login" element={<LoginPage />} />
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