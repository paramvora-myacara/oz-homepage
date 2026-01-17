export const metadata = {
  title: "For Developers | List Your Opportunity Zone Project | OZ Listings",
  description: "List your Opportunity Zone project on OZ Listings. We handle marketing through email campaigns, premium listings, and social media to reach qualified investors.",
  openGraph: {
    title: "For Developers | List Your Opportunity Zone Project | OZ Listings",
    description: "List your Opportunity Zone project on OZ Listings. We handle marketing through email campaigns, premium listings, and social media to reach qualified investors.",
    url: "https://ozlistings.com/developers",
    siteName: "OZ Listings",
    images: [
      {
        url: "https://ozlistings.com/OZ-homepage.jpg",
        width: 1200,
        height: 630,
        alt: "OZ Listings - For Developers",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "For Developers | List Your Opportunity Zone Project | OZ Listings",
    description: "List your Opportunity Zone project on OZ Listings. We handle marketing through email campaigns, premium listings, and social media to reach qualified investors.",
    images: ["https://ozlistings.com/OZ-homepage.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://ozlistings.com/developers",
  },
};

export default function DevelopersLayout({ children }) {
  return children;
}
