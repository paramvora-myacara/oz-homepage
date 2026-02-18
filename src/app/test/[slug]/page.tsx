import type { Metadata } from 'next'
import ListingPageClient from '@/app/listings/[slug]/listing-page-client';
import { getLocalListingBySlug } from '@/lib/listings/local-fetcher';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const listing = await getLocalListingBySlug(slug)

    if (!listing) {
        return {
            title: 'Listing Not Found',
        }
    }

    return {
        title: `[TEST] ${listing.listingName}`,
        description: `Test page for ${listing.listingName}`,
    }
}

export default async function TestListingPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
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

    return <ListingPageClient listing={listing} slug={slug} isTestMode={true} />;
}
