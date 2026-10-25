export type Project = {
  name: string;
  description: string;
  /** Cover image in /public/projects */
  image: string;
};

// Shown in this order in the Projects carousel
export const PROJECTS: Project[] = [
  {
    name: "CloudNap",
    description: "A simple, personal sleep app that helps you build better sleep habits and get the most out of every night.",
    image: "/projects/cloudnap.png",
  },
  {
    name: "EventEase",
    description: "Find events that work for wheelchair users, people with leg pain and other mobility needs, with accessibility info up front.",
    image: "/projects/eventease.png",
  },
  {
    name: "HerRoute",
    description: "A machine-learning route finder that helps women get around the city on safer routes, day or night.",
    image: "/projects/herroute.png",
  },
  {
    name: "LigaPass",
    description: "Buy football match tickets and catch up on the latest football news, all in one place.",
    image: "/projects/ligapass.png",
  },
  {
    name: "MySawit",
    description: "A dashboard for managing palm oil plantations, bringing plantation data together in one view.",
    image: "/projects/mysawit.png",
  },
  {
    name: "Blusukan",
    description: "An AI-powered guide to exploring Solo, with sightseeing routes and culinary trails around the city.",
    image: "/projects/blusukan.jpeg",
  },
];
