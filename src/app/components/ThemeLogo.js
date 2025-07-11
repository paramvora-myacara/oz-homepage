'use client';

import Image from 'next/image';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeLogo() {
  const { resolvedTheme } = useTheme();
  
  return (
    <Image 
      src={resolvedTheme === 'dark' ? "/OZListings-Dark.png" : "/OZListings-Light.jpeg"}
      alt="OZ Listings" 
      width={180} 
      height={60} 
      className="h-6 w-auto object-contain transition-opacity duration-300"
      priority
      quality={100}
    />
  );
} 