"use client";
import Image from "next/image";
import { trackUserEvent } from "../../lib/analytics/trackUserEvent";
import { useAuthModal } from "../contexts/AuthModalContext";
import { useAuth } from "../../lib/auth/AuthProvider";
import { useEffect, useState } from "react";
import { ThankYouModal } from "./ThankYouModal";
import { motion } from "framer-motion";
import { AsFeaturedInSection } from "./AsFeaturedInSection";

const slides = [
  {
    title: "The Legal Hack the Wealthy Use to Eliminate Capital Gains Taxes",
    img: "/images/community-page/Webinar12-08-25v2.png",
    details: "Discover how OZ Listings transforms Opportunity Zone investing",
    link: "/community",
    layout: "webinar",
    webinarDate: "August 12, 2025",
    webinarTime: "Tuesday, 6:00 PM PT",
    buttonText: "Sign Up Now",
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
        img: "/images/NewBookCover.jpg",
        link: "/book",
      },
      {
        type: "podcast",
        title: "Podcast: OZ Success Stories",
        videoId: "km-Zw81nJ60",
        img: "/images/isaac-quesada-s34TlUTPIf4-unsplash.jpg",
        link: "/market/denver",
      },
    ],
  },
];

const openInNewTab = (url) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

export const UpcomingEvents = () => {
  const { openModal } = useAuthModal();
  const { user } = useAuth();
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const slide = slides.find((s) => s.layout === "webinar");

  useEffect(() => {
    const hasSignedUp = localStorage.getItem("webinar_signed_up");
    const urlParams = new URLSearchParams(window.location.search);
    const cameFromSignupFlow = urlParams.get("webinar_signup") === "true";

    if (cameFromSignupFlow && user) {
      trackUserEvent("webinar_signup", { userId: user.id, source: "auth_redirect_webinar_signup", timestamp: new Date().toISOString() });
      setIsSignedUp(true);
      setShowThankYouModal(true);
      localStorage.setItem("webinar_signed_up", "true");
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (hasSignedUp && user) {
      setIsSignedUp(true);
    } else {
      setIsSignedUp(false);
    }
  }, [user]);

  const handleWebinarSignUp = () => {
    if (user) {
      trackUserEvent("webinar_signup", { userId: user.id, source: "community_slideshow_button", timestamp: new Date().toISOString() });
      setIsSignedUp(true);
      setShowThankYouModal(true);
      localStorage.setItem("webinar_signed_up", "true");
    } else {
      openModal({
        title: "Join Our Exclusive Community",
        description:
          "Sign in to join the OZ Marketplace and get access to exclusive deals and insights.\\n\\n🔐 Password-free login\\n✨ One-time signup, lifetime access",
        redirectTo: "/community?webinar_signup=true",
      });
    }
  };

  if (!slide) return null;

  const date = new Date(slide.webinarDate);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });

  return (
    <section className="relative flex items-center justify-center w-full h-auto min-h-screen">
      <ThankYouModal show={showThankYouModal} onClose={() => setShowThankYouModal(false)} />
      <div className="h-full w-full flex flex-col">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="px-6 pt-20 pb-2 lg:pb-6 text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight">
            <span className="text-gray-900 dark:text-white dark:drop-shadow-lg">
              Upcoming Event
            </span>
          </h1>
        </motion.div>
        <div className="flex-grow flex flex-col lg:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-full lg:w-[30%] bg-white dark:bg-black text-black dark:text-white flex flex-col justify-center items-center lg:items-start p-6 md:p-12 text-center lg:text-left order-2 lg:order-1"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{slide.title}</h2>
            <div className="w-full text-left mb-8">
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-800 lg:bg-transparent lg:dark:bg-transparent lg:p-0">
                <div className="text-7xl font-extrabold text-[#1e88e5]">
                  {day}
                </div>
                <div className="flex flex-col">
                  <div className="text-3xl font-bold text-[#1e88e5]">
                    {month}
                  </div>
                  <div className="text-xl font-medium text-gray-500 dark:text-gray-400">
                    {slide.webinarTime}
                  </div>
                </div>
              </div>
            </div>
            <button
              className={`rounded-full px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 ${isSignedUp ? 'bg-green-600' : 'bg-[#1e88e5] hover:bg-[#1976d2]'}`}
              onClick={() => {
                if (isSignedUp) {
                  setShowThankYouModal(true);
                } else if (slide.link === "/community") {
                  handleWebinarSignUp();
                } else if (slide.link.startsWith("http")) {
                  openInNewTab(slide.link);
                } else {
                  window.location.href = slide.link;
                }
              }}
            >
              {isSignedUp ? "You're In" : slide.buttonText}
            </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-full lg:w-[70%] bg-white dark:bg-black p-6 md:p-12 flex items-center justify-center order-1 lg:order-2"
          >
            <div className="relative w-full h-[40vh] md:h-[60vh]">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image
                  src={slide.img}
                  alt={slide.title}
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 1024px) 100vw, 70vw"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export const CommunityResources = () => {
  return <AsFeaturedInSection patternStrength="strong" />;
};

const SectionContent = () => {
  return (
    <div className="flex flex-col">
      {/* <UpcomingEvents /> */}
      
    </div>
  );
};

export default SectionContent;
