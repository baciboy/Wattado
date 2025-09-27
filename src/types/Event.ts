export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: {
    venue: string;
    city: string;
    state: string;
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  price: {
    min: number;
    max: number;
    currency: string;
  };
  category: string;
  platform: 'eventbrite' | 'ticketmaster' | 'stubhub' | 'seatgeek' | 'vivid-seats';
  image: string;
  url: string;
  availability: 'available' | 'low' | 'sold-out';
  rating?: number;
  attendees?: number;
  ticketmasterId?: string;
  genre?: string;
  subGenre?: string;
  promoter?: string;
}

export interface TicketmasterEvent {
  id: string;
  name: string;
  type: string;
  url: string;
  locale: string;
  images: Array<{
    ratio: string;
    url: string;
    width: number;
    height: number;
    fallback: boolean;
  }>;
  dates: {
    start: {
      localDate: string;
      localTime?: string;
      dateTime?: string;
    };
    timezone?: string;
    status: {
      code: string;
    };
  };
  classifications: Array<{
    primary: boolean;
    segment: {
      id: string;
      name: string;
    };
    genre: {
      id: string;
      name: string;
    };
    subGenre?: {
      id: string;
      name: string;
    };
  }>;
  promoter?: {
    id: string;
    name: string;
  };
  priceRanges?: Array<{
    type: string;
    currency: string;
    min: number;
    max: number;
  }>;
  _embedded?: {
    venues: Array<{
      id: string;
      name: string;
      type: string;
      url?: string;
      locale?: string;
      timezone?: string;
      city: {
        name: string;
      };
      state: {
        name: string;
        stateCode: string;
      };
      country: {
        name: string;
        countryCode: string;
      };
      address: {
        line1?: string;
        line2?: string;
      };
      location?: {
        longitude: string;
        latitude: string;
      };
    }>;
  };
}

export interface TicketmasterResponse {
  _embedded?: {
    events: TicketmasterEvent[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}
export interface FilterState {
  search: string;
  dateRange: {
    start: string;
    end: string;
  };
  location: string;
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  platforms: string[];
  availability: string[];
}