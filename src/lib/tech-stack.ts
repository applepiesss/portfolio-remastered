import {
  siApachejmeter,
  siBitrise,
  siCss,
  siDart,
  siDjango,
  siDocker,
  siExpo,
  siFastapi,
  siFigma,
  siFlutter,
  siGit,
  siGithubactions,
  siGooglecolab,
  siGrafana,
  siHtml5,
  siJavascript,
  siJunit5,
  siNextdotjs,
  siOpenjdk,
  siPostgresql,
  siPrometheus,
  siPython,
  siRabbitmq,
  siReact,
  siRedis,
  siScikitlearn,
  siSonarqubecloud,
  siSpringboot,
  siSupabase,
  siTailwindcss,
  siTypescript,
} from "simple-icons";

/** Only the SVG path is drawn, so a hand-made icon just needs a 24x24 path */
export type Tech = { name: string; icon: { path: string } };
export type TechCategory = { label: string; items: Tech[] };

// simple-icons no longer ships an AWS logo, so this is a plain cloud on the same 24x24 grid
const CLOUD = { path: "M19.35 10.04A7.49 7.49 0 0 0 12 4a7.5 7.5 0 0 0-6.65 4.04A6 6 0 0 0 6 20h13a5 5 0 0 0 .35-9.96Z" };

// Edit this list to change the tech stack (icons come from simple-icons).
// Languages, frameworks and tools only, taken from the projects; libraries are left out on purpose.
export const TECH_STACK: TechCategory[] = [
  {
    label: "Languages",
    items: [
      { name: "Python", icon: siPython },
      { name: "Java", icon: siOpenjdk },
      { name: "TypeScript", icon: siTypescript },
      { name: "JavaScript", icon: siJavascript },
      { name: "Dart", icon: siDart },
      { name: "HTML", icon: siHtml5 },
      { name: "CSS", icon: siCss },
    ],
  },
  {
    label: "Frameworks",
    items: [
      { name: "React", icon: siReact },
      { name: "Next.js", icon: siNextdotjs },
      { name: "React Native", icon: siReact },
      { name: "Expo", icon: siExpo },
      { name: "Flutter", icon: siFlutter },
      { name: "Tailwind CSS", icon: siTailwindcss },
      { name: "Django", icon: siDjango },
      { name: "FastAPI", icon: siFastapi },
      { name: "Spring Boot", icon: siSpringboot },
      { name: "scikit-learn", icon: siScikitlearn },
    ],
  },
  {
    label: "Data & Infrastructure",
    items: [
      { name: "PostgreSQL", icon: siPostgresql },
      { name: "Supabase", icon: siSupabase },
      { name: "Redis", icon: siRedis },
      { name: "RabbitMQ", icon: siRabbitmq },
      { name: "Docker", icon: siDocker },
      { name: "AWS", icon: CLOUD },
    ],
  },
  {
    label: "Tools",
    items: [
      { name: "Git", icon: siGit },
      { name: "GitHub Actions", icon: siGithubactions },
      { name: "Bitrise", icon: siBitrise },
      { name: "JUnit", icon: siJunit5 },
      { name: "SonarQube Cloud", icon: siSonarqubecloud },
      { name: "Prometheus", icon: siPrometheus },
      { name: "Grafana", icon: siGrafana },
      { name: "JMeter", icon: siApachejmeter },
      { name: "Google Colab", icon: siGooglecolab },
      { name: "Figma", icon: siFigma },
    ],
  },
];
