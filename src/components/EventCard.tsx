import React from 'react';
import { Calendar, MapPin, Users, Star, ExternalLink } from 'lucide-react';
import { Event } from '../types/Event';

interface EventCardProps {
  event: Event;
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
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group border border-gray-100 hover:border-gray-200"
      onClick={() => onEventClick(event)}
    >
      <div className="relative">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className={`${platformColors[event.platform]} text-white text-xs font-semibold px-2 py-1 rounded-full`}>
            {platformNames[event.platform]}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`${availabilityColors[event.availability]} text-xs font-medium px-2 py-1 rounded-full`}>
            {availabilityText[event.availability]}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
            {event.category}
          </span>
          {event.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700">{event.rating}</span>
            </div>
          )}
        </div>

        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
          {event.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-purple-500" />
            <span>{formatDate(event.date)}{event.time ? ` at ${event.time}` : ''}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-purple-500" />
            <span>{event.location.venue}, {event.location.city}</span>
          </div>

          {event.attendees && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4 text-purple-500" />
              <span>{event.attendees.toLocaleString()} attending</span>
            </div>
          )}

          {event.genre && event.platform === 'ticketmaster' && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-4 h-4 text-purple-500">🎵</span>
              <span>{event.genre}{event.subGenre ? ` • ${event.subGenre}` : ''}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-lg font-bold text-gray-900">
            {event.price
              ? formatPrice(event.price.min, event.price.max, event.price.currency)
              : 'Price not available'}
          </div>
          <div className="flex items-center gap-1 text-purple-600 font-medium text-sm group-hover:text-purple-700">
            <span>View Details</span>
            <ExternalLink className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};