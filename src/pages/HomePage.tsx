import React, { useState } from "react";
import { Header } from "../components/Header";
import { EventCard } from "../components/EventCard";
import { FeaturedCarousel } from "../components/FeaturedCarousel";
import { Calendar, ChevronRight, Star, MapPin, Heart } from "lucide-react";
import { Event, FilterState } from "../types/Event";
import { useFavourites } from "../hooks/useFavourites";

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
  const [showAllEvents, setShowAllEvents] = useState(false);
  const { isFavourited, toggleFavourite } = useFavourites();

  const handleFavouriteClick = async (e: React.MouseEvent, event: Event) => {
    e.stopPropagation(); // Prevent triggering card click
    await toggleFavourite(event);
  };

  // Group events by category
  const categorizeEvents = (events: Event[]) => {
    const categories: { [key: string]: Event[] } = {
      'Music': [],
      'Sports': [],
      'Arts & Theatre': [],
      'Family': [],
      'Other': []
    };

    events.forEach(event => {
      const cat = event.category || 'Other';
      if (cat.toLowerCase().includes('music') || cat.toLowerCase().includes('concert')) {
        categories['Music'].push(event);
      } else if (cat.toLowerCase().includes('sport')) {
        categories['Sports'].push(event);
      } else if (cat.toLowerCase().includes('arts') || cat.toLowerCase().includes('theatre') || cat.toLowerCase().includes('theater')) {
        categories['Arts & Theatre'].push(event);
      } else if (cat.toLowerCase().includes('family')) {
        categories['Family'].push(event);
      } else {
        categories['Other'].push(event);
      }
    });

    return categories;
  };

  const categorizedEvents = categorizeEvents(filteredEvents);
  const eventsToShow = showAllEvents ? filteredEvents : filteredEvents.slice(0, 12);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <Header
        totalEvents={filteredEvents.length}
        filters={filters}
        onFiltersChange={onFiltersChange}
      />
      <div className="flex-1 overflow-y-auto w-full">
        <div className="max-w-[1920px] mx-auto px-4 py-10 md:py-16 lg:px-8 xl:px-16 2xl:px-20">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 md:py-24">
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

            {/* Category Sections */}
            <div className="mt-20 md:mt-24 space-y-16 md:space-y-20">
              {Object.entries(categorizedEvents).map(([category, events]) => {
                if (events.length === 0) return null;

                const categoryIcons: { [key: string]: string } = {
                  'Music': '🎵',
                  'Sports': '⚽',
                  'Arts & Theatre': '🎭',
                  'Family': '👨‍👩‍👧‍👦',
                  'Other': '🎉'
                };

                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{categoryIcons[category]}</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                          {category}
                        </h2>
                      </div>
                      {events.length > 6 && (
                        <button
                          onClick={() => onFiltersChange({ ...filters, categories: [category] })}
                          className="flex items-center gap-2 text-blue-700 hover:text-blue-800 font-semibold transition-colors"
                        >
                          View All
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    {/* Horizontal Scrollable Grid */}
                    <div className="overflow-x-auto pb-4 -mx-4 px-4 md:-mx-8 md:px-8 lg:-mx-16 lg:px-16 2xl:-mx-20 2xl:px-20">
                      <div className="flex gap-6 min-w-max">
                        {events.slice(0, 6).map(event => (
                          <div key={event.id} className="w-[300px] md:w-[340px] flex-shrink-0">
                            <EventCard
                              event={event}
                              onEventClick={handleEventClick}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* We Think You'd Like Section */}
            {filteredEvents.length > 6 && (
              <div className="mt-20 md:mt-24 bg-gradient-to-r from-purple-50/50 via-blue-50/50 to-pink-50/50 border-y border-purple-100/50 py-16 md:py-20 -mx-4 px-4 md:-mx-8 md:px-8 lg:-mx-16 lg:px-16 2xl:-mx-20 2xl:px-20">
                <div className="max-w-[1600px] mx-auto">
                  <div className="mb-10 md:mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">We think you'd like</h2>
                    <p className="text-gray-600 text-base md:text-lg leading-relaxed tracking-wide">Personalized recommendations just for you</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {filteredEvents.slice(6, 10).map((event, index) => (
                      <div
                        key={event.id}
                        onClick={() => handleEventClick(event)}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 hover:-translate-y-1 border border-gray-100 hover:border-purple-200"
                      >
                        <div className="relative overflow-hidden">
                          <div className={`absolute inset-0 bg-gradient-to-t ${
                            index === 0 ? 'from-orange-900/30' :
                            index === 1 ? 'from-pink-900/30' :
                            index === 2 ? 'from-teal-900/30' :
                            'from-purple-900/30'
                          } via-transparent to-transparent z-10`} />
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3 z-20">
                            <span className={`${
                              event.platform === 'eventbrite' ? 'bg-orange-500' :
                              event.platform === 'ticketmaster' ? 'bg-blue-700' :
                              event.platform === 'stubhub' ? 'bg-red-500' :
                              event.platform === 'seatgeek' ? 'bg-green-600' :
                              'bg-blue-600'
                            } text-white text-xs font-semibold px-2 py-1 rounded-full`}>
                              {event.platform === 'eventbrite' ? 'Eventbrite' :
                               event.platform === 'ticketmaster' ? 'Ticketmaster' :
                               event.platform === 'stubhub' ? 'StubHub' :
                               event.platform === 'seatgeek' ? 'SeatGeek' :
                               'Vivid Seats'}
                            </span>
                          </div>
                          <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
                            <button
                              onClick={(e) => handleFavouriteClick(e, event)}
                              className={`p-2 rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 ${
                                isFavourited(event.id)
                                  ? 'bg-pink-500 text-white'
                                  : 'bg-white/90 text-gray-600 hover:bg-white hover:text-pink-500'
                              }`}
                              aria-label={isFavourited(event.id) ? 'Remove from favourites' : 'Add to favourites'}
                            >
                              <Heart className={`w-4 h-4 ${isFavourited(event.id) ? 'fill-current' : ''}`} />
                            </button>
                            {event.rating && (
                              <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 border border-yellow-200/50">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-bold text-gray-900">{event.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="p-4">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${
                            index === 0 ? 'text-orange-700 bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100' :
                            index === 1 ? 'text-pink-700 bg-gradient-to-r from-pink-50 to-rose-50 border-pink-100' :
                            index === 2 ? 'text-teal-700 bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-100' :
                            'text-purple-700 bg-gradient-to-r from-purple-50 to-violet-50 border-purple-100'
                          }`}>
                            {event.category}
                          </span>
                          <h3 className="font-bold text-base text-gray-900 mt-2 line-clamp-2">
                            {event.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span className="line-clamp-1">{event.location.city}</span>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className={`text-lg font-extrabold bg-gradient-to-r bg-clip-text text-transparent ${
                              index === 0 ? 'from-orange-600 to-amber-600' :
                              index === 1 ? 'from-pink-600 to-rose-600' :
                              index === 2 ? 'from-teal-600 to-cyan-600' :
                              'from-purple-600 to-violet-600'
                            }`}>
                              {event.price
                                ? event.price.min === 0 && event.price.max === 0 ? 'Free' :
                                  event.price.min === event.price.max ? `${event.price.currency} ${event.price.min}` :
                                  `${event.price.currency} ${event.price.min} - ${event.price.max}`
                                : 'Free'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Browse All Section */}
            <div className="mt-24 md:mt-28">
              <div className="mb-12">
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
                  {showAllEvents ? 'All Events' : 'More Events'}
                </h2>
                <p className="text-gray-600 text-lg md:text-xl leading-relaxed tracking-wide">
                  {showAllEvents ? `Showing all ${filteredEvents.length} events` : `Showing ${eventsToShow.length} of ${filteredEvents.length} events`}
                </p>
              </div>

              {/* Event Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
                {eventsToShow.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onEventClick={handleEventClick}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {!showAllEvents && filteredEvents.length > 12 && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={() => setShowAllEvents(true)}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    Load More Events ({filteredEvents.length - 12} remaining)
                  </button>
                </div>
              )}
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
