// ─────────────────────────────────────────────────────────────
// Impact stats
// TODO: Replace with backend query when CMS/DB is ready.
//   eventsHosted and scholarshipsAwarded can auto-calculate from their tables;
//   others are manually updated by admin.
// ─────────────────────────────────────────────────────────────

export interface ImpactStat {
  value: string;
  label: string;
  sublabel?: string;
}

export const impact: ImpactStat[] = [
  {
    value: '30+',
    label: 'Years of Service',
    sublabel: "James Baldwin's legacy in Benicia",
  },
  {
    value: '1st',
    label: 'Annual Scholarship',
    sublabel: 'Launching spring 2026',
  },
  {
    value: 'First',
    label: 'Annual Golf Classic',
    sublabel: 'A new community tradition',
  },
];
