'use client';

import Image from 'next/image';

export default function ThemeLogo() {
  return (
    <Image 
      src="/OZListings-Light.jpeg" 
      alt="OZ Listings" 
      width={120} 
      height={40} 
      className="h-6 w-auto object-contain"
      priority
      quality={100}
    />
  );
} 