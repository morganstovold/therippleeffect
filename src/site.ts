export const site = {
  name: "The Ripple Effect of Life",
  description:
    "The Ripple Effect of Life is a nonprofit foundation dedicated to honoring James Baldwin's legacy of service by empowering communities through scholarships, events, and giving back.",
  email: "Info@TheRippleEffectOfLife.com",
  tagline: "One life of service. Countless ripples.",
  // Set this to an online donation page (e.g. PayPal, Givebutter) to turn on the Donate Now button.
  donateUrl: undefined as string | undefined,
  social: {
    facebook: "#",
    instagram: "#",
  },
  scholarship: {
    deadline: new Date("2026-04-10"),
    requirementsUrl: "https://eddy.pro/pdf/6456025",
    applicationUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLSdE0oa_clmnhxRFj-iP0x1RHW1Pb5UXXuDM82MnU89XUeWebg/viewform",
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
