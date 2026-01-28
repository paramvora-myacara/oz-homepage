import { createClient } from '../../../lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('oz_webinars')
      .select('*')
      .eq('webinar_slug', '2026-01-27-alden-brockton')
      .single();

    if (error || !data) {
      console.error('Error fetching webinar data for metadata:', error);
      // Fallback metadata
      return {
        title: "Exclusive Opportunity Zone Investments in MA [Accredited Investors Only] | OZ Listings",
        description: "Learn why projects like 'The Alden' in Brockton, MA are generating so much interest in the UHNWI and family office space. Join OZ Listings for an exclusive live webinar featuring The Alden, a fully entitled, transit-oriented Opportunity Zone development.",
        openGraph: {
          title: "Exclusive Opportunity Zone Investments in MA [Accredited Investors Only] | OZ Listings",
          description: "Learn why projects like 'The Alden' in Brockton, MA are generating so much interest in the UHNWI and family office space.",
          url: "https://ozlistings.com/webinars/2026-01-27-alden-brockton",
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
          title: "Exclusive Opportunity Zone Investments in MA [Accredited Investors Only] | OZ Listings",
          description: "Learn why projects like 'The Alden' in Brockton, MA are generating so much interest in the UHNWI and family office space.",
          images: ["https://ozlistings.com/OZ-homepage.jpg"],
          creator: "@ozlistings",
        },
      };
    }

    // Use the dynamic banner image if available
    const bannerImage = data.banner_image_link || "https://ozlistings.com/OZ-homepage.jpg";
    
    return {
      title: `${data.webinar_title || "Exclusive Opportunity Zone Investments in MA [Accredited Investors Only]"} | OZ Listings`,
      description: data.webinar_description || "Learn why projects like 'The Alden' in Brockton, MA are generating so much interest in the UHNWI and family office space. Join OZ Listings for an exclusive live webinar featuring The Alden, a fully entitled, transit-oriented Opportunity Zone development.",
      openGraph: {
        title: `${data.webinar_title || "Exclusive Opportunity Zone Investments in MA [Accredited Investors Only]"} | OZ Listings`,
        description: data.webinar_description || "Learn why projects like 'The Alden' in Brockton, MA are generating so much interest in the UHNWI and family office space.",
        url: "https://ozlistings.com/webinars/2026-01-27-alden-brockton",
        siteName: "OZ Listings",
        images: [
          {
            url: bannerImage,
            width: 1200,
            height: 630,
            alt: data.webinar_title || "Exclusive Opportunity Zone Investments in MA [Accredited Investors Only]",
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${data.webinar_title || "Exclusive Opportunity Zone Investments in MA [Accredited Investors Only]"} | OZ Listings`,
        description: data.webinar_description || "Learn why projects like 'The Alden' in Brockton, MA are generating so much interest in the UHNWI and family office space.",
        images: [bannerImage],
        creator: "@ozlistings",
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    // Fallback metadata
    return {
      title: "Exclusive Opportunity Zone Investments in MA [Accredited Investors Only] | OZ Listings",
      description: "Learn why projects like 'The Alden' in Brockton, MA are generating so much interest in the UHNWI and family office space. Join OZ Listings for an exclusive live webinar featuring The Alden, a fully entitled, transit-oriented Opportunity Zone development.",
      openGraph: {
        title: "Exclusive Opportunity Zone Investments in MA [Accredited Investors Only] | OZ Listings",
        description: "Learn why projects like 'The Alden' in Brockton, MA are generating so much interest in the UHNWI and family office space.",
        url: "https://ozlistings.com/webinars/2026-01-27-alden-brockton",
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
        title: "Exclusive Opportunity Zone Investments in MA [Accredited Investors Only] | OZ Listings",
        description: "Learn why projects like 'The Alden' in Brockton, MA are generating so much interest in the UHNWI and family office space.",
        images: ["https://ozlistings.com/OZ-homepage.jpg"],
        creator: "@ozlistings",
      },
    };
  }
}

export default function WebinarLayout({ children }) {
  return children;
}
