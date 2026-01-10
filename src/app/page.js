'use client';
import { useEffect } from 'react';
import Navbar from './components/landing/Navbar';
import Hero from './components/landing/Hero';
import Calculator from './components/landing/Calculator';
import HowItWorks from './components/landing/HowItWorks';
import CTASection from './components/landing/CTASection';

export default function App() {

  // Ensure page stays at top on refresh
  useEffect(() => {
    if (window.scrollY > 0) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white text-navy font-sans antialiased">
      <Navbar />
      <Hero />
      <Calculator />
      <HowItWorks />
      <CTASection />
    </div>
  );
}
