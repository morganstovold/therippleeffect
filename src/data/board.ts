// ─────────────────────────────────────────────────────────────
// Board members data
// TODO: Replace with backend query when CMS/DB is ready:
//   import { db } from '../lib/db';
//   export const getBoard = () => db.boardMembers.findMany({ orderBy: { sortOrder: 'asc' } });
// ─────────────────────────────────────────────────────────────

export interface BoardMember {
  name: string;
  role: string;
  bio: string;
  image?: string; // URL — leave undefined to show initials placeholder
}

export const board: BoardMember[] = [
  {
    name: 'Terry Baldwin',
    role: 'Co-Founder',
    bio: "Terry Baldwin co-founded The Ripple Effect of Life alongside her daughter Kelly to honor her husband James and the decades of service he has given to the Benicia community.",
    image: undefined, // TODO: Add photo
  },
  {
    name: 'Kelly Baldwin',
    role: 'Co-Founder & Executive Director',
    bio: "Kelly Baldwin co-founded The Ripple Effect of Life with her mother Terry to honor her father James and carry his legacy of service forward. She leads the foundation's scholarship program, community events, and day-to-day operations.",
    image: undefined, // TODO: Add photo
  },
  // Additional board members to be announced
];
