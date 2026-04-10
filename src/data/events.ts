// ─────────────────────────────────────────────────────────────
// Events data
// TODO: Replace with backend query when CMS/DB is ready:
//   import { db } from '../lib/db';
//   export const getEvents = () => db.events.findMany({ orderBy: { dateISO: 'asc' } });
// ─────────────────────────────────────────────────────────────

export interface EventFeature {
  number: string;
  title: string;
  description: string;
}

export interface Event {
  slug: string;
  title: string;
  eyebrow: string;
  subtitle: string;
  date: string;
  dateISO: string;
  month: string;
  day: string;
  year: string;
  venue: string;
  address: string;
  location: string;
  format: string;
  pricingIndividual: string;
  pricingFoursome: string;
  image: string;
  imageAlt: string;
  registrationUrl: string;
  featured: boolean;
  status: 'upcoming' | 'past';
  description: string;
  fullDescription: string;
  features: EventFeature[];
}

export const events: Event[] = [
  {
    slug: 'golf-classic',
    title: 'First Inaugural Golf Classic',
    eyebrow: 'May 28, 2026',
    subtitle: 'A day of golf, community, and giving at Eagle Vines Vineyards & Golf Club.',
    date: 'Thursday, May 28, 2026',
    dateISO: '2026-05-28',
    month: 'May',
    day: '28',
    year: '2026',
    venue: 'Eagle Vines Vineyards & Golf Club',
    address: '580 S Kelly Rd, American Canyon, CA 94503',
    location: 'American Canyon, CA',
    format: 'Four Person Scramble',
    pricingIndividual: '$225',
    pricingFoursome: '$900',
    image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=1920&q=80',
    imageAlt: 'Eagle Vines Golf Club',
    registrationUrl: 'https://events.golfstatus.com/event/TheRippleEffect',
    featured: true,
    status: 'upcoming',
    description:
      'Join us for the First Inaugural Golf Classic in support of The Ripple Effect of Life. A four-person scramble tournament at Eagle Vines Vineyards & Golf Club with proceeds funding scholarships and community programs.',
    fullDescription:
      "Proceeds from the First Inaugural Golf Classic support The Ripple Effect of Life foundation's mission, funding scholarships for Benicia High School seniors and honoring the legacy of James Baldwin. Every player and sponsor becomes part of something bigger. Together, we create ripples of impact that extend well beyond the course.",
    features: [
      {
        number: '01',
        title: 'Premier Course',
        description: '18 holes on a championship course designed for competitive and social play alike.',
      },
      {
        number: '02',
        title: 'Scramble Format',
        description: 'Four-person teams make golf accessible and enjoyable for all skill levels.',
      },
      {
        number: '03',
        title: 'On-Course Contests',
        description: 'Competitions and games throughout the course with opportunities to win prizes.',
      },
      {
        number: '04',
        title: 'Post-Tournament Celebration',
        description: 'A reception with food, drinks, and raffle drawings to close out the day.',
      },
    ],
  },
];

export function getEventBySlug(slug: string): Event | undefined {
  return events.find((e) => e.slug === slug);
}

export function getFeaturedEvent(): Event | undefined {
  return events.find((e) => e.featured && e.status === 'upcoming');
}

export function getUpcomingEvents(): Event[] {
  return events
    .filter((e) => e.status === 'upcoming')
    .sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime());
}

export function getPastEvents(): Event[] {
  return events
    .filter((e) => e.status === 'past')
    .sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime());
}
