import React from 'react';
import { X, Calendar, MapPin, Users, Star, ExternalLink, Clock, DollarSign } from 'lucide-react';
import { Event } from '../types/Event';

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
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

export const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose }) => {
  if (!isOpen || !event) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    // Handle date range
    if (dateString.includes(' - ')) {
      const [start, end] = dateString.split(' - ');
      const startDate = new Date(start);
      const endDate = new Date(end);
      return `${startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatPrice = (min: number, max: number, currency: string) => {
    if (min === 0 && max === 0) return 'Free';
    if (min === max) return `${currency} ${min}`;
    return `${currency} ${min} - ${max}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header Image */}
        <div className="relative h-64 md:h-80">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover rounded-t-2xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="absolute top-4 left-4">
            <span className={`${platformColors[event.platform]} text-white text-sm font-semibold px-3 py-1 rounded-full`}>
              {platformNames[event.platform]}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                  {event.category}
                </span>
                {event.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{event.rating}</span>
                  </div>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {event.title}
              </h1>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {formatPrice(event.price.min, event.price.max, event.price.currency)}
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                event.availability === 'available' ? 'text-green-700 bg-green-100' :
                event.availability === 'low' ? 'text-orange-700 bg-orange-100' :
                'text-red-700 bg-red-100'
              }`}>
                {event.availability === 'available' ? 'Available' :
                 event.availability === 'low' ? 'Few left' : 'Sold Out'}
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            {event.description}
          </p>

          {/* Additional Ticketmaster Info */}
          {event.platform === 'ticketmaster' && (event.genre || event.promoter) && (
            <div className="bg-blue-50 rounded-lg p-4 mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">Event Details</h3>
              <div className="space-y-1 text-sm">
                {event.genre && (
                  <p className="text-gray-700">
                    <span className="font-medium">Genre:</span> {event.genre}
                    {event.subGenre && ` • ${event.subGenre}`}
                  </p>
                )}
                {event.promoter && (
                  <p className="text-gray-700">
                    <span className="font-medium">Promoter:</span> {event.promoter}
                  </p>
                )}
              </div>
            </div>
          )}
          {/* Event Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-purple-500 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">{formatDate(event.date)}</p>
                  <p className="text-gray-600 text-sm">Event Date</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-purple-500 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">{event.time}</p>
                  <p className="text-gray-600 text-sm">Start Time</p>
                </div>
              </div>

              {event.attendees && (
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-purple-500 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">{event.attendees.toLocaleString()}</p>
                    <p className="text-gray-600 text-sm">People attending</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-purple-500 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">{event.location.venue}</p>
                  <p className="text-gray-600">{event.location.city}, {event.location.state}</p>
                  <p className="text-gray-500 text-sm">{event.location.address}</p>
                  {event.location.coordinates && (
                    <button
                      onClick={() => {
                        const { latitude, longitude } = event.location.coordinates!;
                        window.open(`https://maps.google.com/?q=${latitude},${longitude}`, '_blank');
                      }}
                      className="text-purple-600 hover:text-purple-700 text-sm font-medium mt-1"
                    >
                      View on Map →
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-purple-500 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {formatPrice(event.price.min, event.price.max, event.price.currency)}
                  </p>
                  <p className="text-gray-600 text-sm">Ticket Price Range</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.open(event.url, '_blank')}
              disabled={event.availability === 'sold-out'}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                event.availability === 'sold-out'
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl'
              }`}
            >
              <span>
                {event.availability === 'sold-out' ? 'Sold Out' : 'Get Tickets'}
              </span>
              {event.availability !== 'sold-out' && <ExternalLink className="w-5 h-5" />}
            </button>
            
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold">
              Save Event
            </button>
          </div>

          {/* Platform Attribution */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Tickets provided by{' '}
              <span className="font-medium text-gray-700">
                {platformNames[event.platform]}
              </span>
              {event.platform === 'ticketmaster' && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  Live Data
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};