import { createClient } from '../../../lib/supabase/server';

export async function generateMetadata() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('oz_webinars')
      .select('*')
      .eq('webinar_slug', '2025-11-12-colin-walsh-oz-tax')
      .single();

    if (error || !data) {
      console.error('Error fetching webinar data for metadata:', error);
      // Fallback metadata
      return {
        title: "Opportunity Zones Unlocked: The 2026 Tax Cliff and How to Beat It | OZ Listings",
        description: "Discover how to lock in OZ 1.0 benefits, protect your gains, and stay ahead of 2027 tax changes with Colin J. Walsh, J.D. from Baker Tilly.",
        openGraph: {
          title: "Opportunity Zones Unlocked: The 2026 Tax Cliff and How to Beat It | OZ Listings",
          description: "Discover how to lock in OZ 1.0 benefits, protect your gains, and stay ahead of 2027 tax changes with Colin J. Walsh, J.D. from Baker Tilly.",
          url: "https://ozlistings.com/webinars/2025-11-12-colin-walsh-oz-tax",
          siteName: "OZ Listings",
          images: [
            {
              url: "https://ozlistings.com/OZ-homepage.jpg",
              width: 1200,
              height: 630,
              alt: "OZ Listings - Opportunity Zone Investment Platform",
            },
          ],
          locale: "en_US",
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: "Opportunity Zones Unlocked: The 2026 Tax Cliff and How to Beat It | OZ Listings",
          description: "Discover how to lock in OZ 1.0 benefits, protect your gains, and stay ahead of 2027 tax changes with Colin J. Walsh, J.D. from Baker Tilly.",
          images: ["https://ozlistings.com/OZ-homepage.jpg"],
          creator: "@ozlistings",
        },
      };
    }

    // Use the dynamic banner image if available
    const bannerImage = data.banner_image_link || "https://ozlistings.com/OZ-homepage.jpg";
    
    return {
      title: `${data.webinar_title || "Opportunity Zones Unlocked: The 2026 Tax Cliff and How to Beat It"} | OZ Listings`,
      description: data.webinar_description || "Discover how to lock in OZ 1.0 benefits, protect your gains, and stay ahead of 2027 tax changes with Colin J. Walsh, J.D. from Baker Tilly.",
      openGraph: {
        title: `${data.webinar_title || "Opportunity Zones Unlocked: The 2026 Tax Cliff and How to Beat It"} | OZ Listings`,
        description: data.webinar_description || "Discover how to lock in OZ 1.0 benefits, protect your gains, and stay ahead of 2027 tax changes with Colin J. Walsh, J.D. from Baker Tilly.",
        url: "https://ozlistings.com/webinars/2025-11-12-colin-walsh-oz-tax",
        siteName: "OZ Listings",
        images: [
          {
            url: bannerImage,
            width: 1200,
            height: 630,
            alt: data.webinar_title || "Opportunity Zones Unlocked: The 2026 Tax Cliff and How to Beat It",
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${data.webinar_title || "Opportunity Zones Unlocked: The 2026 Tax Cliff and How to Beat It"} | OZ Listings`,
        description: data.webinar_description || "Discover how to lock in OZ 1.0 benefits, protect your gains, and stay ahead of 2027 tax changes with Colin J. Walsh, J.D. from Baker Tilly.",
        images: [bannerImage],
        creator: "@ozlistings",
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    // Fallback metadata
    return {
      title: "Opportunity Zones Unlocked: The 2026 Tax Cliff and How to Beat It | OZ Listings",
      description: "Discover how to lock in OZ 1.0 benefits, protect your gains, and stay ahead of 2027 tax changes with Colin J. Walsh, J.D. from Baker Tilly.",
      openGraph: {
        title: "Opportunity Zones Unlocked: The 2026 Tax Cliff and How to Beat It | OZ Listings",
        description: "Discover how to lock in OZ 1.0 benefits, protect your gains, and stay ahead of 2027 tax changes with Colin J. Walsh, J.D. from Baker Tilly.",
        url: "https://ozlistings.com/webinars/2025-11-12-colin-walsh-oz-tax",
        siteName: "OZ Listings",
        images: [
          {
            url: "https://ozlistings.com/OZ-homepage.jpg",
            width: 1200,
            height: 630,
            alt: "OZ Listings - Opportunity Zone Investment Platform",
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "Opportunity Zones Unlocked: The 2026 Tax Cliff and How to Beat It | OZ Listings",
        description: "Discover how to lock in OZ 1.0 benefits, protect your gains, and stay ahead of 2027 tax changes with Colin J. Walsh, J.D. from Baker Tilly.",
        images: ["https://ozlistings.com/OZ-homepage.jpg"],
        creator: "@ozlistings",
      },
    };
  }
}

export default function WebinarLayout({ children }) {
  return children;
}

