import { FlickeringGrid } from "@/components/ui/flickering-grid";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh] w-full bg-[#161616]">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[100dvh] w-full px-8 text-center overflow-hidden">
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

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center gap-6">
          <h1 className="text-[clamp(40px,6vw,80px)] font-bold text-white leading-[1.1] tracking-tight drop-shadow-sm">
            Creative <em className="text-[#F28CA0] not-italic drop-shadow-sm">Portfolio</em>
          </h1>
          <p className="text-white/80 text-[clamp(16px,2vw,20px)] leading-relaxed max-w-2xl font-light">
            Crafting digital experiences with a touch of organic, playful, and soft design. Welcome to my remastered portfolio.
          </p>
          <div className="mt-8 flex gap-4">
            <button className="px-8 py-3 rounded-full bg-[#F28CA0] text-[#161616] font-semibold hover:bg-[#F4A7B9] transition-colors">
              View Work
            </button>
            <button className="px-8 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors">
              Contact Me
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
