'use client';
import { useEffect } from 'react';
import { trackUserEvent } from '../../lib/analytics/trackUserEvent';
import DeveloperHero from './components/DeveloperHero';
import VideoSection from '../components/VideoSection';
import HowItWorks from './components/HowItWorks';
import MarketingBenefits from './components/MarketingBenefits';
import DevelopersFaq from './components/DevelopersFaq';

export default function DevelopersPage() {
  useEffect(() => {
    trackUserEvent("viewed_developers_page");
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white text-navy font-sans antialiased dark:bg-black dark:text-white">
      {/* Grid Background */}
      <div className="fixed inset-0 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-0 pointer-events-none"></div>
      
      <DeveloperHero />

      <VideoSection 
        videoUrls={[
          "https://youtu.be/ysHjXy66SVc",
          "https://youtu.be/WNWKr6z4IyY"
        ]}
        title="Scaling Your Capital Raise"
        description="Learn how top sponsors are using OZ Listings to connect with institutional-grade capital."
      />

      <HowItWorks />

      <MarketingBenefits />

      <DevelopersFaq />
    </div>
  );
}
