'use client';
import { useEffect, Suspense } from 'react';
import { trackUserEvent } from '../../lib/analytics/trackUserEvent';
import DeveloperHero from './components/DeveloperHero';
import VideoSection from '../components/VideoSection';
import MarketingBenefits from './components/MarketingBenefits';
import HowItWorks from './components/HowItWorks';
import PricingOverview from './components/PricingOverview';

export default function DevelopersPage() {
  // Track page visit on mount
  useEffect(() => {
    trackUserEvent("viewed_developers_page");
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white text-navy font-sans antialiased dark:bg-black dark:text-white">
      {/* Grid Background */}
      <div className="fixed inset-0 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-0 pointer-events-none"></div>
      
      {/* Hero Section */}
      <DeveloperHero />

      {/* Video Sales Letter Section */}
      <VideoSection 
        videoUrls={[
          "https://youtu.be/ysHjXy66SVc",
          "https://youtu.be/WNWKr6z4IyY"
        ]}
        title="Scaling Your Capital Raise"
        description="Learn how top sponsors are using OZ Listings to connect with institutional-grade capital."
      />

      {/* Marketing Benefits Section */}
      <MarketingBenefits />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Full Pricing Section (with comparison, add-ons, FAQ) */}
      <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading pricing...</div>}>
        <PricingOverview />
      </Suspense>
    </div>
  );
}
