import { notFound } from 'next/navigation';
import { getLocalListingBySlug } from '@/lib/listings/local-fetcher';
import DetailPageClient from '@/app/listings/[slug]/details/[detailPage]/detail-page-client';
import { toCamelCase } from '@/utils/helpers';
import { Listing } from '@/types/listing';
import type { ListingDetail } from '@/app/listings/[slug]/details/[detailPage]/detail-page-client';

export default async function TestDetailPage({ params }: { params: Promise<{ slug: string, detailPage: string }> }) {
    const { slug, detailPage } = await params;
    const listing = await getLocalListingBySlug(slug);

    if (!listing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
                <h1 className="text-2xl font-bold">Listing not found in src/lib/listings/</h1>
                <p className="text-gray-600">Make sure you have a file named <code>{slug}.json</code> in that directory.</p>
                <a href="/" className="text-blue-500 hover:underline">Go Home</a>
            </div>
        );
    }

    const camelCasePage = toCamelCase(detailPage) as keyof Listing['details'];
    const pageData = listing.details[camelCasePage];

    // If page data doesn't exist (for optional pages), show 404
    if (!pageData) {
        notFound();
    }

    return <DetailPageClient listing={listing} pageData={pageData as ListingDetail} slug={slug} camelCasePage={camelCasePage} isTestMode={true} />;
}
