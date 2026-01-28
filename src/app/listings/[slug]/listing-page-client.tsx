'use client';

import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { ViewModeToolbar } from '@/components/editor/ViewModeToolbar';
import { Listing, ListingOverviewSection } from '@/types/listing';
import HeroSection from '@/components/listing/HeroSection';
import TickerMetricsSection from '@/components/listing/TickerMetricsSection';
import CompellingReasonsSection from '@/components/listing/CompellingReasonsSection';
import ExecutiveSummarySection from '@/components/listing/ExecutiveSummarySection';
import InvestmentCardsSection from '@/components/listing/InvestmentCardsSection';
import InTheNewsSection from '@/components/listing/InTheNewsSection';
import Calculator from '@/components/listing/Calculator';
import ListingActionButtons from '@/components/listing/ListingActionButtons';
import { getProjectMetricsBySlug } from '@/lib/supabase/ozProjects';
import React from 'react'; // Added missing import for React

interface RenderableSection {
  type: string;
  component: React.ReactNode;
}

interface ListingPageClientProps {
  listing: Listing;
  slug: string;
  isEditMode?: boolean;
}

export default function ListingPageClient({ listing, slug, isEditMode = false }: ListingPageClientProps) {
  const [projectMetrics, setProjectMetrics] = useState({ projected_irr_10yr: null, equity_multiple_10yr: null, minimum_investment: null, executive_summary: null });
  const { isAdmin, canEditSlug, isLoading } = useAdminAuth();

  useEffect(() => {
    async function fetchMetrics() {
      if (slug) {
        const metrics = await getProjectMetricsBySlug(slug);
        setProjectMetrics({
          projected_irr_10yr: metrics.projected_irr_10yr ?? null,
          equity_multiple_10yr: metrics.equity_multiple_10yr ?? null,
          minimum_investment: metrics.minimum_investment ?? null,
          executive_summary: metrics.executive_summary ?? null,
        });
      }
    }
    fetchMetrics();
  }, [slug]);

  useEffect(() => {
    if (listing) {
      document.title = listing.listingName;
    }
  }, [slug]);

  const showAdminToolbar = !isLoading && isAdmin && canEditSlug(slug) && !isEditMode;

  // Handle Draft State
  if (listing.is_draft) {
    return (
      <div className="min-h-screen bg-white dark:bg-black font-sans">
        {showAdminToolbar && <ViewModeToolbar slug={slug} />}
        <div className={`max-w-4xl mx-auto px-6 py-24 text-center ${showAdminToolbar ? 'pt-32' : ''}`}>
          <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {listing.listingName}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            This listing is currently being prepared. Check back soon for detailed information, financial projections, and investment opportunities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAdmin && canEditSlug(slug) && (
              <a
                href={`/listings/${slug}/access-dd-vault`}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200"
              >
                Access Due Diligence Vault
              </a>
            )}
            <a
              href="/"
              className="px-8 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  const SectionRenderer = ({ section, sectionIndex }: { section: ListingOverviewSection; sectionIndex: number }) => {
    switch (section.type) {
      case 'hero':
        return <HeroSection
          data={section.data}
          listingSlug={slug}
          sectionIndex={sectionIndex}
          isEditMode={isEditMode}
          executiveSummary={projectMetrics.executive_summary}
          isVerifiedOzProject={listing.is_verified_oz_project}
        />;
      case 'tickerMetrics':
        return <TickerMetricsSection data={section.data} sectionIndex={sectionIndex} />;
      case 'compellingReasons':
        return <CompellingReasonsSection data={section.data} sectionIndex={sectionIndex} />;
      case 'executiveSummary':
        return <ExecutiveSummarySection data={section.data} sectionIndex={sectionIndex} />;
      case 'investmentCards':
        return <InvestmentCardsSection data={section.data} listingSlug={slug} sectionIndex={sectionIndex} />;
      default:
        return null;
    }
  };

  let hasRenderedNewsSection = false;
  const finalSectionsToRender: RenderableSection[] = [];

  listing.sections.forEach((section, idx) => {
    if (!hasRenderedNewsSection && (section.type === 'executiveSummary')) {
      // Insert the tax calculator with slider before the news section
      finalSectionsToRender.push({
        type: 'taxCalculatorGraph',
        component: <Calculator key="capital-gains-calculator" />
      });
      if (listing.newsLinks && listing.newsLinks.length > 0) {
        finalSectionsToRender.push({
          type: 'newsLinksSection',
          component: <InTheNewsSection key="in-the-news-section" newsLinks={listing.newsLinks} />
        });
        hasRenderedNewsSection = true;
      }
    }
    finalSectionsToRender.push({
      type: section.type,
      component: <SectionRenderer key={idx} section={section} sectionIndex={idx} />
    });
  });

  return (
    <div className="bg-white dark:bg-black">
      {showAdminToolbar && (
        <ViewModeToolbar slug={slug} />
      )}
      <div className={`max-w-[1920px] mx-auto ${showAdminToolbar ? 'pt-24' : ''}`}>
        {finalSectionsToRender.map((item, index) => (
          <React.Fragment key={index}>
            {item.component}
          </React.Fragment>
        ))}
        {/* Call to Action Buttons */}
        <ListingActionButtons slug={slug} />
      </div>
    </div>
  );
} 