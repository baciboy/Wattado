import { Event, TicketmasterEvent, TicketmasterResponse } from '../types/Event';

const API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY;

export interface TicketmasterSearchParams {
  keyword?: string;
  city?: string;
  stateCode?: string;
  countryCode?: string;
  startDateTime?: string;
  endDateTime?: string;
  classificationName?: string;
  size?: number;
  page?: number;
  sort?: 'date,asc' | 'date,desc' | 'relevance,desc' | 'distance,asc' | 'name,asc' | 'name,desc' | 'random';
}

class TicketmasterService {
  private apiKey: string;

  constructor() {
    this.apiKey = API_KEY;

    // Validate API key in development
    if (import.meta.env.DEV && !this.apiKey) {
      console.error(
        'Ticketmaster API key is not configured. ' +
        'Please add VITE_TICKETMASTER_API_KEY to your .env file. ' +
        'Event fetching will not work until this is configured.'
      );
    }
  }

  async searchEvents(params: TicketmasterSearchParams = {}): Promise<Event[]> {
    if (!this.apiKey) {
      console.error('Ticketmaster API key is required');
      return [];
    }

    try {
      // Format date to Ticketmaster's required format: YYYY-MM-DDTHH:mm:ssZ
      const formatDate = (date: Date): string => {
        return date.toISOString().split('.')[0] + 'Z';
      };

      // Always set startDateTime to now to filter out past events
      const now = formatDate(new Date());
      
      const searchParams = new URLSearchParams({
        apikey: this.apiKey,
        size: (params.size || 50).toString(),
        page: (params.page || 0).toString(),
        sort: params.sort || 'date,asc',
        countryCode: params.countryCode || 'US',
        startDateTime: params.startDateTime ? formatDate(new Date(params.startDateTime)) : now, // Default to current time
        ...params.keyword && { keyword: params.keyword },
        ...params.city && { city: params.city },
        ...params.stateCode && { stateCode: params.stateCode },
        ...params.endDateTime && { endDateTime: params.endDateTime },
        ...params.classificationName && { classificationName: params.classificationName },
      });

      // Dev uses Vite proxy; production calls Ticketmaster directly
      const base = import.meta.env.PROD
        ? 'https://app.ticketmaster.com'
        : '';
      const url = `${base}/discovery/v2/events.json?${searchParams}`;
      console.log('Fetching events from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ticketmaster API error response:', errorText);
        throw new Error(`Ticketmaster API error: ${response.status} ${response.statusText}`);
      }

      const data: TicketmasterResponse = await response.json();
      console.log('Ticketmaster API response:', data);
      
      if (!data._embedded?.events) {
        console.log('No events found in response');
        return [];
      }

      const mappedEvents = data._embedded.events.map(this.mapTicketmasterEventToEvent);
      console.log('Mapped events:', mappedEvents);
      return mappedEvents;
    } catch (error) {
      console.error('Error fetching events from Ticketmaster:', error);
      return [];
    }
  }

  // Return aggregated events (multi-date grouped into a single card)
  async searchGroupedEvents(params: TicketmasterSearchParams = {}): Promise<Event[]> {
    const baseParams: TicketmasterSearchParams = {
      size: 200,
      sort: 'date,asc',
      countryCode: params.countryCode || 'GB',
      ...params
    };

    // Fetch raw Ticketmaster data first (as TicketmasterEvent[])
    const apiKey = this.apiKey;
    if (!apiKey) return [];

    const formatDate = (date: Date): string => date.toISOString().split('.')[0] + 'Z';
    const now = formatDate(new Date());
    const searchParams = new URLSearchParams({
      apikey: apiKey,
      size: String(baseParams.size || 200),
      page: String(baseParams.page || 0),
      sort: baseParams.sort || 'date,asc',
      countryCode: baseParams.countryCode || 'GB',
      startDateTime: baseParams.startDateTime ? formatDate(new Date(baseParams.startDateTime)) : now,
      ...baseParams.keyword && { keyword: baseParams.keyword },
      ...baseParams.city && { city: baseParams.city },
      ...baseParams.stateCode && { stateCode: baseParams.stateCode },
      ...baseParams.endDateTime && { endDateTime: baseParams.endDateTime },
      ...baseParams.classificationName && { classificationName: baseParams.classificationName },
    });

    const base = import.meta.env.PROD ? 'https://app.ticketmaster.com' : '';
    const url = `${base}/discovery/v2/events.json?${searchParams}`;
    const response = await fetch(url);
    if (!response.ok) return [];
    const data: TicketmasterResponse = await response.json();
    const tmEvents = data._embedded?.events || [];

    // Grouping by normalized title + venue
    const eventMap = new Map<string, {
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
    }>();

    const cleanName = (raw: string) => raw
      .replace(/(Sun|Mon|Tue|Wed|Thu|Fri|Sat)/gi, '')
      .replace(/\d{1,2}:\d{2}/g, '')
      .replace(/\s*&\s*/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/-\s*$/g, '')
      .trim();

    tmEvents.forEach((e: TicketmasterEvent) => {
      const rawName = e.name || 'Untitled Event';
      const cleanTitle = cleanName(rawName);
      const normalizedName = cleanTitle.toLowerCase();
      const venueName = (e._embedded?.venues?.[0]?.name || 'Unknown').trim().toLowerCase();
      const key = `${normalizedName}__${venueName}`;
      const date = e.dates?.start?.localDate || '';
      const time = e.dates?.start?.localTime || '';

      if (eventMap.has(key)) {
        const grouped = eventMap.get(key)!;
        if (date && !grouped.dates.includes(date)) grouped.dates.push(date);
        if (time && !grouped.times.includes(time)) grouped.times.push(time);
      } else {
        const mapped = this.mapTicketmasterEventToEvent(e);
        eventMap.set(key, {
          id: key,
          title: cleanTitle,
          description: mapped.description || '',
          location: mapped.location,
          price: mapped.price,
          category: mapped.category,
          platform: mapped.platform,
          image: mapped.image,
          url: mapped.url,
          availability: mapped.availability,
          rating: mapped.rating,
          attendees: mapped.attendees,
          ticketmasterId: mapped.ticketmasterId,
          genre: mapped.genre,
          subGenre: mapped.subGenre,
          promoter: mapped.promoter,
          dates: date ? [date] : [],
          times: time ? [time] : []
        });
      }
    });

    // Aggregate price and produce final Event[]
    const sortedDates = (dates: string[]) => dates.filter(Boolean).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const groupedEvents: Event[] = Array.from(eventMap.values()).map(g => {
      // Aggregate min/max across matching tmEvents
      let minPrice = Number.POSITIVE_INFINITY;
      let maxPrice = 0;
      let currency = g.price.currency;
      let foundPrice = false;
      tmEvents.forEach(ev => {
        const nameKey = cleanName(ev.name || '').toLowerCase();
        const venueKey = (ev._embedded?.venues?.[0]?.name || 'Unknown').trim().toLowerCase();
        const evKey = `${nameKey}__${venueKey}`;
        if (evKey === g.id && ev.priceRanges && ev.priceRanges.length > 0) {
          ev.priceRanges.forEach(pr => {
            if (typeof pr.min === 'number' && pr.min > 0) {
              minPrice = Math.min(minPrice, pr.min);
              foundPrice = true;
            }
            if (typeof pr.max === 'number') {
              maxPrice = Math.max(maxPrice, pr.max);
            }
            if (pr.currency) currency = pr.currency;
          });
        }
      });
      if (!foundPrice) minPrice = 0;
      const validDates = sortedDates(g.dates);
      const dateStr = validDates.length > 1
        ? `${validDates[0]} - ${validDates[validDates.length - 1]}`
        : (validDates[0] || '');
      const timeStr = g.times.length > 1 ? g.times.join(', ') : (g.times[0] || '');
      return {
        id: g.id,
        title: g.title,
        description: g.description,
        date: dateStr,
        time: timeStr,
        location: g.location,
        price: { min: minPrice, max: maxPrice, currency },
        category: g.category,
        platform: g.platform,
        image: g.image,
        url: g.url,
        availability: g.availability,
        rating: g.rating,
        attendees: g.attendees,
        ticketmasterId: g.ticketmasterId,
        genre: g.genre,
        subGenre: g.subGenre,
        promoter: g.promoter
      };
    });

    return groupedEvents;
  }

  private mapTicketmasterEventToEvent = (tmEvent: TicketmasterEvent): Event => {
    // Get the best quality image
    const getBestImage = (images: TicketmasterEvent['images']) => {
      if (!images || images.length === 0) {
        return 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800';
      }
      
      // Sort images by width to get the highest quality ones first
      const sortedImages = [...images].sort((a, b) => b.width - a.width);
      
      // First try to find a 16:9 ratio image with width >= 800
      const preferredImage = sortedImages.find(img => 
        img.ratio === '16_9' && img.width >= 800
      );
      
      if (preferredImage) return preferredImage.url;
      
      // Next, try to find any image with width >= 800
      const largeImage = sortedImages.find(img => img.width >= 800);
      if (largeImage) return largeImage.url;
      
      // Finally, use the largest available image
      return sortedImages[0].url;
    };

    // Extract venue information
    const venue = tmEvent._embedded?.venues?.[0];
    const location = {
      venue: venue?.name || 'Venue TBA',
      city: venue?.city?.name || 'City TBA',
      state: venue?.state?.stateCode || venue?.state?.name || 'State TBA',
      address: venue?.address?.line1 || 'Address TBA',
      coordinates: venue?.location ? {
        latitude: parseFloat(venue.location.latitude),
        longitude: parseFloat(venue.location.longitude)
      } : undefined
    };

    // Extract price information
    const priceRange = tmEvent.priceRanges?.[0];
    const price = {
      min: priceRange?.min || 0,
      max: priceRange?.max || 0,
      currency: priceRange?.currency || 'USD'
    };

    // Extract classification (category)
    const classification = tmEvent.classifications?.[0];
    const category = classification?.segment?.name || classification?.genre?.name || 'General';

    // Extract date and time
    const startDate = tmEvent.dates.start;
    const date = startDate.localDate;
    const time = startDate.localTime || '20:00'; // Default to 8 PM if no time specified

    // Determine availability based on status and sales dates
    const getAvailability = (tmEvent: TicketmasterEvent): 'available' | 'low' | 'sold-out' => {
      const status = tmEvent.dates.status?.code?.toLowerCase() || '';
      
      // Check if event is cancelled or postponed
      if (['cancelled', 'postponed'].includes(status)) {
        return 'sold-out';
      }
      
      // Check ticket status
      switch (status) {
        case 'onsale':
          return 'available';
        case 'offsale':
          return 'sold-out';
        case 'presale':
        case 'limited':
          return 'low';
        default:
          return 'available';
      }
    };

    // Generate description
    const description = this.generateDescription(tmEvent);

    return {
      id: tmEvent.id,
      title: tmEvent.name,
      description,
      date,
      time,
      location,
      price,
      category,
      platform: 'ticketmaster',
      image: getBestImage(tmEvent.images),
      url: tmEvent.url,
      availability: getAvailability(tmEvent),
      ticketmasterId: tmEvent.id,
      genre: classification?.genre?.name,
      subGenre: classification?.subGenre?.name,
      promoter: tmEvent.promoter?.name
    };
  };

  private generateDescription(tmEvent: TicketmasterEvent): string {
    const venue = tmEvent._embedded?.venues?.[0];
    const classification = tmEvent.classifications?.[0];
    const genre = classification?.genre?.name;
    const subGenre = classification?.subGenre?.name;
    const segment = classification?.segment?.name;
    
    let description = `Experience ${tmEvent.name}`;
    
    // Add venue information
    if (venue) {
      description += ` at ${venue.name}`;
      if (venue.city?.name) {
        description += ` in ${venue.city.name}`;
        if (venue.state?.stateCode) {
          description += `, ${venue.state.stateCode}`;
        }
      }
    }
    
    description += '.';

    // Add genre information
    if (segment && genre) {
      if (segment.toLowerCase() !== genre.toLowerCase()) {
        description += ` This ${segment.toLowerCase()} event features ${genre.toLowerCase()}`;
        if (subGenre && subGenre.toLowerCase() !== genre.toLowerCase()) {
          description += ` with ${subGenre.toLowerCase()}`;
        }
        description += '.';
      } else if (genre) {
        description += ` Don't miss this incredible ${genre.toLowerCase()} event.`;
      }
    }

    // Add price information if available
    const priceRange = tmEvent.priceRanges?.[0];
    if (priceRange) {
      if (priceRange.min === priceRange.max) {
        description += ` Tickets are ${priceRange.currency} ${priceRange.min.toFixed(2)}.`;
      } else {
        description += ` Tickets range from ${priceRange.currency} ${priceRange.min.toFixed(2)} to ${priceRange.currency} ${priceRange.max.toFixed(2)}.`;
      }
    }

    // Add promoter information
    if (tmEvent.promoter?.name) {
      description += ` Presented by ${tmEvent.promoter.name}.`;
    }

    return description;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('.')[0] + 'Z';
  }

  // Helper methods for specific queries
  async getEventsByLocation(city: string, stateCode?: string): Promise<Event[]> {
    return this.searchEvents({ 
      city, 
      stateCode,
      startDateTime: this.formatDate(new Date()) // Only future events
    });
  }

  async getEventsByKeyword(keyword: string): Promise<Event[]> {
    return this.searchEvents({ 
      keyword,
      startDateTime: this.formatDate(new Date()) // Only future events
    });
  }

  async getEventsByDateRange(startDate: string, endDate: string): Promise<Event[]> {
    // If start date is in the past, use current date instead
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Set to end of day

    const startDateTime = start < now ? this.formatDate(now) : this.formatDate(start);
    const endDateTime = this.formatDate(end);

    return this.searchEvents({ 
      startDateTime,
      endDateTime
    });
  }

  async getEventsByCategory(category: string): Promise<Event[]> {
    return this.searchEvents({ 
      classificationName: category,
      startDateTime: this.formatDate(new Date()) // Only future events
    });
  }
}

export const ticketmasterService = new TicketmasterService();