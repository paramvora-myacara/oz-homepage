import { createClient } from '../../../lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('oz_webinars')
      .select('*')
      .eq('webinar_slug', '2026-03-05-angela-hwang')
      .single();

    if (error || !data) {
      console.error('Error fetching webinar data for metadata:', error);
      // Fallback metadata
      return {
        title: "Opportunity Zone Marketing for Sponsors Raising Capital | OZ Listings",
        description: "Sponsors in OZ deals: Learn the strategies that attract investors and boost your capital raising. Join us for an insightful webinar designed to help sponsors master the art of marketing within Opportunity Zones.",
        openGraph: {
          title: "Opportunity Zone Marketing for Sponsors Raising Capital | OZ Listings",
          description: "Sponsors in OZ deals: Learn the strategies that attract investors and boost your capital raising.",
          url: "https://ozlistings.com/webinars/2026-03-05-angela-hwang",
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
          title: "Opportunity Zone Marketing for Sponsors Raising Capital | OZ Listings",
          description: "Sponsors in OZ deals: Learn the strategies that attract investors and boost your capital raising.",
          images: ["https://ozlistings.com/OZ-homepage.jpg"],
          creator: "@ozlistings",
        },
      };
    }

    // Use the dynamic banner image if available
    const bannerImage = data.banner_image_link || "https://ozlistings.com/OZ-homepage.jpg";
    
    return {
      title: `${data.webinar_title || "Opportunity Zone Marketing for Sponsors Raising Capital"} | OZ Listings`,
      description: data.webinar_description || "Sponsors in OZ deals: Learn the strategies that attract investors and boost your capital raising. Join us for an insightful webinar designed to help sponsors master the art of marketing within Opportunity Zones.",
      openGraph: {
        title: `${data.webinar_title || "Opportunity Zone Marketing for Sponsors Raising Capital"} | OZ Listings`,
        description: data.webinar_description || "Sponsors in OZ deals: Learn the strategies that attract investors and boost your capital raising.",
        url: "https://ozlistings.com/webinars/2026-03-05-angela-hwang",
        siteName: "OZ Listings",
        images: [
          {
            url: bannerImage,
            width: 1200,
            height: 630,
            alt: data.webinar_title || "Opportunity Zone Marketing for Sponsors Raising Capital",
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${data.webinar_title || "Opportunity Zone Marketing for Sponsors Raising Capital"} | OZ Listings`,
        description: data.webinar_description || "Sponsors in OZ deals: Learn the strategies that attract investors and boost your capital raising.",
        images: [bannerImage],
        creator: "@ozlistings",
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    // Fallback metadata
    return {
      title: "Opportunity Zone Marketing for Sponsors Raising Capital | OZ Listings",
      description: "Sponsors in OZ deals: Learn the strategies that attract investors and boost your capital raising. Join us for an insightful webinar designed to help sponsors master the art of marketing within Opportunity Zones.",
      openGraph: {
        title: "Opportunity Zone Marketing for Sponsors Raising Capital | OZ Listings",
        description: "Sponsors in OZ deals: Learn the strategies that attract investors and boost your capital raising.",
        url: "https://ozlistings.com/webinars/2026-03-05-angela-hwang",
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
        title: "Opportunity Zone Marketing for Sponsors Raising Capital | OZ Listings",
        description: "Sponsors in OZ deals: Learn the strategies that attract investors and boost your capital raising.",
        images: ["https://ozlistings.com/OZ-homepage.jpg"],
        creator: "@ozlistings",
      },
    };
  }
}

export default function WebinarLayout({ children }) {
  return children;
}
