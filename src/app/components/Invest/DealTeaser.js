'use client';
import { useAuth } from '../../../lib/auth/AuthProvider';
import { useAuthModal } from '../../contexts/AuthModalContext';
import { useAuthNavigation } from '../../../lib/auth/useAuthNavigation';
import ListingCard from '../../listings/components/ListingCard';
import { Lock } from 'lucide-react';

// Mock Data for the Teaser
const SAMPLE_LISTINGS = [
  {
    id: "teaser-1",
    title: "Austin Heights Multifamily",
    state: "Austin, TX",
    irr: "18.5%",
    min_investment: "$50,000",
    ten_year_multiple: "2.5x",
    asset_type: "multifamily",
    image_url: null, // ListingCard handles null images with a placeholder
    summary: "Class A multifamily development in the heart of East Austin's rapid growth corridor.",
    slug: "austin-heights"
  },
  {
    id: "teaser-2",
    title: "Phoenix Logistics Hub",
    state: "Phoenix, AZ",
    irr: "16.2%",
    min_investment: "$100,000",
    ten_year_multiple: "2.2x",
    asset_type: "industrial",
    image_url: null,
    summary: "Strategic industrial logistics center adjacent to Phoenix Sky Harbor International Airport.",
    slug: "phoenix-logistics"
  },
  {
    id: "teaser-3",
    title: "Wynwood Arts District Mixed-Use",
    state: "Miami, FL",
    irr: "21.0%",
    min_investment: "$25,000",
    ten_year_multiple: "3.0x",
    asset_type: "mixed_use",
    image_url: null,
    summary: "Iconic mixed-use redevelopment project capitalizing on Wynwood's tourism and retail density.",
    slug: "wynwood-arts"
  }
];

export default function DealTeaser() {
  const { user } = useAuth();
  const { openModal } = useAuthModal();
  const { navigateWithAuth } = useAuthNavigation();

  return (
    <section className="py-12 md:py-20 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 text-navy dark:text-white">What We Do</h2>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                    We source exclusive off-market opportunities vetted for maximum tax efficiency and principal safety.
                </p>
            </div>
            {/* removed top link, moving focus to bottom CTA */}
        </div>

        <div className="relative">
            {/* Listings Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${!user ? 'blur-sm select-none pointer-events-none opacity-50' : ''}`}>
                {SAMPLE_LISTINGS.map(listing => (
                    <div key={listing.id}>
                        <ListingCard listing={listing} />
                    </div>
                ))}
            </div>

            {/* Unified Overlay for Non-Auth Users */}
            {!user && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                    <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl text-center border border-gray-200 dark:border-gray-700 mx-4 transform transition-all hover:scale-105">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Lock className="w-8 h-8 text-primary" />
                        </div>
                        <button 
                            onClick={() => navigateWithAuth('/listings')}
                            className="w-full px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary-600 transition-all shadow-lg hover:shadow-primary/25 whitespace-nowrap"
                        >
                            See Active Listings
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </section>
  );
}
