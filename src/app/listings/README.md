# OZ Listings Page

A modern, responsive listings page for Opportunity Zone investments with comprehensive filtering, analytics tracking, and promotional features.

## Features Implemented

### ✅ Authentication & Security
- Protected route requiring user authentication
- Automatic redirect to login with return path preservation
- Integrated with existing middleware protection system

### ✅ Analytics & Tracking
- Page view tracking (`viewed_listings` event)
- Listing click tracking (`listing_clicked` event) 
- Promotional inquiry tracking (`listing_inquiry_started`, `listing_inquiry_submitted`)
- Reuses existing Supabase analytics infrastructure

### ✅ Data & Filtering
- Mock data with all required fields (id, title, state, irr, min_investment, ten_year_multiple, image_url, summary)
- Real-time client-side filtering (no page reloads)
- URL state management for shareable filtered links
- Prepared for easy migration to Supabase backend

### ✅ Responsive UI & UX
- **Desktop**: Fixed sidebar with auto-flowing card grid
- **Mobile**: Collapsible drawer with single/dual column layout
- **Accessibility**: WCAG-AA compliant, keyboard navigable, proper focus management
- **Performance**: Hardware-accelerated animations, optimized images

### ✅ Filter System
- **Location**: Multi-select dropdown for all 50 states + DC with search
- **IRR**: Range buckets (< 10%, 10-15%, 15-20%, > 20%)
- **Min Investment**: Range buckets (< $50k, $50k-$100k, $100k-$250k, > $250k)
- **10-Year Multiple**: Range buckets (< 2x, 2x-3x, 3x-4x, > 4x)

### ✅ Listing Cards
- **Image**: 16:9 aspect ratio with hover scaling and error handling
- **Hover Effects**: Summary overlay with backdrop blur
- **Metrics Display**: IRR, Min Investment, 10-Year Multiple, Location
- **Accessibility**: Proper alt text, keyboard navigation, screen reader support

### ✅ Promotional Features
- "Your OZ Listing Here" card integrated in grid
- Contact form with prefilled user data from auth
- Submission to existing calendar/booking endpoint
- Complete analytics tracking workflow

### ✅ Modern Design System
- Consistent with existing brand theming (light/dark mode)
- Glassmorphism effects and smooth animations
- Apple-style typography and spacing
- Custom scrollbars and focus states

## File Structure

```
src/app/listings/
├── page.js                 # Main listings page component
├── mockData.js             # Mock data and filter options
├── utils/
│   └── fetchListings.js    # Data fetching helper (ready for Supabase)
└── components/
    ├── ListingCard.js      # Individual listing card
    ├── FilterSidebar.js    # Responsive filter sidebar
    └── PromotionalCard.js  # "Your OZ Listing Here" card
```

## Usage

Navigate to `/listings` (requires authentication). The page will:

1. Track page view analytics
2. Display 4 large listing cards + promotional card
3. Allow filtering via sidebar (desktop) or drawer (mobile)
4. Update URL with filter state for shareable links
5. Track all user interactions

## Grid Size Options

- **Large**: 1-2-3-4 columns (default for 4 cards)
- **Medium**: 1-2-3-4 columns (more cards)
- **Small**: 1-2-3-4-5 columns (many cards)

## Future Enhancements

1. **Backend Integration**: Replace `fetchListings()` with Supabase queries
2. **Detail Pages**: Individual listing detail views
3. **Favorites**: User-specific saved listings
4. **Search**: Text search across listing titles and descriptions
5. **Maps**: Geographic visualization of listings
6. **Pagination**: Handle large datasets efficiently

## Technical Notes

- Uses Next.js App Router with client-side state management
- Responsive breakpoints follow existing Tailwind configuration
- All animations are hardware-accelerated for performance
- Image optimization through Next.js Image component
- Form submissions integrate with existing API endpoints
- Analytics events use existing Supabase user_events table 