export async function generateMetadata() {
  const teamMembers = [
    "Dr. Jeff Richmond",
    "Todd Vitzthum",
    "Michael Krueger",
    "Param Vora",
    "Aryan Jain",
    "Karen Sielski",
    "Eric Bleau",
    "Chris Sielski",
    "Colm McEvilly"
  ];

  const description = `Meet the OZListings team: ${teamMembers.join(", ")}. A diverse team of real estate experts, legal specialists, technology leaders, marketing professionals, and investor relations specialists dedicated to connecting investors with Opportunity Zone opportunities.`;

  return {
    title: "Meet the OZListings Team | Expert Opportunity Zone Investment Professionals",
    description: description,
    openGraph: {
      title: "Meet the OZListings Team | Expert Opportunity Zone Investment Professionals",
      description: description,
      url: "https://ozlistings.com/team",
      siteName: "OZ Listings",
      images: [
        {
          url: "https://ozlistings.com/OZ-homepage.jpg",
          width: 1200,
          height: 630,
          alt: "OZ Listings Team - Opportunity Zone Investment Experts",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Meet the OZListings Team | Expert Opportunity Zone Investment Professionals",
      description: description,
      images: ["https://ozlistings.com/OZ-homepage.jpg"],
      creator: "@ozlistings",
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: "https://ozlistings.com/team",
    },
  };
}

export default function TeamLayout({ children }) {
  return children;
}

