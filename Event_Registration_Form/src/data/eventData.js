export const COLLEGE_FEST_INFO = {
  universityName: 'Alliance University',
  festName: 'Alliance ONE 2026',
  tagline: 'Annual Inter-College Cultural, Technical & Management Mega Fest',
  dates: 'October 24 - 26, 2026',
  venue: 'Alliance University Main Campus, Chikkahagade Cross, Bengaluru',
  stats: {
    participants: '10,000+',
    colleges: '120+',
    eventsCount: '35+',
    prizePool: '₹15 Lakhs+'
  }
};

export const EVENT_TYPES = [
  {
    id: 'battle-of-bands',
    name: 'Battle of Bands & Pro-Night',
    category: 'Cultural',
    icon: 'Music',
    description: 'Rock out on the grand amphitheatre stage. Top bands battle for the ₹2,00,000 trophy.',
    basePriceMultiplier: 1.5,
    baseFee: 1200,
    teamType: 'Team (3 - 8 Members)',
    image: '/images/images (1).jpeg',
    popularAddons: ['Official Fest T-Shirt', 'VIP Pro-Night Front Row']
  },
  {
    id: 'hack-alliance',
    name: 'HackAlliance 24-Hour Hackathon',
    category: 'Technical',
    icon: 'Code',
    description: 'Overnight coding marathon to solve real-world AI, Web3 & FinTech challenges.',
    basePriceMultiplier: 1.2,
    baseFee: 800,
    teamType: 'Team (2 - 4 Members)',
    image: '/images/images.jpeg',
    popularAddons: ['High-Speed Wi-Fi Pass', 'Overnight Food & RedBull Pack']
  },
  {
    id: 'fashion-show',
    name: 'Vogue: National Fashion Show',
    category: 'Cultural',
    icon: 'Sparkles',
    description: 'High-fashion runway competition featuring theme-based couture and music sync.',
    basePriceMultiplier: 1.4,
    baseFee: 1500,
    teamType: 'Team (6 - 15 Members)',
    image: '/images/image1.webp',
    popularAddons: ['Green Room Access', 'Pro Photography Pack']
  },
  {
    id: 'esports',
    name: 'Esports Championship (Valorant & BGMI)',
    category: 'Gaming',
    icon: 'Gamepad2',
    description: 'LAN gaming showdown with live commentary, streaming, and pro gaming gear setups.',
    basePriceMultiplier: 1.0,
    baseFee: 600,
    teamType: 'Squad (4 - 5 Members)',
    image: '/images/download.jpeg',
    popularAddons: ['Pro Gaming Jersey', 'Energy Drink Pass']
  },
  {
    id: 'choreonite',
    name: 'Choreonite: Group Dance Battle',
    category: 'Cultural',
    icon: 'Flame',
    description: 'High-octane synchronization, western & classical group dance championship.',
    basePriceMultiplier: 1.3,
    baseFee: 1000,
    teamType: 'Group (8 - 20 Members)',
    image: '/images/images (2).jpeg',
    popularAddons: ['Stage Lighting Pack', 'Official Fest T-Shirt']
  },
  {
    id: 'robotics-workshop',
    name: 'AI & Autonomous Robotics Workshop',
    category: 'Workshops',
    icon: 'Cpu',
    description: 'Hands-on hardware & machine learning kit building session with industry experts.',
    basePriceMultiplier: 1.1,
    baseFee: 500,
    teamType: 'Solo / Duo',
    image: '/images/images.jpeg',
    popularAddons: ['Hardware Kit Takeaway', 'Certificate Hardcopy']
  }
];

export const VENUES = [
  {
    id: 'central-quad',
    name: 'Central Amphitheatre & Quadrangle',
    location: 'Main Block, Alliance Campus',
    city: 'Bengaluru',
    capacity: 3500,
    baseRent: 2500,
    rating: 4.95,
    reviewsCount: 340,
    image: '/images/image1.webp',
    features: ['360 Sound Stage', 'LED Wall Backdrop', 'Pro Stage Lighting', 'Open-Air Seating']
  },
  {
    id: 'main-auditorium',
    name: 'Alliance Grand Performing Auditorium',
    location: 'Academic Block B',
    city: 'Bengaluru',
    capacity: 1200,
    baseRent: 2000,
    rating: 4.9,
    reviewsCount: 280,
    image: '/images/images (2).jpeg',
    features: ['Central AC', 'Acoustic Wall Panels', 'Green Rooms', 'VIP Balcony']
  },
  {
    id: 'tech-park-hall',
    name: 'Tech & Innovation Convention Hall',
    location: 'School of Advanced Computing',
    city: 'Bengaluru',
    capacity: 600,
    baseRent: 1200,
    rating: 4.85,
    reviewsCount: 190,
    image: '/images/images.jpeg',
    features: ['Gigabit Wi-Fi', 'Dual 4K Projectors', 'Power Outlets at Each Desk', 'Robotics Ring']
  },
  {
    id: 'sports-complex',
    name: 'Alliance Athletic Complex & Arena',
    location: 'Sports Pavilion Grounds',
    city: 'Bengaluru',
    capacity: 5000,
    baseRent: 3000,
    rating: 4.8,
    reviewsCount: 150,
    image: '/images/download.jpeg',
    features: ['Floodlight Arena', 'Live Stream Control Room', 'LAN Rig Stations', 'Food Court Nearby']
  }
];

export const ADDONS = [
  {
    id: 'fest-tshirt',
    name: 'Official Alliance ONE 2026 Merchandise T-Shirt',
    flatPrice: 499,
    icon: 'Shirt',
    description: 'Limited edition high-quality cotton varsity t-shirt with official fest emblem.'
  },
  {
    id: 'food-pass',
    name: 'All-Day Campus Food & Beverage VIP Pass',
    flatPrice: 350,
    icon: 'Utensils',
    description: 'Unlimited access to gourmet food trucks, refreshment counters, and coffee stalls.'
  },
  {
    id: 'vip-pronight',
    name: 'VIP Pro-Night Concert Front-Row Pass',
    flatPrice: 599,
    icon: 'Sparkles',
    description: 'Exclusive front-of-stage VIP enclosure for the celebrity artist live concert.'
  },
  {
    id: 'certificate-hardcopy',
    name: 'Laminated Hardcopy Certificate & Souvenir Kit',
    flatPrice: 200,
    icon: 'Award',
    description: 'Official printed certificate signed by Vice-Chancellor & Fest Director with badge.'
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: 'ALLIANCE-ONE-9821',
    customerName: 'Ananya Hegde',
    phone: '+91 98450 11223',
    email: 'ananya.h@alliance.edu.in',
    collegeName: 'Alliance School of Computer Science',
    rollNumber: '1AL24CS042',
    address: 'Alliance University Student Housing, Block C, Bengaluru',
    eventType: 'hack-alliance',
    eventTypeName: 'HackAlliance 24-Hour Hackathon',
    venueId: 'tech-park-hall',
    venueName: 'Tech & Innovation Convention Hall',
    venueLocation: 'School of Advanced Computing',
    eventDate: '2026-10-24',
    startTime: '09:00',
    endTime: '09:00 (+1 Day)',
    guestCount: 4,
    selectedAddons: ['fest-tshirt', 'food-pass'],
    pricing: {
      baseRent: 1200,
      typeMultiplier: 1.2,
      guestSurcharge: 450,
      addonsTotal: 3396,
      subtotal: 5290,
      tax: 952,
      totalPrice: 6242
    },
    paymentMethod: 'online',
    paymentStatus: 'paid',
    transactionId: 'TXN-UPI-AL1-9821',
    bookingStatus: 'Confirmed',
    createdAt: '2026-08-19T10:00:00Z'
  }
];
