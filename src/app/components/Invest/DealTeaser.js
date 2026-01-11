'use client';
import { useAuth } from '../../../lib/auth/AuthProvider';
import { useAuthModal } from '../../contexts/AuthModalContext';
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
    summary: " iconic mixed-use redevelopment project capitalizing on Wynwood's tourism and retail density.",
    slug: "wynwood-arts"
  }
];

export default function DealTeaser() {
  const { user } = useAuth();
  const { openModal } = useAuthModal();

  return (
    <section className="py-12 md:py-20 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 text-navy dark:text-white">Curated Institutional-Grade Assets</h2>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                    Exclusive off-market opportunities vetted for maximum tax efficiency and principal safety.
                </p>
            </div>
            {user && (
                 <a href="/listings" className="text-primary font-semibold hover:underline flex items-center gap-2">
                    View All Opportunities &rarr;
                 </a>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SAMPLE_LISTINGS.map(listing => (
            <div key={listing.id} className="relative group">
              {/* Blur Overlay if not logged in */}
              <div className="relative">
                 <div className={!user ? "blur-[6px] pointer-events-none select-none" : ""}>
                    <ListingCard listing={listing} />
                 </div>
                 
                 {!user && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-black/5 dark:bg-black/40 rounded-2xl">
                       <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl text-center border border-gray-200 dark:border-gray-700 max-w-xs transform group-hover:scale-105 transition-transform duration-300">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-6 h-6 text-primary" />
                          </div>
                          <h3 className="font-bold text-lg text-navy dark:text-white mb-2">Private Opportunity</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                             Join our network of accredited investors to unlock full deal details.
                          </p>
                          <button 
                            onClick={() => openModal()}
                            className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-600 transition-colors shadow-lg shadow-primary/25"
                          >
                             Login to View
                          </button>
                       </div>
                    </div>
                 )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
