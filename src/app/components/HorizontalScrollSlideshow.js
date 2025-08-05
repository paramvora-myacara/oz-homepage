"use client";
import Image from "next/image";
import { trackUserEvent } from "../../lib/analytics/trackUserEvent";
import { useAuthModal } from "../contexts/AuthModalContext";
import { useAuth } from "../../lib/auth/AuthProvider";
import { useEffect, useState } from "react";
import { ThankYouModal } from "./ThankYouModal";

const slides = [
  {
    title: "The Legal Hack the Wealthy Use to Eliminate Capital Gains Taxes",
    img: "/images/community-page/Webinar12-08-25v1.png",
    details: "Discover how OZ Listings transforms Opportunity Zone investing",
    link: "/community",
    layout: "webinar",
    webinarDate: "September 12, 2025",
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
      trackUserEvent("webinar_signup", { userId: user.id });
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
      trackUserEvent("webinar_signup", { userId: user.id });
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

  return (
    <section className="relative flex items-center justify-center w-full h-auto min-h-screen">
      <ThankYouModal show={showThankYouModal} onClose={() => setShowThankYouModal(false)} />
      <div className="h-full w-full flex flex-col">
        <div className="px-6 pt-20 pb-2 lg:pb-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight">
            <span className="text-gray-900 dark:text-white dark:drop-shadow-lg">
              Upcoming Event
            </span>
          </h1>
        </div>
        <div className="flex-grow flex flex-col lg:flex-row">
          <div className="w-full lg:w-[30%] bg-white dark:bg-black text-black dark:text-white flex flex-col justify-center items-center lg:items-start p-6 md:p-12 text-center lg:text-left order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{slide.title}</h2>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 md:p-6 rounded-xl mb-8">
              <p className="text-xl md:text-2xl font-semibold">
                {slide.webinarDate}
              </p>
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
          </div>
          <div className="w-full lg:w-[70%] bg-white dark:bg-black p-6 md:p-12 flex items-center justify-center order-1 lg:order-2">
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
          </div>
        </div>
      </div>
    </section>
  );
};

export const CommunityResources = () => {
  const slide = slides.find((s) => s.isPanelSlide);

  if (!slide) return null;

  return (
    <section className="relative flex items-center justify-center w-full h-screen">
      <div className="relative h-full w-full bg-white dark:bg-gray-900 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #1e88e5 0%, transparent 50%),
                                        radial-gradient(circle at 75% 75%, #42a5f5 0%, transparent 50%)`,
            }}
          />
        </div>
        <div className="relative z-10 grid h-full grid-cols-1 lg:grid-cols-2 gap-4 p-4 md:p-6 lg:p-8">
          {slide.panels.map((panel, panelIndex) => (
            <div
              key={panelIndex}
              className={`relative flex flex-col items-center justify-center overflow-hidden rounded-lg border border-gray-700/20 bg-white/5 ${
                panelIndex === 0
                  ? "lg:col-start-1 lg:row-start-1"
                  : panelIndex === 1
                  ? "lg:col-start-1 lg:row-start-2"
                  : panelIndex === 2
                  ? "lg:col-start-2 lg:row-span-2"
                  : ""
              }`}
            >
              {panel.type === "linkedin" && (
                <>
                  <iframe
                    src={`https://www.linkedin.com/embed/feed/update/urn:li:activity:${panel.linkedInPostId}`}
                    className="h-full w-full border-0"
                    title="LinkedIn post"
                    style={{ minHeight: 200, background: "#fff" }}
                  />
                  <div className="absolute top-3 left-3 rounded bg-black/80 px-3 py-1 text-sm text-white">
                    {panel.title}
                  </div>
                </>
              )}
              {panel.type === "book" && (
                <>
                  <Image
                    src={panel.img}
                    alt={panel.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <h3 className="mb-2 text-lg md:text-xl font-bold text-white">
                      {panel.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-200">
                      #1 Book on Opportunity Zones
                    </p>
                  </div>
                </>
              )}
              {panel.type === "podcast" && (
                <>
                  <Image
                    src={`https://img.youtube.com/vi/${panel.videoId}/maxresdefault.jpg`}
                    alt={panel.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-black/60" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full bg-red-600 opacity-90 shadow-2xl">
                      <div className="ml-1 h-0 w-0 border-t-[8px] border-b-[8px] border-l-[12px] md:border-t-[10px] md:border-b-[10px] md:border-l-[16px] border-t-transparent border-b-transparent border-l-white"></div>
                    </div>
                  </div>
                  <div className="absolute right-3 bottom-3 left-3 text-center text-sm md:text-base text-white">
                    {panel.title}
                  </div>
                </>
              )}
              <button
                className="absolute inset-0 z-10"
                style={{ background: "transparent" }}
                onClick={async () => {
                  if (panel.type === "podcast" && panel.videoId) {
                    openInNewTab(
                      `https://www.youtube.com/watch?v=${panel.videoId}`
                    );
                  } else {
                    openInNewTab(panel.link);
                  }
                }}
                aria-label={`Go to ${panel.title}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SectionContent = () => {
  return (
    <div className="flex flex-col">
      <UpcomingEvents />
      <CommunityResources />
    </div>
  );
};

export default SectionContent;
