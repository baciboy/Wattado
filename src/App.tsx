import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import AccountPage from "./pages/AccountPage";
import { EventModal } from './components/EventModal';
import { useState, useEffect } from 'react';
import { Event, FilterState } from './types/Event';
import { ticketmasterService } from './services/ticketmasterService';

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
      try {
        const groupedEvents = await ticketmasterService.searchGroupedEvents({
          size: 200,
          countryCode: 'GB',
          city: debouncedCity || undefined,
          startDateTime: filters.dateRange.start || undefined,
          classificationName: filters.categories[0]
        });
        if (groupedEvents.length === 0) {
          setEvents([]);
          setError('No events found. Try a different search.');
          return;
        }
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
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-xl text-purple-600">Loading...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
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
    <div className="h-full">
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
          <Route path="/account" element={<AccountPage />} />
        </Routes>
        <EventModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      </Router>
    </div>
  );
}

export default App;