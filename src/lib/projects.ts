export type Project = {
  name: string;
  /** Where it was made, e.g. a course or event */
  context?: string;
  /** Web app, mobile app, ... */
  type: string;
  /** One-liner shown on the card */
  description: string;
  /** Longer explanation shown in the project detail pop-up */
  overview: string;
  /** Key features or contributions, shown as a list in the pop-up */
  highlights: string[];
  tech?: string[];
  /** Repository / project page and live demo, shown as links in the pop-up */
  projectUrl: string;
  demoUrl: string;
  /** Optional award, shown as a small badge in the pop-up */
  award?: string;
  /** Cover image in /public/projects */
  image: string;
};

// Placeholder until the real project and demo links are ready
const PLACEHOLDER_URL = "http://localhost:3000";

// Shown in this order in the Projects carousel
export const PROJECTS: Project[] = [
  {
    name: "LigaPass",
    context: "PBP · 2025",
    type: "Web & mobile app",
    description: "Football ticketing platform where fans buy match tickets and read the latest news.",
    overview:
      "A web and mobile platform that lets football fans browse match schedules, book tickets by seating category, and stay updated with curated news and match analysis. It pairs a full-stack web app with a Flutter mobile client.",
    highlights: [
      "Supports three user roles (user, admin and journalist), each with its own access and capabilities",
      "Owned the profile module end to end, with full CRUD for user data across all three roles",
      "Ticket booking by seating category, plus a news feed for match coverage",
    ],
    tech: ["Django", "Flutter", "Tailwind CSS"],
    award: "Best Application & Favorite App, PBP Awards 2025",
    projectUrl: PLACEHOLDER_URL,
    demoUrl: PLACEHOLDER_URL,
    image: "/projects/ligapass.png",
  },
  {
    name: "MySawit",
    context: "Advanced Programming",
    type: "Web app",
    description: "Operations platform for palm oil plantations, from the field to the mill.",
    overview:
      "A web-based platform that brings everyone in palm oil plantation operations, from field workers to management, into one app. Workers, foremen, truck drivers and admins coordinate the whole flow, from the daily harvest to shipping fresh fruit bunches to the mill.",
    highlights: [
      "Staff management for field workers, foremen, drivers and admins",
      "Recording and approving daily harvests",
      "Tracking shipments to the mill and processing payments",
    ],
    projectUrl: PLACEHOLDER_URL,
    demoUrl: PLACEHOLDER_URL,
    image: "/projects/mysawit.png",
  },
  {
    name: "Blusukan",
    context: "BYTESFEST 2026",
    type: "Mobile app",
    description: "App for exploring Solo, with sightseeing routes and culinary trails around the city.",
    overview:
      "An AI-powered app for exploring Solo. Visitors pick a mode that suits their day and get routes through the city's sights and its local food spots, while local sellers get a fairer chance to be discovered.",
    highlights: [
      "Sightseeing routes and culinary trails around Solo",
      "Pick an adventure mode that fits the day, and switch any time",
      "AI-powered recommendations aimed at giving local businesses more visibility",
    ],
    projectUrl: PLACEHOLDER_URL,
    demoUrl: PLACEHOLDER_URL,
    image: "/projects/blusukan.jpeg",
  },
  {
    name: "EventEase",
    context: "iFest 2026",
    type: "Web app",
    description: "Event discovery with accessibility info for people with limited mobility.",
    overview:
      "EventEase helps people find concerts, seminars and other events, with accessibility information up front for wheelchair users, people with leg pain and anyone with limited mobility, so they can tell before they go whether a venue works for them.",
    highlights: [
      "Event listings for concerts, seminars and more",
      "Accessibility details for each venue, aimed at users with limited mobility",
      "Built by team NAKBK for the iFest 2026 hackathon",
    ],
    projectUrl: PLACEHOLDER_URL,
    demoUrl: PLACEHOLDER_URL,
    image: "/projects/eventease.png",
  },
  {
    name: "CloudNap",
    type: "Mobile app",
    description: "Simple, personal sleep tracker with a nightly sleep score.",
    overview:
      "A simple and personal sleep-tracking app. It turns each night into a sleep score and summaries that make it easier to see your sleep patterns and build better habits.",
    highlights: [
      "Nightly sleep score with last night's duration, bedtime and wake time",
      "Daily and monthly sleep summaries with trends",
      "Sleep tracker and bedtime reminders",
    ],
    projectUrl: PLACEHOLDER_URL,
    demoUrl: PLACEHOLDER_URL,
    image: "/projects/cloudnap.png",
  },
  {
    name: "HerRoute",
    context: "SISTECH final project",
    type: "Web app",
    description: "Machine-learning route finder that helps women choose safer walking routes.",
    overview:
      "A machine-learning-powered app that helps women find and navigate the safest routes through city streets, whether they are walking during the day or at night.",
    highlights: [
      "Safer route suggestions powered by machine learning",
      "Hold-to-send SOS button that shares your location with three trusted contacts and sounds an alarm",
      "Map and reporting features for unsafe areas",
    ],
    projectUrl: PLACEHOLDER_URL,
    demoUrl: PLACEHOLDER_URL,
    image: "/projects/herroute.png",
  },
];
