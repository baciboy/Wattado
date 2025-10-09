import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Star } from 'lucide-react';
import { Event } from '../types/Event';

interface FeaturedCarouselProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

const platformColors = {
  eventbrite: 'bg-orange-500',
  ticketmaster: 'bg-blue-600',
  stubhub: 'bg-red-500',
  seatgeek: 'bg-green-600',
  'vivid-seats': 'bg-purple-600'
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
  const featuredEvents = events.slice(0, 5); // Show first 5 events as featured

  useEffect(() => {
    if (featuredEvents.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredEvents.length);
    }, 5000); // Auto-advance every 5 seconds

    return () => clearInterval(interval);
  }, [featuredEvents.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredEvents.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
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
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (min: number, max: number, currency: string) => {
    if ((min === 0 && max === 0) || (min === Number.POSITIVE_INFINITY && max === 0)) return 'Free';
    if (min === max) return `${currency} ${min}`;
    return `${currency} ${min} - ${max}`;
  };

  if (featuredEvents.length === 0) return null;

  const currentEvent = featuredEvents[currentIndex];

  return (
    <div className="relative w-full mb-8">
      {/* Main Carousel */}
      <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl group">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${currentEvent.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
          <div className="max-w-2xl">
            {/* Platform Badge */}
            <div className="mb-4">
              <span className={`${platformColors[currentEvent.platform]} text-white text-sm font-semibold px-4 py-2 rounded-full inline-block`}>
                {platformNames[currentEvent.platform]}
              </span>
            </div>

            {/* Category */}
            <div className="mb-3">
              <span className="text-purple-400 text-sm font-semibold uppercase tracking-wider">
                {currentEvent.category}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
              {currentEvent.title}
            </h2>

            {/* Event Details */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2 text-white">
                <Calendar className="w-5 h-5 text-purple-400" />
                <span className="text-lg">{formatDate(currentEvent.date)}</span>
              </div>

              <div className="flex items-center gap-2 text-white">
                <MapPin className="w-5 h-5 text-purple-400" />
                <span className="text-lg">{currentEvent.location.venue}, {currentEvent.location.city}</span>
              </div>

              {currentEvent.rating && (
                <div className="flex items-center gap-2 text-white">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold">{currentEvent.rating}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-200 text-base mb-4 line-clamp-2">
              {currentEvent.description}
            </p>

            {/* Price and CTA */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="text-white">
                <span className="text-2xl font-bold">
                  {formatPrice(currentEvent.price.min, currentEvent.price.max, currentEvent.price.currency)}
                </span>
              </div>
              <button
                onClick={() => onEventClick(currentEvent)}
                className="px-6 py-2.5 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {featuredEvents.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous event"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next event"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Dots Navigation */}
      {featuredEvents.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {featuredEvents.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all ${
                index === currentIndex
                  ? 'w-8 h-3 bg-purple-600'
                  : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
              } rounded-full`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
