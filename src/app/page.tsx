import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { Skiper58 } from "@/components/ui/skiper-ui/skiper58";
import { TextDecode } from "@/components/ui/text-decode";

export default function Home() {
  return (
    <div className="flex flex-col h-[100dvh] max-h-[100dvh] w-full bg-[#0A0A0A] overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex flex-col h-full w-full p-10 sm:p-14 md:p-20 lg:p-24 overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 mix-blend-screen pointer-events-none">
          <FlickeringGrid
            className="w-full h-full"
            squareSize={4}
            gridGap={1}
            color="#F4A7B9"
            maxOpacity={0.35}
            flickerChance={0.1}
            shape="mixed"
          />
        </div>

        {/* Cards Wrapper */}
        <div className="relative z-10 flex-1 w-full flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8 h-full">

          {/* Main Content Card (Left on Desktop, Top on Mobile) */}
          <div className="flex-1 bg-[#0A0A0A] border border-[#DB7093]/60 rounded-[4px] shadow-2xl p-6 md:p-14 flex flex-col backdrop-blur-sm overflow-y-auto scroll-smooth">

            {/* About Me Section */}
            <section id="about" className="min-h-full flex flex-col justify-start pt-10 pb-24 px-4 md:px-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 uppercase tracking-widest">About <span className="text-[#FF82A5]">Me</span></h2>
              <p className="text-white/60 text-base md:text-lg leading-relaxed tracking-wide">
                Hi! I'm Nadia :] Just a curious CS student @UI who loves learning by building things. I enjoy exploring different areas of tech, from backend systems to frontend interfaces, always with the goal of understanding how things work and growing with every line of code ^_^
              </p>
            </section>

            {/* Separator */}
            <hr className="-mx-6 md:-mx-14 border-t border-[#FF82A5]/50" />

            {/* Experience Section */}
            <section id="experience" className="min-h-full flex flex-col justify-start pt-10 pb-24 px-4 md:px-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 uppercase tracking-widest">Work <span className="text-[#FF82A5]">Experience</span></h2>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col border-l-2 border-[#DB7093]/40 pl-6">
                  <h3 className="text-lg md:text-xl font-bold text-white tracking-wide">Senior Frontend Engineer</h3>
                  <span className="text-[#FF82A5] text-xs md:text-sm tracking-widest mb-2 uppercase">Company Name — 2023 - Present</span>
                  <p className="text-white/60 text-sm md:text-base leading-relaxed">
                    Developed scalable web applications and led the frontend architecture for the core product.
                  </p>
                </div>
              </div>
            </section>



            {/* Separator */}
            <hr className="-mx-6 md:-mx-14 border-t border-[#FF82A5]/50" />

            {/* Skills Section */}
            <section id="skills" className="min-h-full flex flex-col justify-start pt-10 pb-24 px-4 md:px-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-10 uppercase tracking-widest">Tech <span className="text-[#FF82A5]">Skills</span></h2>
              <div className="flex flex-wrap gap-4">
                {['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Framer Motion', 'Node.js', 'UI/UX Design'].map(skill => (
                  <span key={skill} className="px-4 py-2 border border-[#DB7093]/40 text-[#FF82A5] text-xs md:text-sm tracking-widest uppercase rounded-[4px] hover:bg-[#FF82A5]/10 hover:border-[#FF82A5] transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Separator */}
            <hr className="-mx-6 md:-mx-14 border-t border-[#FF82A5]/50" />

            {/* Projects Section */}
            <section id="projects" className="min-h-full flex flex-col justify-start pt-10 pb-24 px-4 md:px-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-10 uppercase tracking-widest">Selected <span className="text-[#FF82A5]">Projects</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64 bg-white/5 border border-white/10 rounded-[4px] flex items-center justify-center hover:border-[#FF82A5]/60 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                  <span className="text-white/30 tracking-widest font-bold">PROJECT 01</span>
                </div>
                <div className="h-64 bg-white/5 border border-white/10 rounded-[4px] flex items-center justify-center hover:border-[#FF82A5]/60 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                  <span className="text-white/30 tracking-widest font-bold">PROJECT 02</span>
                </div>
              </div>
            </section>

          </div>

          {/* Navigation Sidebar Card (Right on Desktop, Bottom on Mobile) */}
          <div className="w-full md:w-64 lg:w-80 shrink-0 bg-[#0A0A0A] border border-[#DB7093]/60 rounded-[4px] shadow-2xl p-4 md:p-8 lg:p-10 flex flex-row md:flex-col items-center justify-between md:justify-center backdrop-blur-sm gap-4 md:gap-8">

            {/* Left Column on Mobile: Profile Photo */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-44 md:h-44 lg:w-56 lg:h-56 shrink-0 rounded-[4px] overflow-hidden border border-[#DB7093]/60 shadow-lg mx-auto">
              <img
                src="/nadia.jpeg"
                alt="Nadia Aisyah Fazila"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Column on Mobile: Text & Links */}
            <div className="flex-1 md:flex-none flex flex-col justify-center items-center w-full md:gap-8">
              {/* Logo */}
              <div className="text-[#FF82A5] font-bold text-lg md:text-xl tracking-tight select-none text-center leading-tight uppercase w-full">
                <TextDecode text="Nadia Aisyah Fazila" speed={60} duration={3500} />
              </div>

              {/* Nav Links */}
              <div className="w-full flex flex-col justify-center mt-2 md:mt-0">
                <Skiper58 />
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
