"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const slides = [
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
        img: "/images/UltimateGuideOZ.jpg",
        link: "https://a.co/d/4ksFbLU",
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

export const AsFeaturedInSection = ({ heading = "As Featured in...", byline = "" }) => {
  const slide = slides.find((s) => s.isPanelSlide);

  if (!slide) return null;

  return (
    <section className="relative flex items-center justify-center w-full min-h-screen py-16 bg-white dark:bg-black">
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="px-6 pb-2 lg:pb-6 text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white mb-6">
            {heading}
          </h1>
          {byline && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
              className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
            >
              {byline}
            </motion.p>
          )}
        </motion.div>
        <div className="relative z-10 grid h-full grid-cols-1 lg:grid-cols-2 gap-4 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {slide.panels.map((panel, panelIndex) => (
            <motion.div
              key={panelIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * panelIndex, ease: "easeInOut" }}
              className={`relative flex flex-col items-center justify-center overflow-hidden rounded-lg border border-gray-700/20 bg-white/5 ${
                panelIndex === 0
                  ? "lg:col-start-1 lg:row-start-1 min-h-[400px]"
                  : panelIndex === 1
                  ? "lg:col-start-1 lg:row-start-2 min-h-[400px]"
                  : panelIndex === 2
                  ? "lg:col-start-2 lg:row-span-2 min-h-[816px]"
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}; 