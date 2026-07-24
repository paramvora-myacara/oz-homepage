import { notFound } from 'next/navigation';
import { getListingForViewer } from '@/lib/supabase/listings';
import DetailPageClient from './detail-page-client';
import { toCamelCase } from '@/utils/helpers';
import { Listing } from '@/types/listing';
import type { ListingDetail } from './detail-page-client';

export default async function DetailPage({ params }: { params: Promise<{ slug: string, detailPage: string }> }) {
  const { slug, detailPage } = await params;
  const listing = await getListingForViewer(slug);

  if (!listing) {
    notFound();
  }

  const camelCasePage = toCamelCase(detailPage) as keyof Listing['details'];
  const pageData = listing.details[camelCasePage];

  // If page data doesn't exist (for optional pages), show 404
  if (!pageData) {
    notFound();
  }

  return <DetailPageClient listing={listing} pageData={pageData as ListingDetail} slug={slug} camelCasePage={camelCasePage} />;
}