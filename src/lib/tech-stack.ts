import {
  siCss,
  siDjango,
  siFigma,
  siFlutter,
  siFramer,
  siGit,
  siHtml5,
  siJavascript,
  siNextdotjs,
  siNodedotjs,
  siOpenjdk,
  siPython,
  siReact,
  siTailwindcss,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";

export type Tech = { name: string; icon: SimpleIcon };
export type TechCategory = { label: string; items: Tech[] };

// Edit this list to change the tech stack (icons come from simple-icons)
export const TECH_STACK: TechCategory[] = [
  {
    label: "Languages",
    items: [
      { name: "Python", icon: siPython },
      { name: "Java", icon: siOpenjdk },
      { name: "JavaScript", icon: siJavascript },
      { name: "TypeScript", icon: siTypescript },
      { name: "HTML", icon: siHtml5 },
      { name: "CSS", icon: siCss },
    ],
  },
  {
    label: "Frontend",
    items: [
      { name: "React", icon: siReact },
      { name: "Next.js", icon: siNextdotjs },
      { name: "Tailwind CSS", icon: siTailwindcss },
      { name: "Framer Motion", icon: siFramer },
    ],
  },
  {
    label: "Backend & Mobile",
    items: [
      { name: "Django", icon: siDjango },
      { name: "Node.js", icon: siNodedotjs },
      { name: "Flutter", icon: siFlutter },
    ],
  },
  {
    label: "Tools",
    items: [
      { name: "Git", icon: siGit },
      { name: "Figma", icon: siFigma },
    ],
  },
];
