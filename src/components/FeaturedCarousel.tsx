import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Star, ExternalLink } from 'lucide-react';
import { Event } from '../types/Event';

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
  const featuredEvents = events.slice(0, 6); // Show first 6 events as featured

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
    <div className="relative w-full mb-16">
      {/* 3D Carousel Container */}
      <div className="relative h-[600px] md:h-[650px] flex items-center justify-center px-4 md:px-8">
        {/* Left Card */}
        <div
          className="absolute left-4 md:left-16 top-32 md:top-40 w-[280px] md:w-[340px] cursor-pointer transform scale-75 md:scale-80 opacity-50 hover:opacity-70 transition-all duration-500 z-10"
          onClick={goToPrevious}
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="relative">
              <img
                src={leftEvent.image}
                alt={leftEvent.title}
                className="w-full h-56 md:h-64 object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className={`${platformColors[leftEvent.platform]} text-white text-xs font-semibold px-2 py-1 rounded-full`}>
                  {platformNames[leftEvent.platform]}
                </span>
              </div>
            </div>
            <div className="p-4">
              <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
                {leftEvent.category}
              </span>
              <h3 className="font-bold text-lg text-gray-900 mt-2 line-clamp-2">
                {leftEvent.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>{formatDate(leftEvent.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="line-clamp-1">{leftEvent.location.city}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Card (Main) */}
        <div
          className="relative w-[360px] md:w-[500px] cursor-pointer transform scale-100 z-30 hover:scale-[1.02] transition-all duration-500"
          onClick={() => onEventClick(centerEvent)}
        >
          <div className="bg-white rounded-3xl shadow-[0_25px_80px_-20px_rgba(0,0,0,0.4)] overflow-hidden hover:shadow-[0_30px_90px_-20px_rgba(0,0,0,0.5)] transition-all duration-300">
            <div className="relative">
              <img
                src={centerEvent.image}
                alt={centerEvent.title}
                className="w-full h-80 md:h-96 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className={`${platformColors[centerEvent.platform]} text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg`}>
                  {platformNames[centerEvent.platform]}
                </span>
              </div>
              {centerEvent.rating && (
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-bold text-gray-900">{centerEvent.rating}</span>
                </div>
              )}
            </div>

            <div className="p-6 md:p-7">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full">
                  {centerEvent.category}
                </span>
              </div>

              <h3 className="font-bold text-2xl md:text-3xl text-gray-900 mb-3 leading-tight line-clamp-2">
                {centerEvent.title}
              </h3>

              <p className="text-gray-600 text-sm md:text-base mb-4 line-clamp-2">
                {centerEvent.description}
              </p>

              <div className="space-y-2.5 mb-5">
                <div className="flex items-center gap-2 text-sm md:text-base text-gray-700">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">{formatDate(centerEvent.date)}{centerEvent.time ? ` at ${centerEvent.time}` : ''}</span>
                </div>

                <div className="flex items-center gap-2 text-sm md:text-base text-gray-700">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="font-medium line-clamp-1">{centerEvent.location.venue}, {centerEvent.location.city}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                <div className="text-2xl md:text-3xl font-bold text-gray-900">
                  {centerEvent.price
                    ? formatPrice(centerEvent.price.min, centerEvent.price.max, centerEvent.price.currency)
                    : 'Free'}
                </div>
                <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm md:text-base">
                  <span>View Details</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card */}
        <div
          className="absolute right-4 md:right-16 top-32 md:top-40 w-[280px] md:w-[340px] cursor-pointer transform scale-75 md:scale-80 opacity-50 hover:opacity-70 transition-all duration-500 z-10"
          onClick={goToNext}
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="relative">
              <img
                src={rightEvent.image}
                alt={rightEvent.title}
                className="w-full h-56 md:h-64 object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className={`${platformColors[rightEvent.platform]} text-white text-xs font-semibold px-2 py-1 rounded-full`}>
                  {platformNames[rightEvent.platform]}
                </span>
              </div>
            </div>
            <div className="p-4">
              <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
                {rightEvent.category}
              </span>
              <h3 className="font-bold text-lg text-gray-900 mt-2 line-clamp-2">
                {rightEvent.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>{formatDate(rightEvent.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="line-clamp-1">{rightEvent.location.city}</span>
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
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 p-3 md:p-4 bg-white hover:bg-blue-50 text-blue-700 rounded-full transition-all shadow-lg hover:shadow-xl z-30 hover:scale-110"
              aria-label="Next event"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </>
        )}
      </div>

      {/* Dots Navigation */}
      {featuredEvents.length > 1 && (
        <div className="flex justify-center gap-2 mt-8">
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
  );
};
