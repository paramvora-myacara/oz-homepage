import { createClient } from '../../../lib/supabase/server';

export async function generateMetadata() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('oz_webinars')
      .select('*')
      .eq('webinar_slug', '2025-10-14-legal-101')
      .single();

    if (error || !data) {
      console.error('Error fetching webinar data for metadata:', error);
      // Fallback metadata
      return {
        title: "Opportunity Zones: From Legal 101 to OZ 2.0 | OZ Listings",
        description: "Protect your legacy, avoid IRS traps, and unlock tax-free growth with bulletproof OZ deal structures. Learn from Michael Krueger, one of the nation's top OZ attorneys.",
        openGraph: {
          title: "Opportunity Zones: From Legal 101 to OZ 2.0 | OZ Listings",
          description: "Protect your legacy, avoid IRS traps, and unlock tax-free growth with bulletproof OZ deal structures.",
          url: "https://ozlistings.com/webinars/2025-10-14-legal-101",
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
          title: "Opportunity Zones: From Legal 101 to OZ 2.0 | OZ Listings",
          description: "Protect your legacy, avoid IRS traps, and unlock tax-free growth with bulletproof OZ deal structures.",
          images: ["https://ozlistings.com/OZ-homepage.jpg"],
          creator: "@ozlistings",
        },
      };
    }

    // Use the dynamic banner image if available
    const bannerImage = data.banner_image_link || "https://ozlistings.com/OZ-homepage.jpg";
    
    return {
      title: `${data.webinar_title || "Opportunity Zones: From Legal 101 to OZ 2.0"} | OZ Listings`,
      description: data.webinar_description || "Protect your legacy, avoid IRS traps, and unlock tax-free growth with bulletproof OZ deal structures. Learn from Michael Krueger, one of the nation's top OZ attorneys.",
      openGraph: {
        title: `${data.webinar_title || "Opportunity Zones: From Legal 101 to OZ 2.0"} | OZ Listings`,
        description: data.webinar_description || "Protect your legacy, avoid IRS traps, and unlock tax-free growth with bulletproof OZ deal structures.",
        url: "https://ozlistings.com/webinars/2025-10-14-legal-101",
        siteName: "OZ Listings",
        images: [
          {
            url: bannerImage,
            width: 1200,
            height: 630,
            alt: data.webinar_title || "Opportunity Zones: From Legal 101 to OZ 2.0",
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${data.webinar_title || "Opportunity Zones: From Legal 101 to OZ 2.0"} | OZ Listings`,
        description: data.webinar_description || "Protect your legacy, avoid IRS traps, and unlock tax-free growth with bulletproof OZ deal structures.",
        images: [bannerImage],
        creator: "@ozlistings",
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    // Fallback metadata
    return {
      title: "Opportunity Zones: From Legal 101 to OZ 2.0 | OZ Listings",
      description: "Protect your legacy, avoid IRS traps, and unlock tax-free growth with bulletproof OZ deal structures. Learn from Michael Krueger, one of the nation's top OZ attorneys.",
      openGraph: {
        title: "Opportunity Zones: From Legal 101 to OZ 2.0 | OZ Listings",
        description: "Protect your legacy, avoid IRS traps, and unlock tax-free growth with bulletproof OZ deal structures.",
        url: "https://ozlistings.com/webinars/2025-10-14-legal-101",
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
        title: "Opportunity Zones: From Legal 101 to OZ 2.0 | OZ Listings",
        description: "Protect your legacy, avoid IRS traps, and unlock tax-free growth with bulletproof OZ deal structures.",
        images: ["https://ozlistings.com/OZ-homepage.jpg"],
        creator: "@ozlistings",
      },
    };
  }
}

export default function WebinarLayout({ children }) {
  return children;
}
