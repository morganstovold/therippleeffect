// ─────────────────────────────────────────────────────────────
// Blog / News posts data
// TODO: Replace with backend query when CMS/DB is ready:
//   import { db } from '../lib/db';
//   export const getPosts = () => db.posts.findMany({ where: { published: true }, orderBy: { publishedAt: 'desc' } });
// ─────────────────────────────────────────────────────────────

export type PostCategory = 'Foundation Updates' | 'Community Stories' | 'Event Recaps' | 'Scholarship';

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: PostCategory;
  publishedAt: string; // ISO date string
  image: string;
  imageAlt: string;
  featured: boolean;
}

export const posts: Post[] = [
  {
    slug: 'golf-classic-announced',
    title: 'First Inaugural Golf Classic Announced for May 28',
    excerpt:
      'The Ripple Effect of Life is proud to announce our first community fundraiser: a four-person scramble golf tournament at Eagle Vines Vineyards & Golf Club on May 28, 2026.',
    category: 'Foundation Updates',
    publishedAt: '2025-11-15',
    image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Golf course',
    featured: true,
    body: `We are thrilled to announce the First Inaugural Golf Classic, taking place Thursday, May 28, 2026 at Eagle Vines Vineyards & Golf Club in American Canyon, California.

This four-person scramble tournament is our first major fundraiser, and every dollar raised will go directly toward scholarships for Benicia High School seniors and community programs that carry James Baldwin's legacy of service forward.

Registration is open now at $225 per individual or $900 per foursome. Sponsorship opportunities are also available — reach out to Info@TheRippleEffectOfLife.com for details.

We hope to see you on the course.`,
  },
  {
    slug: 'scholarship-applications-open',
    title: '2026 Scholarship Applications Are Now Open',
    excerpt:
      'The James Baldwin Community Service Scholarship is now accepting applications from graduating Benicia High School seniors who embody a commitment to service.',
    category: 'Scholarship',
    publishedAt: '2026-01-10',
    image: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Graduation ceremony',
    featured: false,
    body: `The James Baldwin Community Service Scholarship is now open for applications. This scholarship honors students who reflect what James Baldwin has modeled his entire life: showing up for others, giving back, and leading by example.

To be eligible, applicants must be graduating Benicia High School seniors planning to attend college, a trade school, or a vocational program, with a demonstrated record of community service.

Applications are due April 10, 2026. Visit the What We Do page for full requirements and to access the application form.

We look forward to recognizing a student who embodies the values at the heart of this foundation.`,
  },
  {
    slug: 'introducing-the-ripple-effect',
    title: 'Introducing The Ripple Effect of Life',
    excerpt:
      'Kelly Baldwin and Terry Baldwin share the story behind the foundation they created to honor James Baldwin, a lifelong community leader in Benicia, California.',
    category: 'Foundation Updates',
    publishedAt: '2025-09-01',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Community gathering',
    featured: false,
    body: `My father has spent his entire life showing up for other people. Coaching youth sports. Mentoring young men and women. Organizing community events. Giving his time freely, consistently, without any expectation of recognition.

Watching him do this for as long as I can remember, I began to understand something: the impact of one person's service is impossible to fully measure, but impossible to miss when you have experienced it firsthand. It spreads. It creates ripples.

The Ripple Effect of Life is our way of honoring that. Through scholarships for young people who share his values and community events that bring people together, we are keeping his spirit of service alive and passing it forward.

This is just the beginning. Thank you for being part of it.

— Kelly Baldwin &amp; Terry Baldwin`,
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getFeaturedPost(): Post | undefined {
  return posts.find((p) => p.featured);
}

export function getRecentPosts(count = 3): Post[] {
  return [...posts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, count);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
