export default function Hero3D() {
  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-sf-gray to-white">
      {/* Floating 3D Capsule */}
      <div className="absolute top-[15%] right-[20%] animate-float">
        <div className="w-32 h-16 rounded-full bg-gradient-to-br from-[#5B9BD5] to-[#3A7BC8] shadow-[0_20px_40px_rgba(91,155,213,0.4)] transform rotate-[-15deg]">
          <div className="absolute top-2 left-4 w-6 h-6 rounded-full bg-white/30 blur-sm"></div>
        </div>
      </div>

      {/* Red 3D Blob */}
      <div className="absolute top-[40%] right-[10%] animate-float-delayed">
        <div className="w-40 h-40 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-gradient-to-br from-[#E54D4D] to-[#C43E3E] shadow-[0_25px_50px_rgba(229,77,77,0.35)] transform rotate-[10deg]">
          <div className="absolute top-4 left-6 w-10 h-10 rounded-full bg-white/20 blur-md"></div>
        </div>
      </div>

      {/* Black 3D Sphere */}
      <div className="absolute bottom-[25%] right-[25%] animate-float-slow">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#2A2A2A] to-[#0D0D0D] shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
          <div className="absolute top-2 left-3 w-5 h-5 rounded-full bg-white/10 blur-sm"></div>
        </div>
      </div>

      {/* Light Blue Pill */}
      <div className="absolute top-[60%] right-[35%] animate-float-delayed">
        <div className="w-24 h-10 rounded-full bg-gradient-to-r from-[#D4E5F7] to-[#B8D4F0] shadow-[0_10px_25px_rgba(180,212,240,0.5)] transform rotate-[25deg]">
        </div>
      </div>

      {/* Small Floating Dots */}
      <div className="absolute top-[20%] right-[40%] w-3 h-3 rounded-full bg-sf-black/20 animate-pulse"></div>
      <div className="absolute top-[50%] right-[15%] w-2 h-2 rounded-full bg-sf-red/40 animate-pulse"></div>
      <div className="absolute bottom-[35%] right-[40%] w-4 h-4 rounded-full bg-sf-blue/30 animate-pulse"></div>

      {/* Cursor/Arrow Shape */}
      <div className="absolute bottom-[15%] right-[18%] animate-float">
        <svg width="60" height="80" viewBox="0 0 60 80" fill="none" className="drop-shadow-2xl">
          <path 
            d="M10 5L50 40L35 42L42 70L32 73L25 47L10 55V5Z" 
            fill="url(#cursor-gradient)"
            filter="drop-shadow(0 10px 20px rgba(0,0,0,0.3))"
          />
          <defs>
            <linearGradient id="cursor-gradient" x1="10" y1="5" x2="50" y2="70" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2A2A2A"/>
              <stop offset="1" stopColor="#0D0D0D"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Network Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 400">
        <line x1="100" y1="80" x2="200" y2="120" stroke="#0D0D0D" strokeWidth="1" strokeDasharray="4 4"/>
        <line x1="200" y1="120" x2="280" y2="90" stroke="#0D0D0D" strokeWidth="1" strokeDasharray="4 4"/>
        <line x1="150" y1="200" x2="250" y2="180" stroke="#0D0D0D" strokeWidth="1" strokeDasharray="4 4"/>
        <circle cx="100" cy="80" r="4" fill="#0D0D0D"/>
        <circle cx="200" cy="120" r="4" fill="#0D0D0D"/>
        <circle cx="280" cy="90" r="4" fill="#0D0D0D"/>
        <circle cx="150" cy="200" r="4" fill="#0D0D0D"/>
        <circle cx="250" cy="180" r="4" fill="#0D0D0D"/>
      </svg>
    </div>
  );
}
