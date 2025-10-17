import React from "react";
import { Header } from "../components/Header";
import { EventCard } from "../components/EventCard";
import { FeaturedCarousel } from "../components/FeaturedCarousel";
import { Calendar } from "lucide-react";
import { Event, FilterState } from "../types/Event";

interface HomePageProps {
  filteredEvents: Event[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  handleEventClick: (event: Event) => void;
}

const HomePage: React.FC<HomePageProps> = ({
  filteredEvents,
  filters,
  onFiltersChange,
  handleEventClick,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        totalEvents={filteredEvents.length}
        filters={filters}
        onFiltersChange={onFiltersChange}
      />
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
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
              onClick={() => onFiltersChange({
                search: '',
                dateRange: { start: '', end: '' },
                location: '',
                categories: [],
                priceRange: { min: 0, max: 1000 },
                platforms: [],
                availability: []
              })}
              className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Featured Carousel */}
            <FeaturedCarousel
              events={filteredEvents}
              onEventClick={handleEventClick}
            />

            {/* Section Title with more spacing */}
            <div className="mb-8 mt-12 md:mt-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">All Events</h2>
              <p className="text-gray-600 text-lg">Browse all available events</p>
            </div>

            {/* Event Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {filteredEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEventClick={handleEventClick}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
