import React from "react";
import { Header } from "../components/Header";
import { EventCard } from "../components/EventCard";
import { EventModal } from "../components/EventModal";
import { FilterSidebar } from "../components/FilterSidebar";
import { Calendar } from "lucide-react";
import { Event, FilterState } from "../types/Event";

interface HomePageProps {
  filteredEvents: Event[];
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  search: string;
  setSearch: (s: string) => void;
  city: string;
  setCity: (c: string) => void;
  date: Date | null;
  setDate: (d: Date | null) => void;
  type: string;
  setType: (t: string) => void;
  handleEventClick: (event: Event) => void;
}

const HomePage: React.FC<HomePageProps> = ({
  filteredEvents,
  isFilterOpen,
  setIsFilterOpen,
  search,
  setSearch,
  city,
  setCity,
  date,
  setDate,
  type,
  setType,
  handleEventClick,
}) => {
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
      <EventModal />
    </div>
  );
};

export default HomePage;
