import React from "react";
import { Header } from "../components/Header";
import { EventCard } from "../components/EventCard";
import { FilterSidebar } from "../components/FilterSidebar";
import { EventGridSkeleton } from "../components/LoadingSkeleton";
import { Calendar } from "lucide-react";
import { Event, FilterState } from "../types/Event";

interface HomePageProps {
  filteredEvents: Event[];
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  loading: boolean;
  error: string | null;
  handleEventClick: (event: Event) => void;
}

const HomePage: React.FC<HomePageProps> = ({
  filteredEvents,
  isFilterOpen,
  setIsFilterOpen,
  filters,
  setFilters,
  loading,
  error,
  handleEventClick,
}) => {
  const clearAllFilters = () => {
    setFilters({
      search: '',
      dateRange: { start: '', end: '' },
      location: '',
      categories: [],
      priceRange: { min: 0, max: 1000 },
      platforms: [],
      availability: []
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
        totalEvents={filteredEvents.length}
      />
      <div className="max-w-7xl mx-auto flex">
        <FilterSidebar
          filters={filters}
          onFiltersChange={setFilters}
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          eventCount={filteredEvents.length}
        />
        {loading ? (
          <EventGridSkeleton count={9} />
        ) : error ? (
          <div className="flex-1 flex items-center justify-center py-16">
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
        ) : filteredEvents.length === 0 ? (
          <div className="flex-1 text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filters to find more events.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
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
  );
};

export default HomePage;
