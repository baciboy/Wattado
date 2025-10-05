import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import { EventModal } from './components/EventModal';
import { useState } from 'react';
import { Event } from './types/Event';
import { useEventFilters } from './hooks/useEventFilters';

function App() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use the centralized event filters hook
  const {
    filters,
    setFilters,
    filteredEvents,
    loading,
    error
  } = useEventFilters();

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

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
              filters={filters}
              setFilters={setFilters}
              loading={loading}
              error={error}
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