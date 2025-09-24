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
        img: "/images/book-landing-page/oz-book-ecover-flat.png",
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

export const AsFeaturedInSection = ({ heading = "As Featured in...", byline = "" }) => {
  const slide = slides.find((s) => s.isPanelSlide);

  if (!slide) return null;

  return (
    <section className="relative flex items-center justify-center w-full min-h-screen py-16 overflow-hidden">
      {/* Premium Aristocratic Background (matching Upcoming Events) */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950/40"></div>

        {/* Elegant geometric pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(30deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5),
              linear-gradient(150deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5),
              linear-gradient(30deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5),
              linear-gradient(150deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5)
            `,
            backgroundSize: '80px 140px',
            backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px'
          }}></div>
        </div>

        {/* Sophisticated radial overlays */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-1/3 h-1/2 bg-gradient-radial from-blue-100/20 via-transparent to-transparent dark:from-blue-900/10"></div>
          <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-radial from-indigo-100/15 via-transparent to-transparent dark:from-indigo-900/8"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2/3 h-1/3 bg-gradient-radial from-slate-100/25 via-transparent to-transparent dark:from-slate-800/15"></div>
        </div>

        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02] mix-blend-overlay">
          <div className="absolute inset-0" style={{
            backgroundImage: `url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")`,
          }}></div>
        </div>
      </div>

      <div className="relative h-full w-full bg-transparent overflow-hidden">
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
        <div className="relative z-10 grid h-full grid-cols-1 lg:grid-cols-2 gap-4 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto backdrop-blur-sm/0">
          {slide.panels.map((panel, panelIndex) => (
            <motion.div
              key={panelIndex}
              initial={{ opacity: 0, y: 20, ...(panel.type === "book" ? { scale: 0.85 } : {}) }}
              whileInView={{ opacity: 1, y: 0, ...(panel.type === "book" ? { scale: 1 } : {}) }}
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