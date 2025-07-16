"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeLogo() {
  const { resolvedTheme } = useTheme();

  return (
    <Link href="/" className="cursor-pointer">
      <Image
        src={
          resolvedTheme === "dark"
            ? "/OZListings-Dark.png"
            : "/OZListings-Light.jpeg"
        }
        alt="OZ Listings"
        width={120}
        height={40}
        className="h-6 w-auto object-contain transition-opacity duration-300 hover:opacity-80"
        priority
        quality={100}
        unoptimized
        style={{
          height: "clamp(12px, 1.5vw, 24px)",
          imageRendering: "crisp-edges",
          imageRendering: "-webkit-optimize-contrast",
        }}
      />
    </Link>
  );
}
