import { Event } from '../types/Event';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Taylor Swift | The Eras Tour',
    description: 'Experience the musical journey through all of Taylor Swift\'s iconic eras in this spectacular concert experience.',
    date: '2025-11-15',
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
    date: '2025-11-20',
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
    date: '2025-11-22',
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
    date: '2025-11-25',
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
    date: '2025-11-18',
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
    date: '2025-11-28',
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
    date: '2025-11-30',
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
    date: '2025-12-02',
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
  },
  {
    id: '9',
    title: 'Jazz Under the Stars - Romantic Evening',
    description: 'Intimate jazz performance in a candlelit setting. Perfect for date night with wine and light bites.',
    date: '2025-12-05',
    time: '19:30',
    location: {
      venue: 'Blue Note Jazz Club',
      city: 'New York',
      state: 'NY',
      address: '131 W 3rd St, New York, NY 10012'
    },
    price: { min: 35, max: 85, currency: 'USD' },
    category: 'Music',
    platform: 'ticketmaster',
    image: 'https://images.pexels.com/photos/1387037/pexels-photo-1387037.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '#',
    availability: 'available',
    rating: 4.7,
    attendees: 250
  },
  {
    id: '10',
    title: 'Kids Science Discovery Day',
    description: 'Interactive science exhibits, hands-on experiments, and live demonstrations for children aged 5-12.',
    date: '2025-12-06',
    time: '10:00',
    location: {
      venue: 'Boston Science Museum',
      city: 'Boston',
      state: 'MA',
      address: '1 Science Park, Boston, MA 02114'
    },
    price: { min: 15, max: 25, currency: 'USD' },
    category: 'Family',
    platform: 'eventbrite',
    image: 'https://images.pexels.com/photos/8500189/pexels-photo-8500189.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '#',
    availability: 'available',
    rating: 4.8,
    attendees: 1500
  },
  {
    id: '11',
    title: 'Underground Electronic Music Festival',
    description: 'High-energy techno and house music all night long with world-renowned DJs.',
    date: '2025-12-07',
    time: '22:00',
    location: {
      venue: 'Warehouse District',
      city: 'Brooklyn',
      state: 'NY',
      address: '123 Kent Ave, Brooklyn, NY 11249'
    },
    price: { min: 45, max: 120, currency: 'USD' },
    category: 'Music',
    platform: 'ticketmaster',
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '#',
    availability: 'available',
    rating: 4.6,
    attendees: 3000
  },
  {
    id: '12',
    title: 'Yoga & Meditation Wellness Retreat',
    description: 'Peaceful morning session focused on mindfulness, relaxation, and inner balance.',
    date: '2025-12-08',
    time: '08:00',
    location: {
      venue: 'Central Park Conservatory',
      city: 'New York',
      state: 'NY',
      address: 'Central Park West, New York, NY 10024'
    },
    price: { min: 20, max: 40, currency: 'USD' },
    category: 'Miscellaneous',
    platform: 'eventbrite',
    image: 'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '#',
    availability: 'available',
    rating: 4.9,
    attendees: 150
  },
  {
    id: '13',
    title: 'Premier League: Chelsea vs Arsenal',
    description: 'Witness the fierce London derby rivalry in this unmissable Premier League clash.',
    date: '2025-12-10',
    time: '17:30',
    location: {
      venue: 'Stamford Bridge',
      city: 'London',
      state: 'UK',
      address: 'Fulham Rd, London SW6 1HS, UK'
    },
    price: { min: 75, max: 350, currency: 'GBP' },
    category: 'Sports',
    platform: 'stubhub',
    image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '#',
    availability: 'low',
    rating: 4.9,
    attendees: 40000
  },
  {
    id: '14',
    title: 'Fashion Week After Party - VIP Experience',
    description: 'Exclusive, stylish evening with fashion industry elites, champagne, and runway highlights.',
    date: '2025-12-12',
    time: '21:00',
    location: {
      venue: 'The Plaza Hotel',
      city: 'New York',
      state: 'NY',
      address: '768 5th Ave, New York, NY 10019'
    },
    price: { min: 200, max: 500, currency: 'USD' },
    category: 'Miscellaneous',
    platform: 'vivid-seats',
    image: 'https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '#',
    availability: 'low',
    rating: 4.7,
    attendees: 300
  },
  {
    id: '15',
    title: 'Indie Film Festival Screening',
    description: 'Curated selection of award-winning independent films from emerging filmmakers worldwide.',
    date: '2025-12-13',
    time: '18:00',
    location: {
      venue: 'Sundance Cinema',
      city: 'San Francisco',
      state: 'CA',
      address: '245 Castro St, San Francisco, CA 94114'
    },
    price: { min: 15, max: 30, currency: 'USD' },
    category: 'Film',
    platform: 'eventbrite',
    image: 'https://images.pexels.com/photos/7991319/pexels-photo-7991319.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '#',
    availability: 'available',
    rating: 4.5,
    attendees: 400
  },
  {
    id: '16',
    title: 'Classical Symphony Orchestra - Beethoven Night',
    description: 'Elegant evening of classical masterpieces performed by world-class musicians.',
    date: '2025-12-15',
    time: '20:00',
    location: {
      venue: 'Carnegie Hall',
      city: 'New York',
      state: 'NY',
      address: '881 7th Ave, New York, NY 10019'
    },
    price: { min: 60, max: 250, currency: 'USD' },
    category: 'Music',
    platform: 'ticketmaster',
    image: 'https://images.pexels.com/photos/210887/pexels-photo-210887.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '#',
    availability: 'available',
    rating: 4.9,
    attendees: 2800
  },
  {
    id: '17',
    title: 'Street Food Market & Live Music',
    description: 'Fun outdoor festival with diverse food vendors, craft beer, and live bands.',
    date: '2025-12-17',
    time: '12:00',
    location: {
      venue: 'Smorgasburg',
      city: 'Brooklyn',
      state: 'NY',
      address: '90 Kent Ave, Brooklyn, NY 11249'
    },
    price: { min: 0, max: 15, currency: 'USD' },
    category: 'Food & Drink',
    platform: 'eventbrite',
    image: 'https://images.pexels.com/photos/2291599/pexels-photo-2291599.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '#',
    availability: 'available',
    rating: 4.6,
    attendees: 5000
  },
  {
    id: '18',
    title: 'Contemporary Art Gallery Opening',
    description: 'Chic gallery opening featuring modern artists, wine reception, and curator talk.',
    date: '2025-12-18',
    time: '19:00',
    location: {
      venue: 'Gagosian Gallery',
      city: 'New York',
      state: 'NY',
      address: '980 Madison Ave, New York, NY 10075'
    },
    price: { min: 0, max: 0, currency: 'USD' },
    category: 'Arts & Theatre',
    platform: 'eventbrite',
    image: 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '#',
    availability: 'available',
    rating: 4.7,
    attendees: 200
  },
  {
    id: '19',
    title: 'Family Fun Fair & Carnival',
    description: 'Classic carnival games, rides, cotton candy, and entertainment for all ages.',
    date: '2025-12-20',
    time: '11:00',
    location: {
      venue: 'Brooklyn Bridge Park',
      city: 'Brooklyn',
      state: 'NY',
      address: '334 Furman St, Brooklyn, NY 11201'
    },
    price: { min: 10, max: 30, currency: 'USD' },
    category: 'Family',
    platform: 'eventbrite',
    image: 'https://images.pexels.com/photos/1157557/pexels-photo-1157557.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '#',
    availability: 'available',
    rating: 4.5,
    attendees: 3500
  },
  {
    id: '20',
    title: 'Rooftop Wine Tasting Experience',
    description: 'Romantic sunset wine tasting with panoramic city views and artisan cheese pairings.',
    date: '2025-12-22',
    time: '18:30',
    location: {
      venue: '230 Fifth Rooftop Bar',
      city: 'New York',
      state: 'NY',
      address: '230 Fifth Ave, New York, NY 10001'
    },
    price: { min: 55, max: 95, currency: 'USD' },
    category: 'Food & Drink',
    platform: 'eventbrite',
    image: 'https://images.pexels.com/photos/1123260/pexels-photo-1123260.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '#',
    availability: 'available',
    rating: 4.8,
    attendees: 80
  },
  {
    id: '21',
    title: 'Rock Concert: Foo Fighters Live',
    description: 'High-energy rock concert with legendary performances and unforgettable atmosphere.',
    date: '2025-12-24',
    time: '20:00',
    location: {
      venue: 'Madison Square Garden',
      city: 'New York',
      state: 'NY',
      address: '4 Pennsylvania Plaza, New York, NY 10001'
    },
    price: { min: 95, max: 450, currency: 'USD' },
    category: 'Music',
    platform: 'ticketmaster',
    image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '#',
    availability: 'low',
    rating: 4.9,
    attendees: 20000
  },
  {
    id: '22',
    title: 'Michelin Star Chef Dinner Experience',
    description: 'Elegant 7-course tasting menu crafted by award-winning chef with wine pairings.',
    date: '2025-12-26',
    time: '19:00',
    location: {
      venue: 'Eleven Madison Park',
      city: 'New York',
      state: 'NY',
      address: '11 Madison Ave, New York, NY 10010'
    },
    price: { min: 350, max: 500, currency: 'USD' },
    category: 'Food & Drink',
    platform: 'eventbrite',
    image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '#',
    availability: 'low',
    rating: 5.0,
    attendees: 60
  },
  {
    id: '23',
    title: 'Cultural Dance Performance: Alvin Ailey',
    description: 'Stunning contemporary dance celebrating African-American cultural heritage and artistry.',
    date: '2025-12-27',
    time: '19:30',
    location: {
      venue: 'New York City Center',
      city: 'New York',
      state: 'NY',
      address: '131 W 55th St, New York, NY 10019'
    },
    price: { min: 45, max: 150, currency: 'USD' },
    category: 'Arts & Theatre',
    platform: 'ticketmaster',
    image: 'https://images.pexels.com/photos/3335379/pexels-photo-3335379.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '#',
    availability: 'available',
    rating: 4.9,
    attendees: 2200
  },
  {
    id: '24',
    title: 'Craft Beer Festival',
    description: 'Sample over 100 craft beers from local and international breweries with food trucks.',
    date: '2025-12-28',
    time: '14:00',
    location: {
      venue: 'Pier 17',
      city: 'New York',
      state: 'NY',
      address: '89 South St, New York, NY 10038'
    },
    price: { min: 40, max: 75, currency: 'USD' },
    category: 'Food & Drink',
    platform: 'eventbrite',
    image: 'https://images.pexels.com/photos/1089932/pexels-photo-1089932.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '#',
    availability: 'available',
    rating: 4.5,
    attendees: 2000
  },
  {
    id: '25',
    title: 'Comedy Improv Show - Upright Citizens Brigade',
    description: 'Hilarious, fun improv comedy with audience participation and unpredictable laughs.',
    date: '2025-12-29',
    time: '20:00',
    location: {
      venue: 'UCB Theatre',
      city: 'New York',
      state: 'NY',
      address: '307 W 26th St, New York, NY 10001'
    },
    price: { min: 10, max: 25, currency: 'USD' },
    category: 'Comedy',
    platform: 'eventbrite',
    image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '#',
    availability: 'available',
    rating: 4.7,
    attendees: 150
  },
  {
    id: '26',
    title: 'Spa & Wellness Day Retreat',
    description: 'Relaxing full-day experience with massage, facials, meditation, and healthy lunch.',
    date: '2025-12-30',
    time: '09:00',
    location: {
      venue: 'Aire Ancient Baths',
      city: 'New York',
      state: 'NY',
      address: '88 Franklin St, New York, NY 10013'
    },
    price: { min: 150, max: 300, currency: 'USD' },
    category: 'Miscellaneous',
    platform: 'eventbrite',
    image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '#',
    availability: 'available',
    rating: 4.8,
    attendees: 50
  },
  {
    id: '27',
    title: 'Shakespeare in the Park: Romeo & Juliet',
    description: 'Classic romantic tale performed outdoors under the stars in Central Park.',
    date: '2026-01-02',
    time: '19:00',
    location: {
      venue: 'Delacorte Theater',
      city: 'New York',
      state: 'NY',
      address: 'Central Park West, New York, NY 10024'
    },
    price: { min: 0, max: 0, currency: 'USD' },
    category: 'Arts & Theatre',
    platform: 'eventbrite',
    image: 'https://images.pexels.com/photos/109669/pexels-photo-109669.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '#',
    availability: 'available',
    rating: 4.9,
    attendees: 1800
  },
  {
    id: '28',
    title: 'EDM Festival: Electric Daisy',
    description: 'Massive energetic electronic dance music festival with top DJs and spectacular stage production.',
    date: '2026-01-05',
    time: '18:00',
    location: {
      venue: 'Citi Field',
      city: 'New York',
      state: 'NY',
      address: '41 Seaver Way, Queens, NY 11368'
    },
    price: { min: 120, max: 400, currency: 'USD' },
    category: 'Music',
    platform: 'ticketmaster',
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '#',
    availability: 'available',
    rating: 4.8,
    attendees: 40000
  },
  {
    id: '29',
    title: 'Children\'s Museum Adventure Day',
    description: 'Interactive exhibits, storytelling, arts & crafts activities for young children and families.',
    date: '2026-01-07',
    time: '10:00',
    location: {
      venue: 'Brooklyn Children\'s Museum',
      city: 'Brooklyn',
      state: 'NY',
      address: '145 Brooklyn Ave, Brooklyn, NY 11213'
    },
    price: { min: 12, max: 18, currency: 'USD' },
    category: 'Family',
    platform: 'eventbrite',
    image: 'https://images.pexels.com/photos/8500189/pexels-photo-8500189.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '#',
    availability: 'available',
    rating: 4.7,
    attendees: 800
  },
  {
    id: '30',
    title: 'Opera: La Bohème at the Met',
    description: 'Elegant and emotional Puccini masterpiece with world-renowned opera singers.',
    date: '2026-01-10',
    time: '19:30',
    location: {
      venue: 'Metropolitan Opera House',
      city: 'New York',
      state: 'NY',
      address: 'Lincoln Center, New York, NY 10023'
    },
    price: { min: 85, max: 450, currency: 'USD' },
    category: 'Arts & Theatre',
    platform: 'ticketmaster',
    image: 'https://images.pexels.com/photos/210887/pexels-photo-210887.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '#',
    availability: 'available',
    rating: 4.9,
    attendees: 3800
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