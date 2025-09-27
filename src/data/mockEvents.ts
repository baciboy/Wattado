import { Event } from '../types/Event';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Taylor Swift | The Eras Tour',
    description: 'Experience the musical journey through all of Taylor Swift\'s iconic eras in this spectacular concert experience.',
    date: '2024-03-15',
    time: '20:00',
    location: {
      venue: 'MetLife Stadium',
      city: 'East Rutherford',
      state: 'NJ',
      address: '1 MetLife Stadium Dr, East Rutherford, NJ 07073'
    },
    price: { min: 89, max: 599, currency: 'USD' },
    category: 'Music',
    platform: 'ticketmaster',
    image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '#',
    availability: 'low',
    rating: 4.9,
    attendees: 82547
  },
  {
    id: '2',
    title: 'Tech Innovation Summit 2024',
    description: 'Join industry leaders and innovators for a day of groundbreaking discussions on the future of technology.',
    date: '2024-03-20',
    time: '09:00',
    location: {
      venue: 'Moscone Center',
      city: 'San Francisco',
      state: 'CA',
      address: '747 Howard St, San Francisco, CA 94103'
    },
    price: { min: 299, max: 799, currency: 'USD' },
    category: 'Technology',
    platform: 'eventbrite',
    image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '#',
    availability: 'available',
    rating: 4.7,
    attendees: 3200
  },
  {
    id: '3',
    title: 'Brooklyn Food & Wine Festival',
    description: 'Celebrate Brooklyn\'s vibrant culinary scene with tastings from top restaurants and wineries.',
    date: '2024-03-22',
    time: '12:00',
    location: {
      venue: 'Brooklyn Bridge Park',
      city: 'Brooklyn',
      state: 'NY',
      address: '334 Furman St, Brooklyn, NY 11201'
    },
    price: { min: 45, max: 125, currency: 'USD' },
    category: 'Food & Drink',
    platform: 'stubhub',
    image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '#',
    availability: 'available',
    rating: 4.5,
    attendees: 8500
  },
  {
    id: '4',
    title: 'NBA Finals Game 7',
    description: 'The ultimate showdown! Don\'t miss the thrilling conclusion of this year\'s NBA championship.',
    date: '2024-03-25',
    time: '21:00',
    location: {
      venue: 'Madison Square Garden',
      city: 'New York',
      state: 'NY',
      address: '4 Pennsylvania Plaza, New York, NY 10001'
    },
    price: { min: 250, max: 2500, currency: 'USD' },
    category: 'Sports',
    platform: 'seatgeek',
    image: 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '#',
    availability: 'low',
    rating: 4.8,
    attendees: 20000
  },
  {
    id: '5',
    title: 'Hamilton - Broadway Musical',
    description: 'The revolutionary musical that tells the story of America\'s founding fathers through hip-hop and R&B.',
    date: '2024-03-18',
    time: '19:30',
    location: {
      venue: 'Richard Rodgers Theatre',
      city: 'New York',
      state: 'NY',
      address: '226 W 46th St, New York, NY 10036'
    },
    price: { min: 79, max: 349, currency: 'USD' },
    category: 'Theater',
    platform: 'vivid-seats',
    image: 'https://images.pexels.com/photos/109669/pexels-photo-109669.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '#',
    availability: 'available',
    rating: 4.9,
    attendees: 1321
  },
  {
    id: '6',
    title: 'Modern Art Exhibition: "Digital Renaissance"',
    description: 'Explore the intersection of technology and traditional art in this groundbreaking exhibition.',
    date: '2024-03-28',
    time: '10:00',
    location: {
      venue: 'Museum of Modern Art',
      city: 'New York',
      state: 'NY',
      address: '11 W 53rd St, New York, NY 10019'
    },
    price: { min: 25, max: 35, currency: 'USD' },
    category: 'Art & Culture',
    platform: 'eventbrite',
    image: 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '#',
    availability: 'available',
    rating: 4.6,
    attendees: 2100
  },
  {
    id: '7',
    title: 'Stand-Up Comedy Night: Dave Chappelle',
    description: 'An evening of laughter with one of the greatest comedians of our time.',
    date: '2024-03-30',
    time: '20:30',
    location: {
      venue: 'Comedy Cellar',
      city: 'New York',
      state: 'NY',
      address: '117 MacDougal St, New York, NY 10012'
    },
    price: { min: 65, max: 150, currency: 'USD' },
    category: 'Comedy',
    platform: 'ticketmaster',
    image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '#',
    availability: 'sold-out',
    rating: 4.8,
    attendees: 300
  },
  {
    id: '8',
    title: 'Startup Pitch Competition',
    description: 'Watch the next generation of entrepreneurs pitch their innovative ideas to top investors.',
    date: '2024-04-02',
    time: '18:00',
    location: {
      venue: 'TechHub Boston',
      city: 'Boston',
      state: 'MA',
      address: '1 Marina Park Dr, Boston, MA 02210'
    },
    price: { min: 0, max: 50, currency: 'USD' },
    category: 'Business',
    platform: 'eventbrite',
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '#',
    availability: 'available',
    rating: 4.4,
    attendees: 450
  }
];

export const categories = [
  'Music',
  'Sports',
  'Arts & Theatre',
  'Family',
  'Comedy',
  'Film',
  'Miscellaneous',
  'Food & Drink',
  'Business',
  'Technology'
];
export const platforms = ['eventbrite', 'ticketmaster', 'stubhub', 'seatgeek', 'vivid-seats'];