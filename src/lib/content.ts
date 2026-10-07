import { type CollectionEntry, getCollection } from "astro:content";

export type Event = CollectionEntry<"events">;
export type Post = CollectionEntry<"news">;

const startOfToday = () => {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
};

export const isUpcoming = (event: Event) => event.data.date.getTime() >= startOfToday();

export const hasRecap = ({ data }: Event) => Boolean(data.recap) || data.results.length > 0 || data.photos.length > 0;

const byDate = (a: Event | Post, b: Event | Post) => a.data.date.getTime() - b.data.date.getTime();

export async function getEvents() {
  const events = await getCollection("events");
  return {
    upcoming: events.filter(isUpcoming).toSorted(byDate),
    past: events.filter((event) => !isUpcoming(event)).toSorted((a, b) => byDate(b, a)),
  };
}

export async function getFeaturedEvent() {
  const { upcoming } = await getEvents();
  return upcoming.find((event) => event.data.featured) ?? upcoming[0];
}

export async function getPosts() {
  const posts = await getCollection("news", (post) => !post.data.draft);
  return posts.toSorted((a, b) => byDate(b, a));
}

// Content dates have no time, so they are parsed as UTC midnight. Format in UTC to keep the same day.
export const formatDate = (date: Date, options: Intl.DateTimeFormatOptions = { dateStyle: "long" }) =>
  date.toLocaleDateString("en-US", { timeZone: "UTC", ...options });

// "The Bates Family" sorts under B, not T.
const sortName = (name: string) => name.replace(/^The /, "");
const alphabetical = (a: { name: string }, b: { name: string }) => sortName(a.name).localeCompare(sortName(b.name));

export async function getSponsors() {
  const sponsors = (await getCollection("sponsors")).map((entry) => entry.data);
  return {
    businesses: sponsors.filter((sponsor) => sponsor.type === "business").toSorted(alphabetical),
    families: sponsors.filter((sponsor) => sponsor.type === "family").toSorted(alphabetical),
  };
}
