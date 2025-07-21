// Slide data for HorizontalScrollSlideshow component
export const slides = [
  {
    title: "Welcome from Jimmy Atkinson",
    img: "/images/jimmy-atkinson-founder.jpg",
    videoId: "iHBzKyrSKfI", // YouTube video ID
    details: "2-min intro to the OZ Listings mission",
    link: "/market/st-louis",
  },
  {
    title: "OZ Listings Trailer",
    img: "/images/isaac-quesada-s34TlUTPIf4-unsplash.jpg",
    videoId: "bFh8q-U3zho", // New YouTube video from the provided URL
    staticThumbnail: true, // Show only static thumbnail, not autoplay video
    details: "Discover how OZ Listings transforms Opportunity Zone investing",
    link: "/latest-updates",
  },
  {
    title: "Explore Our Resources",
    img: "/images/linkedin-cover.jpg",
    details: "Everything you need to know about Opportunity Zones",
    isPanelSlide: true, // Special flag for 4-panel layout
    panels: [
      {
        type: "linkedin",
        title: "LinkedIn Insights",
        linkedInPostId: "7352820582847004672",
        link: "https://www.linkedin.com/posts/ozlistings_oz-listings-opportunity-zone-listings-for-activity-7352820582847004672-OJuC?utm_source=share&utm_medium=member_desktop&rcm=ACoAABdmpjQBBZQAjhFM8ElF7n-6iw6weGH7FzQ",
      },
      {
        type: "book",
        title: "The OZ Investor's Guide",
        img: "/images/brett-jordan-B4-h2B-DRhs-unsplash.jpg",
        link: "https://d5bpdq04.na1.hubspotlinksstarter.com/Ctc/W6+113/d5BpDQ04/VW_brP8G1T04W2XdpHY6Hmm-BW2qd3df5yQrT7N8GDX5-5kBVzW69t95C6lZ3lLVRNKCM7PFlXQVlPJBD7p8zmPW656t1n3-pX9jW1yMK_b7H1FL9W4j8p1f7m7C2XN7s9n-DPN-W_W52h-xB2_8H3TW1gN80m3CCY47W2_THtB91jK89W2cVXnD18PlBWW1bXZjT6m6BVvVB5sBn8VHGwHW4r1wmm8LcKKRW4Bt_DM5Gm_qCW1DHRjK1QpH66W61PN756FN6vlW2d3CpJ4Ls7y0W5_V7HZ947g4RN4kXTc_8k60-W3sHcmr48Tcb4W1y5TX-3TMg4KW8GLc9f2G2YkyW2nBBPp2lpmsfW6VKXpL3Qqq5BW6xFz4V958lfXVbZdlx125LgcVTB18v20YvWRW1D0hGv3GKcs6W57mDsl1Mn6vnW6922Qs3y_26yW3-jssQ2VZxzgW4Vf9b67J5yJxW6hMrrc66pNqQW6vNXrS2JGZDfW8d55S76wC6qkVvJyx44f8PTQf33L6Nb04",
      },
      {
        type: "podcast",
        title: "Podcast: OZ Success Stories",
        videoId: "km-Zw81nJ60",
        img: "/images/isaac-quesada-s34TlUTPIf4-unsplash.jpg",
        link: "/market/denver",
      },
      {
        type: "community",
        title: "Join Our Community",
        description: "Connect with investors, developers, and OZ experts",
        link: "/join-the-community",
      },
    ],
  },
];
