"use client";
import ThemeLogo from "./ThemeLogo";

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 p-8">
      <div className="flex items-center justify-between w-full">
        {/* Logo on the left */}
        <div className="flex-shrink-0">
          <ThemeLogo />
        </div>
        
        {/* CTA Buttons on the extreme right */}
        <div className="flex items-center gap-4">
          <a
            href="/dashboard"
            className="group relative overflow-hidden rounded-lg bg-white backdrop-blur-sm px-6 py-2.5 text-sm font-semibold text-[#1e88e5] transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#1e88e5] focus:ring-offset-2"
            style={{
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1e88e5";
              e.currentTarget.style.color = "white";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(30, 136, 229, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.color = "#1e88e5";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Button shimmer effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-600 group-hover:translate-x-full" />
            <span className="relative z-10">See the OZ Dashboard</span>
          </a>
          
          <a
            href="/listings"
            className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-[#1e88e5] to-[#42a5f5] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#1e88e5] focus:ring-offset-2"
            style={{
              boxShadow: "0 4px 15px rgba(30, 136, 229, 0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05) translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(30, 136, 229, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1) translateY(0px)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(30, 136, 229, 0.2)";
            }}
          >
            {/* Button shimmer effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-600 group-hover:translate-x-full" />
            <span className="relative z-10">Access OZ Listings</span>
          </a>
        </div>
      </div>
    </header>
  );
} 