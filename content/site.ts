// content/site.ts
export interface Offering {
  title: string;
  description: string;
}

export interface Benefit {
  label: string;
}

export interface Testimonial {
  quote: string;
  attribution: string;
}

export const site = {
  hero: {
    eyebrow: "Experience the healing power of Naad Yoga",
    wordmark: "Diwan Naad Dhyana",
    shlokaLines: ["सर्वं शान्तं शिवं ब्रह्म", "नादे लीनं निरामयम्।"],
    tagline: "Stillness dissolves into sound",
    closingLine: "Every string, a resonance.\nEvery session, a return to stillness.",
    primaryCta: "Book a Session",
    secondaryCta: "Explore Offerings",
  },
  benefits: [
    { label: "Sound Meditation" },
    { label: "Reduce Stress & Anxiety" },
    { label: "Improve Focus & Clarity" },
    { label: "Emotional Balance" },
    { label: "Better Sleep & Well-being" },
  ] satisfies Benefit[],
  offerings: [
    {
      title: "Personal Experiences",
      description: "One-on-one sound meditation sessions tailored to your needs.",
    },
    {
      title: "Community Gatherings",
      description: "Group sound baths and satsangs held in shared, sacred spaces.",
    },
    {
      title: "Educational Institutions",
      description: "Programs introducing students to sound, stillness, and focus.",
    },
    {
      title: "Workplace Well-being",
      description: "Corporate sessions to reduce stress and restore team balance.",
    },
  ] satisfies Offering[],
  founder: {
    name: "Nehal Sati",
    // TODO: replace with real founder bio (training/lineage, what led to founding
    // Diwan Naad Dhyana, philosophy behind sessions). Do not invent specific
    // biographical claims (dates, credentials, lineage details).
    bio: [
      "Placeholder bio paragraph one — training and background will go here.",
      "Placeholder bio paragraph two — the story behind founding Diwan Naad Dhyana will go here.",
    ],
  },
  // TODO: replace with real client testimonials before launch, or remove the
  // Testimonials section entirely if none are available yet.
  testimonials: [
    { quote: "Placeholder personal-session testimonial.", attribution: "Placeholder, Personal Session" },
    { quote: "Placeholder community-gathering testimonial.", attribution: "Placeholder, Community Gathering" },
    { quote: "Placeholder corporate-session testimonial.", attribution: "Placeholder, Workplace Session" },
  ] satisfies Testimonial[],
  contact: {
    phone: "+91-8368426330",
    whatsappNumber: "918368426330",
    website: "www.diwannaaddhyana.com",
    instagram: "@diwannaaddhyana",
    instagramUrl: "https://instagram.com/diwannaaddhyana",
    // TODO: confirm the standee QR code's actual target URL with Nehal —
    // defaulting to the Instagram profile until confirmed.
    qrTargetUrl: "https://instagram.com/diwannaaddhyana",
  },
} as const;
