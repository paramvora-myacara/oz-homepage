"use client";
import { useSearchParams } from 'next/navigation';
import { AsFeaturedInSection } from '../components/AsFeaturedInSection';

export default function MiscPage() {
  const searchParams = useSearchParams();
  const heading = searchParams.get('heading') || "As Featured in...";

  return (
    <div className="pt-20">
      <AsFeaturedInSection heading={heading} />
    </div>
  );
} 