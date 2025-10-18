import React from 'react';
import { Calendar, MapPin, Users, Star, ExternalLink, Heart } from 'lucide-react';
import { Event } from '../types/Event';
import { useFavourites } from '../hooks/useFavourites';

interface EventCardProps {
  event: Event;
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

const availabilityColors = {
  available: 'text-green-600 bg-green-50',
  low: 'text-orange-600 bg-orange-50',
  'sold-out': 'text-red-600 bg-red-50'
};

const availabilityText = {
  available: 'Available',
  low: 'Few left',
  'sold-out': 'Sold Out'
};

export const EventCard: React.FC<EventCardProps> = ({ event, onEventClick }) => {
  const { isFavourited, toggleFavourite } = useFavourites();
  const isFav = isFavourited(event.id);

  const handleFavouriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the event modal
    await toggleFavourite(event);
  };

  const formatDate = (dateString: string) => {
    // If dateString is a range, format both dates
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

  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group border border-gray-100 hover:border-blue-200 hover:-translate-y-1"
      onClick={() => onEventClick(event)}
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 z-20">
          <span className={`${platformColors[event.platform]} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg`}>
            {platformNames[event.platform]}
          </span>
        </div>
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
          <button
            onClick={handleFavouriteClick}
            className={`p-2 rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 ${
              isFav
                ? 'bg-pink-500 text-white'
                : 'bg-white/90 text-gray-600 hover:bg-white hover:text-pink-500'
            }`}
            aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
          >
            <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
          </button>
          <span className={`${availabilityColors[event.availability]} text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm shadow-md`}>
            {availabilityText[event.availability]}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-blue-700 bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1.5 rounded-full border border-blue-100">
            {event.category}
          </span>
          {event.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700">{event.rating}</span>
            </div>
          )}
        </div>

        <h3 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
          {event.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>{formatDate(event.date)}{event.time ? ` at ${event.time}` : ''}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>{event.location.venue}, {event.location.city}</span>
          </div>

          {event.attendees && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4 text-blue-600" />
              <span>{event.attendees.toLocaleString()} attending</span>
            </div>
          )}

          {event.genre && event.platform === 'ticketmaster' && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-4 h-4 text-blue-600">🎵</span>
              <span>{event.genre}{event.subGenre ? ` • ${event.subGenre}` : ''}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 group-hover:border-blue-100">
          <div className="text-xl font-extrabold bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent">
            {event.price
              ? formatPrice(event.price.min, event.price.max, event.price.currency)
              : 'Price not available'}
          </div>
          <div className="flex items-center gap-1.5 text-blue-700 font-semibold text-sm group-hover:text-blue-800 group-hover:gap-2 transition-all">
            <span>View Details</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};