"use client";
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AsFeaturedInSection } from '../components/AsFeaturedInSection';

function MiscPageContent() {
  const searchParams = useSearchParams();
  const heading = searchParams.get('heading') || "As Featured in...";

  return (
    <div className="pt-20">
      <AsFeaturedInSection 
        heading={heading} 
        byline="While you're here, also see..."
      />
    </div>
  );
}

export default function MiscPage() {
  return (
    <Suspense fallback={
      <div className="pt-20">
        <AsFeaturedInSection 
          heading="As Featured in..." 
          byline="While you're here, also see..."
        />
      </div>
    }>
      <MiscPageContent />
    </Suspense>
  );
} 