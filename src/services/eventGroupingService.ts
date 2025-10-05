import { Event, TicketmasterEvent } from '../types/Event';

export interface GroupedEventData {
  id: string;
  title: string;
  description: string;
  location: Event['location'];
  price: Event['price'];
  category: string;
  platform: Event['platform'];
  image: string;
  url: string;
  availability: Event['availability'];
  rating?: number;
  attendees?: number;
  ticketmasterId?: string;
  genre?: string;
  subGenre?: string;
  promoter?: string;
  dates: string[];
  times: string[];
}

class EventGroupingService {
  /**
   * Groups events by title and venue to remove duplicates from multiple showtimes
   * @param events - Array of Ticketmaster events to group
   * @returns Array of grouped events with consolidated dates and times
   */
  groupTicketmasterEvents(events: TicketmasterEvent[]): Event[] {
    const eventMap = new Map<string, GroupedEventData>();

    events.forEach((event: TicketmasterEvent) => {
      // Normalize name: remove all time and day-of-week patterns from name
      const rawName = event.name || 'Untitled Event';
      const cleanTitle = this.cleanEventTitle(rawName);
      const normalizedName = cleanTitle.toLowerCase();
      const venue = (event._embedded?.venues?.[0]?.name || 'Unknown').trim().toLowerCase();
      const key = `${normalizedName}__${venue}`;

      const date = event.dates?.start?.localDate || '';
      const time = event.dates?.start?.localTime || '';

      if (eventMap.has(key)) {
        // Add to existing group
        const grouped = eventMap.get(key)!;
        if (!grouped.dates.includes(date)) grouped.dates.push(date);
        if (time && !grouped.times.includes(time)) grouped.times.push(time);
      } else {
        // Create new group
        eventMap.set(key, {
          id: key,
          title: cleanTitle,
          description: '',
          location: {
            venue: event._embedded?.venues?.[0]?.name || 'Unknown',
            city: event._embedded?.venues?.[0]?.city?.name || 'Unknown',
            state: event._embedded?.venues?.[0]?.state?.name || '',
            address: event._embedded?.venues?.[0]?.address?.line1 || '',
            coordinates: event._embedded?.venues?.[0]?.location ? {
              latitude: Number(event._embedded.venues[0].location.latitude),
              longitude: Number(event._embedded.venues[0].location.longitude)
            } : undefined
          },
          price: event.priceRanges && event.priceRanges.length > 0 ? {
            min: event.priceRanges[0].min,
            max: event.priceRanges[0].max,
            currency: event.priceRanges[0].currency
          } : { min: 0, max: 0, currency: 'GBP' },
          category: event.classifications?.[0]?.segment?.name || '',
          platform: 'ticketmaster',
          image: event.images?.[0]?.url || 'https://via.placeholder.com/400',
          url: event.url || '',
          availability: 'available',
          rating: undefined,
          attendees: undefined,
          ticketmasterId: event.id,
          genre: event.classifications?.[0]?.genre?.name,
          subGenre: event.classifications?.[0]?.subGenre?.name,
          promoter: event.promoter?.name,
          dates: [date],
          times: time ? [time] : []
        });
      }
    });

    // Convert grouped events to final Event format
    return this.convertGroupedEventsToEvents(eventMap, events);
  }

  /**
   * Cleans event title by removing time and day-of-week patterns
   */
  private cleanEventTitle(rawName: string): string {
    return rawName
      .replace(/(Sun|Mon|Tue|Wed|Thu|Fri|Sat)/gi, '')
      .replace(/\d{1,2}:\d{2}/g, '')
      .replace(/\s*&\s*/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/-\s*$/g, '')
      .trim();
  }

  /**
   * Sorts dates in chronological order
   */
  private sortedDates(dates: string[]): string[] {
    return dates.filter(d => d).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }

  /**
   * Aggregates price ranges across all instances of a grouped event
   */
  private aggregatePriceRange(
    groupId: string,
    allEvents: TicketmasterEvent[]
  ): { min: number; max: number; currency: string } {
    let minPrice = Number.POSITIVE_INFINITY;
    let maxPrice = 0;
    let currency = 'GBP';
    let foundPrice = false;

    allEvents.forEach((ev: TicketmasterEvent) => {
      const evName = this.cleanEventTitle(ev.name || 'Untitled Event').toLowerCase();
      const evVenue = (ev._embedded?.venues?.[0]?.name || 'Unknown').trim().toLowerCase();
      const evKey = `${evName}__${evVenue}`;

      if (evKey === groupId && ev.priceRanges && ev.priceRanges.length > 0) {
        ev.priceRanges.forEach(pr => {
          if (pr.min > 0) {
            minPrice = Math.min(minPrice, pr.min);
            foundPrice = true;
          }
          maxPrice = Math.max(maxPrice, pr.max);
          currency = pr.currency;
        });
      }
    });

    if (!foundPrice) minPrice = 0;

    return { min: minPrice, max: maxPrice, currency };
  }

  /**
   * Converts grouped event data to final Event array
   */
  private convertGroupedEventsToEvents(
    eventMap: Map<string, GroupedEventData>,
    allEvents: TicketmasterEvent[]
  ): Event[] {
    return Array.from(eventMap.values()).map(e => {
      const validDates = this.sortedDates(e.dates);
      const aggregatedPrice = this.aggregatePriceRange(e.id, allEvents);

      return {
        ...e,
        price: aggregatedPrice,
        date: validDates.length > 1
          ? `${validDates[0]} - ${validDates[validDates.length - 1]}`
          : (validDates[0] || ''),
        time: e.times.length > 1
          ? e.times.join(', ')
          : (e.times[0] || '')
      };
    });
  }

  /**
   * Generates a unique group ID for an event based on title and venue
   */
  generateGroupId(title: string, venue: string): string {
    const normalizedTitle = this.cleanEventTitle(title).toLowerCase();
    const normalizedVenue = venue.trim().toLowerCase();
    return `${normalizedTitle}__${normalizedVenue}`;
  }
}

export const eventGroupingService = new EventGroupingService();
