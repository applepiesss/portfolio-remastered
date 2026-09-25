import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { Skiper58 } from "@/components/ui/skiper-ui/skiper58";
import { TextDecode } from "@/components/ui/text-decode";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh] w-full bg-[#0A0A0A]">
      {/* Hero Section */}
      <section className="relative flex flex-col min-h-[100dvh] w-full p-10 sm:p-14 md:p-20 lg:p-24 overflow-hidden">
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
          <div className="flex-1 bg-[#0A0A0A] border border-[#DB7093]/60 rounded-[4px] shadow-2xl p-6 md:p-10 flex flex-col items-center justify-center backdrop-blur-sm overflow-hidden">
            {/* Future content will go here */}
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
