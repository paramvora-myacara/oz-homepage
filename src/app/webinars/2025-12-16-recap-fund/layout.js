import { createClient } from '../../../lib/supabase/server';

export async function generateMetadata() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('oz_webinars')
      .select('*')
      .eq('webinar_slug', '2025-12-16-recap-fund')
      .single();

    if (error || !data) {
      console.error('Error fetching webinar data for metadata:', error);
      // Fallback metadata
      return {
        title: "The ReCap Strategy: How to Secure Immediate Cash Flow & Built-In Equity in Opportunity Zones | OZ Listings",
        description: "Join us for an exclusive webinar where we reveal the ReCap Fund—a new one-of-a-kind strategic approach designed to capitalize on the current debt cycle by acquiring assets below replacement cost.",
        openGraph: {
          title: "The ReCap Strategy: How to Secure Immediate Cash Flow & Built-In Equity in Opportunity Zones | OZ Listings",
          description: "Join us for an exclusive webinar where we reveal the ReCap Fund—a new one-of-a-kind strategic approach designed to capitalize on the current debt cycle by acquiring assets below replacement cost.",
          url: "https://ozlistings.com/webinars/2025-12-16-recap-fund",
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
          title: "The ReCap Strategy: How to Secure Immediate Cash Flow & Built-In Equity in Opportunity Zones | OZ Listings",
          description: "Join us for an exclusive webinar where we reveal the ReCap Fund—a new one-of-a-kind strategic approach designed to capitalize on the current debt cycle by acquiring assets below replacement cost.",
          images: ["https://ozlistings.com/OZ-homepage.jpg"],
          creator: "@ozlistings",
        },
      };
    }

    // Use the dynamic banner image if available
    const bannerImage = data.banner_image_link || "https://ozlistings.com/OZ-homepage.jpg";
    
    return {
      title: `${data.webinar_title || "The ReCap Strategy: How to Secure Immediate Cash Flow & Built-In Equity in Opportunity Zones"} | OZ Listings`,
      description: data.webinar_description || "Join us for an exclusive webinar where we reveal the ReCap Fund—a new one-of-a-kind strategic approach designed to capitalize on the current debt cycle by acquiring assets below replacement cost.",
      openGraph: {
        title: `${data.webinar_title || "The ReCap Strategy: How to Secure Immediate Cash Flow & Built-In Equity in Opportunity Zones"} | OZ Listings`,
        description: data.webinar_description || "Join us for an exclusive webinar where we reveal the ReCap Fund—a new one-of-a-kind strategic approach designed to capitalize on the current debt cycle by acquiring assets below replacement cost.",
        url: "https://ozlistings.com/webinars/2025-12-16-recap-fund",
        siteName: "OZ Listings",
        images: [
          {
            url: bannerImage,
            width: 1200,
            height: 630,
            alt: data.webinar_title || "The ReCap Strategy: How to Secure Immediate Cash Flow & Built-In Equity in Opportunity Zones",
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${data.webinar_title || "The ReCap Strategy: How to Secure Immediate Cash Flow & Built-In Equity in Opportunity Zones"} | OZ Listings`,
        description: data.webinar_description || "Join us for an exclusive webinar where we reveal the ReCap Fund—a new one-of-a-kind strategic approach designed to capitalize on the current debt cycle by acquiring assets below replacement cost.",
        images: [bannerImage],
        creator: "@ozlistings",
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    // Fallback metadata
    return {
      title: "The ReCap Strategy: How to Secure Immediate Cash Flow & Built-In Equity in Opportunity Zones | OZ Listings",
      description: "Join us for an exclusive webinar where we reveal the ReCap Fund—a new one-of-a-kind strategic approach designed to capitalize on the current debt cycle by acquiring assets below replacement cost.",
      openGraph: {
        title: "The ReCap Strategy: How to Secure Immediate Cash Flow & Built-In Equity in Opportunity Zones | OZ Listings",
        description: "Join us for an exclusive webinar where we reveal the ReCap Fund—a new one-of-a-kind strategic approach designed to capitalize on the current debt cycle by acquiring assets below replacement cost.",
        url: "https://ozlistings.com/webinars/2025-12-16-recap-fund",
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
        title: "The ReCap Strategy: How to Secure Immediate Cash Flow & Built-In Equity in Opportunity Zones | OZ Listings",
        description: "Join us for an exclusive webinar where we reveal the ReCap Fund—a new one-of-a-kind strategic approach designed to capitalize on the current debt cycle by acquiring assets below replacement cost.",
        images: ["https://ozlistings.com/OZ-homepage.jpg"],
        creator: "@ozlistings",
      },
    };
  }
}

export default function WebinarLayout({ children }) {
  return children;
}

