import { FlickeringGrid } from "@/components/ui/flickering-grid";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh] w-full bg-[#0A0A0A]">
      {/* Hero Section */}
      <section className="relative flex min-h-[100dvh] w-full p-10 sm:p-14 md:p-20 lg:p-24 overflow-hidden">
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

        {/* Center Card */}
        <div className="relative z-10 flex-1 w-full bg-[#0A0A0A] border border-[#DB7093]/60 rounded-[4px] shadow-2xl p-8 flex flex-col items-center justify-center backdrop-blur-sm">
          {/* Card content will go here */}
        </div>
      </section>
    </div>
  );
}
