import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { Skiper58 } from "@/components/ui/skiper-ui/skiper58";
import { TextDecode } from "@/components/ui/text-decode";
import { Link001 } from "@/components/ui/skiper-ui/skiper40";
import { ThemeHoldArea } from "@/components/theme-hold-area";
import { Mail, Download, ArrowUpRight, Award } from "lucide-react";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.34 6-1.53 6-6.76a5.5 5.5 0 0 0-1.5-3.89 5.5 5.5 0 0 0-.15-3.82s-1.13-.36-3.89 1.5a13.3 13.3 0 0 0-7 0C6.27 2.22 5.14 2.58 5.14 2.58a5.5 5.5 0 0 0-.15 3.82A5.5 5.5 0 0 0 3.5 10c0 5.23 3 6.42 6 6.76-.7.62-1 1.4-1 2.92v4.32" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const socials = [
  { label: "GitHub", href: "https://github.com/applepiesss", Icon: GithubIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/nadia-aisyah-fazila/", Icon: LinkedinIcon },
  { label: "Email", href: "mailto:nadiaaiiisyahf@gmail.com", Icon: Mail },
];

const experiences = [
  {
    role: "Staff of Business Development",
    org: "SIWAK-NG",
    period: "Sep 2025 — Oct 2025",
    points: [
      "Managed operational and promotional aspects of paid exam preparation classes",
      "Coordinated communication between tutors and tutees to ensure smooth class delivery",
      "Supported marketing efforts to drive class enrollment and increase participant reach",
    ],
  },
  {
    role: "Staff of Product Management Academy",
    org: "COMPFEST",
    period: "Apr 2025 — Oct 2025",
    points: [
      "Contributed to execution of a Product Management Academy",
      "Handled event operations as MC and operator across academy sessions",
      "Managed documentation and coordinated mentor-mentee relationships throughout the program",
      "Gained practical knowledge in product management frameworks and lifecycle",
    ],
  },
  {
    role: "Mentor",
    org: "Dasar-Dasar Pemrograman 0",
    period: "Jul 2025 — Sep 2025",
    points: [
      "Facilitated foundational Python and programming logic learning for first-year Computer Science students",
      "Guided learners through complex problems using structured lessons and hands-on exercises",
      "Built mentee confidence in syntax proficiency and independent problem-solving",
    ],
  },
  {
    role: "Mentor",
    org: "Open House Fasilkom UI",
    period: "Nov 2024",
    points: [
      "Guided prospective students through Fasilkom UI and shared academic experiences",
      "Addressed inquiries regarding curriculum, student life, and faculty culture",
    ],
  },
];

const skills = ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Node.js", "UI/UX Design"];

// Placeholder entries: replace with real articles (title, date, short excerpt, link)
const articles = [
  {
    title: "Article Title 01",
    date: "Jan 2026",
    excerpt: "A short one- or two-sentence summary of what this article is about.",
    href: "#",
  },
  {
    title: "Article Title 02",
    date: "Dec 2025",
    excerpt: "A short one- or two-sentence summary of what this article is about.",
    href: "#",
  },
];

// Placeholder entries: replace with real certificates (name, issuer, date, credential link)
const certificates = [
  {
    name: "Certificate Name 01",
    issuer: "Issuing Organization",
    date: "Jan 2026",
    href: "#",
  },
  {
    name: "Certificate Name 02",
    issuer: "Issuing Organization",
    date: "Dec 2025",
    href: "#",
  },
];

const SectionHeading =({ index, label, title, hero = false }: { index: string; label: string; title: string; hero?: boolean }) => (
  <div className={hero ? "mb-5" : "mb-10"}>
    <p className="font-mono text-xs text-brand tracking-wider mb-3">
      {index} <span className="text-white/20">/</span> {label}
    </p>
    {hero ? (
      <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-gradient-brand pb-1 w-fit">{title}</h2>
    ) : (
      <h2 className="font-heading text-2xl md:text-3xl font-semibold text-white tracking-tight">{title}</h2>
    )}
    <div className={`${hero ? "mt-5" : "mt-6"} h-px w-full max-w-lg bg-gradient-to-r from-brand/50 via-white/10 to-transparent`} />
  </div>
);

const gridThemes: { theme: string; color: string }[] = [
  { theme: "pink", color: "#FF7EB9" },
  { theme: "blue", color: "#93B8FF" },
  { theme: "purple", color: "#B794FF" },
];

export default function Home() {
  return (
    <div className="flex flex-col h-[100dvh] max-h-[100dvh] w-full bg-[#09090B] overflow-hidden">
      {/* Hero Section */}
      <ThemeHoldArea className="relative flex flex-col h-full w-full p-4 sm:p-8 md:p-12 lg:p-16 overflow-hidden">
        {/* Background Grid: only the active theme's grid shows (see globals.css); faded toward the center so the motion frames the content instead of competing with it */}
        {gridThemes.map(({ theme, color }) => (
          <div key={theme} className={`bg-grid-${theme} absolute inset-0 z-0 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,rgba(0,0,0,0.55)_10%,black_65%)]`}>
            <FlickeringGrid
              className="w-full h-full"
              squareSize={3}
              gridGap={5}
              color={color}
              maxOpacity={0.6}
              flickerChance={0.12}
            />
          </div>
        ))}

        {/* Cards Wrapper */}
        <div className="relative z-10 flex-1 w-full flex flex-col md:flex-row gap-4 md:gap-6 h-full min-h-0">

          {/* Main Content Card */}
          <div data-no-theme-hold className="flex-1 min-h-0 bg-[#0C0C0E]/90 border border-white/10 rounded-xl shadow-2xl shadow-black/50 backdrop-blur-md overflow-y-auto scroll-smooth">

            {/* About Me Section */}
            <section id="about" className="px-6 md:px-14 lg:px-20 pt-12 md:pt-20 pb-14 md:pb-20">
              <SectionHeading index="01" label="About" title="Nadia Aisyah Fazila" hero />
              <p className="text-white/65 text-base md:text-lg leading-relaxed max-w-2xl">
                Hi, I&apos;m Nadia — a Computer Science student at Universitas Indonesia who learns best by building.
                I enjoy working across the stack, from backend systems to frontend interfaces, with a focus on
                understanding how things work and growing with every project I take on.
              </p>

              {/* Links & Resume */}
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center mt-10 w-full">
                <div className="flex flex-wrap items-center gap-6 md:gap-8">
                  {socials.map(({ label, href, Icon }) => (
                    <div key={label} className="flex items-center gap-2.5 group/social">
                      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                        <Icon className="w-[18px] h-[18px] text-white/60 group-hover/social:text-brand transition-colors" />
                      </a>
                      <Link001 href={href} className="text-sm text-white/60 group-hover/social:text-brand group-hover/social:before:origin-left group-hover/social:before:scale-x-100 [&>svg]:group-hover/social:translate-y-0 [&>svg]:group-hover/social:opacity-100 transition-colors">
                        {label}
                      </Link001>
                    </div>
                  ))}
                </div>

                <a href="/CV_NadiaAisyahFazila.pdf" download className="group/resume flex justify-center items-center gap-2 text-sm font-medium text-white/80 bg-white/[0.03] border border-white/10 px-5 py-2.5 rounded-md hover:border-brand/40 hover:text-brand hover:bg-white/[0.04] transition-colors duration-300 w-full md:w-auto md:ml-auto">
                  <Download className="w-4 h-4 text-brand transition-transform duration-300 group-hover/resume:translate-y-0.5" /> Download Resume
                </a>
              </div>
            </section>

            <hr className="border-t border-white/10" />

            {/* Experience Section */}
            <section id="experience" className="px-6 md:px-14 lg:px-20 py-14 md:py-20">
              <SectionHeading index="02" label="Experience" title="Relevant experience" />
              <div className="flex flex-col divide-y divide-white/[0.06]">
                {experiences.map((exp) => (
                  <div key={`${exp.role}-${exp.org}`} className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-2 lg:gap-8 py-7 first:pt-0 last:pb-0">
                    <span className="font-mono text-xs text-white/40 pt-1.5">{exp.period}</span>
                    <div>
                      <h3 className="font-heading text-base md:text-lg font-medium text-white">{exp.role}</h3>
                      <p className="text-sm text-brand mt-0.5 mb-3">{exp.org}</p>
                      <ul className="text-white/60 text-sm md:text-[15px] leading-relaxed space-y-1.5">
                        {exp.points.map((point) => (
                          <li key={point} className="relative pl-4 before:absolute before:left-0 before:top-[0.6em] before:w-1.5 before:h-px before:bg-white/30">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-t border-white/10" />

            {/* Skills Section */}
            <section id="skills" className="px-6 md:px-14 lg:px-20 py-14 md:py-20">
              <SectionHeading index="03" label="Skills" title="Tech stack" />
              <div className="flex flex-wrap gap-2.5">
                {skills.map((skill) => (
                  <span key={skill} className="px-3.5 py-1.5 border border-white/10 bg-white/[0.03] text-white/75 text-sm rounded-md hover:border-brand/50 hover:text-brand transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <hr className="border-t border-white/10" />

            {/* Projects Section */}
            <section id="projects" className="px-6 md:px-14 lg:px-20 pt-14 md:pt-20 pb-14 md:pb-20">
              <SectionHeading index="04" label="Projects" title="Selected projects" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Project 01", "Project 02"].map((project) => (
                  <div key={project} className="h-56 bg-white/[0.02] border border-white/10 rounded-lg flex items-center justify-center hover:border-brand/40 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer">
                    <span className="font-mono text-xs text-white/30">{project}</span>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-t border-white/10" />

            {/* Articles Section */}
            <section id="articles" className="px-6 md:px-14 lg:px-20 pt-14 md:pt-20 pb-14 md:pb-20">
              <SectionHeading index="05" label="Articles" title="Writing" />
              <div className="flex flex-col divide-y divide-white/[0.06]">
                {articles.map((article) => (
                  <a
                    key={article.title}
                    href={article.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group grid grid-cols-1 lg:grid-cols-[180px_1fr_auto] gap-2 lg:gap-8 py-6 first:pt-0 last:pb-0"
                  >
                    <span className="font-mono text-xs text-white/40 pt-1.5">{article.date}</span>
                    <div>
                      <h3 className="font-heading text-base md:text-lg font-medium text-white group-hover:text-brand transition-colors">{article.title}</h3>
                      <p className="text-white/60 text-sm md:text-[15px] leading-relaxed mt-1.5">{article.excerpt}</p>
                    </div>
                    <ArrowUpRight className="hidden lg:block w-4 h-4 mt-1.5 text-white/30 group-hover:text-brand group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                  </a>
                ))}
              </div>
            </section>

            <hr className="border-t border-white/10" />

            {/* Certificates Section */}
            <section id="certificates" className="px-6 md:px-14 lg:px-20 pt-14 md:pt-20 pb-14 md:pb-20">
              <SectionHeading index="06" label="Certificates" title="Licenses & certifications" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <a
                    key={cert.name}
                    href={cert.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4 p-5 bg-white/[0.02] border border-white/10 rounded-lg hover:border-brand/40 hover:bg-white/[0.04] transition-all duration-300"
                  >
                    <Award className="w-5 h-5 shrink-0 mt-0.5 text-brand" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading text-[15px] font-medium text-white leading-snug group-hover:text-brand transition-colors">{cert.name}</h3>
                      <p className="text-sm text-white/60 mt-1">{cert.issuer}</p>
                      <p className="font-mono text-xs text-white/40 mt-3">Issued {cert.date}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 shrink-0 text-white/30 group-hover:text-brand group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                  </a>
                ))}
              </div>
            </section>

          </div>

          {/* Profile & Navigation Card */}
          <div data-no-theme-hold className="relative w-full md:w-64 lg:w-72 shrink-0 bg-[#0C0C0E]/90 border border-white/10 rounded-xl shadow-2xl shadow-black/50 backdrop-blur-md p-4 md:p-8 flex flex-row md:flex-col items-center md:justify-center gap-4 md:gap-8">

            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-40 md:h-40 lg:w-48 lg:h-48 shrink-0 rounded-lg overflow-hidden ring-1 ring-white/10">
              <img
                src="/nadia.jpeg"
                alt="Nadia Aisyah Fazila"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 md:flex-none flex flex-col justify-center items-center w-full gap-1 md:gap-8">
              <div className="text-center">
                <div className="font-heading font-extrabold text-2xl md:text-4xl tracking-tight leading-tight text-gradient-brand w-fit mx-auto">
                  <TextDecode text="Nadia" speed={60} duration={1500} />
                </div>
                <div className="flex justify-center mt-1.5">
                  <Link001 href="https://cs.ui.ac.id/" className="font-mono text-[11px] text-white/40 hover:text-brand transition-colors">CS @ Universitas Indonesia</Link001>
                </div>
              </div>

              <nav className="w-full">
                <Skiper58 />
              </nav>

            </div>

            <p className="hidden md:block absolute bottom-3 inset-x-0 font-mono text-[8px] text-white/25 text-center">
              psst... hold the background to switch colors
            </p>
          </div>

        </div>
      </ThemeHoldArea>
    </div>
  );
}
