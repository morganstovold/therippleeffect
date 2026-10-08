export const site = {
  name: "The Ripple Effect of Life",
  description:
    "The Ripple Effect of Life is a nonprofit foundation dedicated to honoring James Baldwin's legacy of service by empowering communities through scholarships, events, and giving back.",
  email: "info@therippleeffectoflife.com",
  // The foundation's registered address. It's a private home, so it only appears in the footer.
  address: { street: "916 Bolton Cir", city: "Benicia, CA 94510" },
  phones: [
    { name: "Terry Baldwin", role: "Co-Founder", number: "707-334-3310" },
    { name: "Kelly Baldwin", role: "Co-Founder", number: "707-319-6392" },
  ],
  tagline: "One life of service. Countless ripples.",
  donateUrl:
    "https://www.paypal.com/donate/?hosted_button_id=RCEPHDJTLYXNY&item_name=Ripple%20Effect%20of%20Life%20Fund&no_shipping=2",
  donationsReceivedBy: { name: "Solano Community Foundation", ein: "68-0354961" },
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61588157424841",
    instagram: "https://www.instagram.com/therippleeffectoflife",
  },
};

export const mainNav = [
  { href: "/about", label: "About" },
  { href: "/programs", label: "What We Do" },
  { href: "/events", label: "Events" },
  { href: "/news", label: "News" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/contact", label: "Contact" },
];

export const footerNav = {
  Explore: [
    { href: "/about", label: "About Us" },
    { href: "/programs", label: "What We Do" },
    { href: "/events", label: "Events" },
    { href: "/news", label: "News & Stories" },
  ],
  "Get Involved": [
    { href: "/get-involved", label: "Donate" },
    { href: "/get-involved#volunteer", label: "Volunteer" },
    { href: "/get-involved#sponsor", label: "Sponsor" },
    { href: "/sponsors", label: "Our Sponsors" },
  ],
};
