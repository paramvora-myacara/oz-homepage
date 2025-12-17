import { createClient } from '../../../lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('oz_webinars')
      .select('*')
      .eq('webinar_slug', '2025-10-28-nova-reno')
      .single();

    if (error || !data) {
      console.error('Error fetching webinar data for metadata:', error);
      // Fallback metadata
      return {
        title: "Build Wealth, Eliminate Taxes: The Nova Reno Investor Webinar | OZ Listings",
        description: "Discover how to defer, reduce, and eliminate capital gains taxes while investing in a resilient, high-demand student housing project.",
        openGraph: {
          title: "Build Wealth, Eliminate Taxes: The Nova Reno Investor Webinar | OZ Listings",
          description: "Discover how to defer, reduce, and eliminate capital gains taxes while investing in a resilient, high-demand student housing project.",
          url: "https://ozlistings.com/webinars/2025-10-28-nova-reno",
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
          title: "Build Wealth, Eliminate Taxes: The Nova Reno Investor Webinar | OZ Listings",
          description: "Discover how to defer, reduce, and eliminate capital gains taxes while investing in a resilient, high-demand student housing project.",
          images: ["https://ozlistings.com/OZ-homepage.jpg"],
          creator: "@ozlistings",
        },
      };
    }

    // Use the dynamic banner image if available
    const bannerImage = data.banner_image_link || "https://ozlistings.com/OZ-homepage.jpg";
    
    return {
      title: `${data.webinar_title || "Build Wealth, Eliminate Taxes: The Nova Reno Investor Webinar"} | OZ Listings`,
      description: data.webinar_description || "Discover how to defer, reduce, and eliminate capital gains taxes while investing in a resilient, high-demand student housing project.",
      openGraph: {
        title: `${data.webinar_title || "Build Wealth, Eliminate Taxes: The Nova Reno Investor Webinar"} | OZ Listings`,
        description: data.webinar_description || "Discover how to defer, reduce, and eliminate capital gains taxes while investing in a resilient, high-demand student housing project.",
        url: "https://ozlistings.com/webinars/2025-10-28-nova-reno",
        siteName: "OZ Listings",
        images: [
          {
            url: bannerImage,
            width: 1200,
            height: 630,
            alt: data.webinar_title || "Build Wealth, Eliminate Taxes: The Nova Reno Investor Webinar",
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${data.webinar_title || "Build Wealth, Eliminate Taxes: The Nova Reno Investor Webinar"} | OZ Listings`,
        description: data.webinar_description || "Discover how to defer, reduce, and eliminate capital gains taxes while investing in a resilient, high-demand student housing project.",
        images: [bannerImage],
        creator: "@ozlistings",
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    // Fallback metadata
    return {
      title: "Build Wealth, Eliminate Taxes: The Nova Reno Investor Webinar | OZ Listings",
      description: "Discover how to defer, reduce, and eliminate capital gains taxes while investing in a resilient, high-demand student housing project.",
      openGraph: {
        title: "Build Wealth, Eliminate Taxes: The Nova Reno Investor Webinar | OZ Listings",
        description: "Discover how to defer, reduce, and eliminate capital gains taxes while investing in a resilient, high-demand student housing project.",
        url: "https://ozlistings.com/webinars/2025-10-28-nova-reno",
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
        title: "Build Wealth, Eliminate Taxes: The Nova Reno Investor Webinar | OZ Listings",
        description: "Discover how to defer, reduce, and eliminate capital gains taxes while investing in a resilient, high-demand student housing project.",
        images: ["https://ozlistings.com/OZ-homepage.jpg"],
        creator: "@ozlistings",
      },
    };
  }
}

export default function WebinarLayout({ children }) {
  return children;
}
