import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Star, ExternalLink, Heart } from 'lucide-react';
import { Event } from '../types/Event';
import { useFavourites } from '../hooks/useFavourites';

interface FeaturedCarouselProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

const platformColors = {
  eventbrite: 'bg-orange-500',
  ticketmaster: 'bg-blue-700',
  stubhub: 'bg-red-500',
  seatgeek: 'bg-green-600',
  'vivid-seats': 'bg-blue-600'
};

const platformNames = {
  eventbrite: 'Eventbrite',
  ticketmaster: 'Ticketmaster',
  stubhub: 'StubHub',
  seatgeek: 'SeatGeek',
  'vivid-seats': 'Vivid Seats'
};

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ events, onEventClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { isFavourited, toggleFavourite } = useFavourites();
  const featuredEvents = events.slice(0, 6); // Show first 6 events as featured

  const handleFavouriteClick = async (e: React.MouseEvent, event: Event) => {
    e.stopPropagation(); // Prevent triggering card click
    await toggleFavourite(event);
  };

  useEffect(() => {
    if (featuredEvents.length === 0 || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredEvents.length);
    }, 4000); // Auto-advance every 4 seconds

    return () => clearInterval(interval);
  }, [featuredEvents.length, isAutoPlaying]);

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % featuredEvents.length);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const formatDate = (dateString: string) => {
    if (dateString.includes(' - ')) {
      const [start, end] = dateString.split(' - ');
      const startDate = new Date(start);
      const endDate = new Date(end);
      return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (min: number, max: number, currency: string) => {
    if ((min === 0 && max === 0) || (min === Number.POSITIVE_INFINITY && max === 0)) return 'Free';
    if (min === max) return `${currency} ${min}`;
    return `${currency} ${min} - ${max}`;
  };

  if (featuredEvents.length === 0) return null;

  // Calculate indices for the three visible cards
  const getPrevIndex = () => (currentIndex - 1 + featuredEvents.length) % featuredEvents.length;
  const getNextIndex = () => (currentIndex + 1) % featuredEvents.length;

  const centerEvent = featuredEvents[currentIndex];
  const leftEvent = featuredEvents[getPrevIndex()];
  const rightEvent = featuredEvents[getNextIndex()];

  return (
    <div className="relative w-full mb-20 md:mb-24">
      {/* Main Container: Intro + Carousel */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
        {/* Left Side: Introduction (1/4) */}
        <div className="lg:w-1/4 flex flex-col justify-center px-4 lg:px-8">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-5 leading-tight tracking-tight">
                Discover Amazing Events
              </h2>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed tracking-wide">
                Find and explore events from all major platforms in one place. From concerts to sports, theater to festivals - your next unforgettable experience awaits.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-200/50">
                  <Calendar className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900 mb-1.5 tracking-tight">All Platforms</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">Compare events from Ticketmaster, Eventbrite, and more</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 border border-purple-200/50">
                  <Star className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900 mb-1.5 tracking-tight">Best Prices</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">Find the best deals and ticket prices</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-200/50">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900 mb-1.5 tracking-tight">Local Events</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">Discover events happening near you</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: 3D Carousel (3/4) */}
        <div className="lg:w-3/4 relative h-[450px] md:h-[520px] flex items-center justify-center px-4 md:px-8">
        {/* Left Card */}
        <div
          className="absolute left-[15%] md:left-[20%] top-1/2 -translate-y-1/2 w-[300px] md:w-[420px] cursor-pointer transform scale-75 md:scale-85 opacity-40 hover:opacity-60 transition-all duration-500 z-10"
          onClick={goToPrevious}
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-purple-100/50">
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 via-transparent to-transparent z-10" />
              <img
                src={leftEvent.image}
                alt={leftEvent.title}
                className="w-full h-40 md:h-48 object-cover"
              />
              <div className="absolute top-3 left-3 z-20">
                <span className={`${platformColors[leftEvent.platform]} text-white text-xs font-semibold px-2 py-1 rounded-full`}>
                  {platformNames[leftEvent.platform]}
                </span>
              </div>
            </div>
            <div className="p-3 md:p-4">
              <span className="text-xs font-medium text-purple-700 bg-gradient-to-r from-purple-50 to-pink-50 px-2 py-1 rounded-full border border-purple-100">
                {leftEvent.category}
              </span>
              <h3 className="font-bold text-base md:text-lg text-gray-900 mt-2 line-clamp-1">
                {leftEvent.title}
              </h3>
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 mt-2">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                <span>{formatDate(leftEvent.date)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Card (Main) */}
        <div
          className="relative w-[380px] md:w-[600px] cursor-pointer transform scale-100 z-30 hover:scale-[1.02] transition-all duration-500"
          onClick={() => onEventClick(centerEvent)}
        >
          <div className="bg-white rounded-3xl shadow-[0_25px_80px_-20px_rgba(0,0,0,0.4)] overflow-hidden hover:shadow-[0_30px_90px_-20px_rgba(0,0,0,0.5)] transition-all duration-300 border-2 border-gradient-to-r from-blue-200/50 via-purple-200/50 to-pink-200/50">
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-purple-900/20 to-transparent z-10" />
              <img
                src={centerEvent.image}
                alt={centerEvent.title}
                className="w-full h-52 md:h-72 object-cover"
              />
              <div className="absolute top-4 left-4 z-20">
                <span className={`${platformColors[centerEvent.platform]} text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg`}>
                  {platformNames[centerEvent.platform]}
                </span>
              </div>
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                <button
                  onClick={(e) => handleFavouriteClick(e, centerEvent)}
                  className={`p-2.5 rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 ${
                    isFavourited(centerEvent.id)
                      ? 'bg-pink-500 text-white'
                      : 'bg-white/90 text-gray-600 hover:bg-white hover:text-pink-500'
                  }`}
                  aria-label={isFavourited(centerEvent.id) ? 'Remove from favourites' : 'Add to favourites'}
                >
                  <Heart className={`w-5 h-5 ${isFavourited(centerEvent.id) ? 'fill-current' : ''}`} />
                </button>
                {centerEvent.rating && (
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 border border-yellow-200/50">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="text-sm font-bold text-gray-900">{centerEvent.rating}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-blue-700 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 px-3 py-1.5 rounded-full border border-blue-100">
                  {centerEvent.category}
                </span>
              </div>

              <h3 className="font-bold text-xl md:text-2xl text-gray-900 mb-2 leading-tight line-clamp-2">
                {centerEvent.title}
              </h3>

              <p className="text-gray-600 text-sm md:text-base mb-4 line-clamp-2">
                {centerEvent.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm md:text-base text-gray-700">
                  <Calendar className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                  <span className="font-medium">{formatDate(centerEvent.date)}{centerEvent.time ? ` at ${centerEvent.time}` : ''}</span>
                </div>

                <div className="flex items-center gap-2 text-sm md:text-base text-gray-700">
                  <MapPin className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                  <span className="font-medium line-clamp-1">{centerEvent.location.venue}, {centerEvent.location.city}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {centerEvent.price
                    ? formatPrice(centerEvent.price.min, centerEvent.price.max, centerEvent.price.currency)
                    : 'Free'}
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full font-semibold text-sm md:text-base hover:shadow-lg transition-all">
                  <span>View Details</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card */}
        <div
          className="absolute right-[15%] md:right-[20%] top-1/2 -translate-y-1/2 w-[300px] md:w-[420px] cursor-pointer transform scale-75 md:scale-85 opacity-40 hover:opacity-60 transition-all duration-500 z-10"
          onClick={goToNext}
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-teal-100/50">
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-teal-900/30 via-transparent to-transparent z-10" />
              <img
                src={rightEvent.image}
                alt={rightEvent.title}
                className="w-full h-40 md:h-48 object-cover"
              />
              <div className="absolute top-3 left-3 z-20">
                <span className={`${platformColors[rightEvent.platform]} text-white text-xs font-semibold px-2 py-1 rounded-full`}>
                  {platformNames[rightEvent.platform]}
                </span>
              </div>
            </div>
            <div className="p-3 md:p-4">
              <span className="text-xs font-medium text-teal-700 bg-gradient-to-r from-teal-50 to-cyan-50 px-2 py-1 rounded-full border border-teal-100">
                {rightEvent.category}
              </span>
              <h3 className="font-bold text-base md:text-lg text-gray-900 mt-2 line-clamp-1">
                {rightEvent.title}
              </h3>
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 mt-2">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                <span>{formatDate(rightEvent.date)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {featuredEvents.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 p-3 md:p-4 bg-white hover:bg-blue-50 text-blue-700 rounded-full transition-all shadow-lg hover:shadow-xl z-30 hover:scale-110"
              aria-label="Previous event"
            >
              <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 p-3 md:p-4 bg-white hover:bg-blue-50 text-blue-700 rounded-full transition-all shadow-lg hover:shadow-xl z-30 hover:scale-110"
              aria-label="Next event"
            >
              <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
            </button>
          </>
        )}

        {/* Dots Navigation */}
        {featuredEvents.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-2 z-20">
            {featuredEvents.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all ${
                  index === currentIndex
                    ? 'w-10 h-2.5 bg-blue-700'
                    : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
                } rounded-full`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};
