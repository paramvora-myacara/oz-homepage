"use client";
import ThemeLogo from "./ThemeLogo";
import CTAButton from "./CTAButton";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 p-8">
      <div className="flex items-center justify-between w-full">
        {/* Logo on the left */}
        <div className="flex-shrink-0">
          <ThemeLogo />
        </div>
        
        {/* CTA Buttons and Theme Switcher on the extreme right */}
        <div className="flex items-center gap-3">
          <CTAButton variant="text" size="sm">
            Qualify as an Investor
          </CTAButton>
          
          <CTAButton variant="text" size="sm">
            Speak to Ozzie AI
          </CTAButton>

          <CTAButton variant="filled" size="sm">
            Speak to the Team
          </CTAButton>

          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
} 