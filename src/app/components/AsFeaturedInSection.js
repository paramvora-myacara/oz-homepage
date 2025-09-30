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
        type: "podcast",
        title: "Podcast: OZ Success Stories",
        videoId: "km-Zw81nJ60",
        img: "/images/isaac-quesada-s34TlUTPIf4-unsplash.jpg",
        link: "/market/denver",
      },
      {
        type: "book",
        title: "The OZ Investor's Guide",
        img: "/images/book-landing-page/oz-book-ecover-paperback-right.png",
        link: "/book",
      },
    ],
  },
];

const openInNewTab = (url) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

export const AsFeaturedInSection = ({ heading = "As Featured in...", byline = "", patternStrength = "normal" }) => {
  const slide = slides.find((s) => s.isPanelSlide);

  if (!slide) return null;

  return (
    <section className="relative flex items-center justify-center w-full min-h-[85vh] pt-10 pb-20 md:pb-24 overflow-hidden">
      {/* Premium Aristocratic Background */}
      <div className="absolute inset-0">
        {/* Clean base with subtle color tint */}
        <div className="absolute inset-0 bg-slate-50 dark:bg-gray-900"></div>

        {/* Elegant horizontal stripes - blue and gold alternating */}
        <div className={`absolute inset-0 ${patternStrength === "strong" ? "opacity-[0.15] dark:opacity-[0.18]" : "opacity-[0.08] dark:opacity-[0.10]"}`}>
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, #1e88e5 0px, #1e88e5 2px, transparent 2px, transparent 100px),
              repeating-linear-gradient(0deg, #D4AF37 0px, #D4AF37 1px, transparent 1px, transparent 150px)
            `,
            backgroundPosition: '0 0, 0 50px'
          }}></div>
        </div>

        {/* Sophisticated dot grid pattern */}
        <div className={`absolute inset-0 ${patternStrength === "strong" ? "opacity-[0.25] dark:opacity-[0.30]" : "opacity-[0.15] dark:opacity-[0.20]"}`}>
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at center, #1e88e5 1.5px, transparent 1.5px),
              radial-gradient(circle at center, #D4AF37 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px, 75px 75px',
            backgroundPosition: '0 0, 25px 37.5px'
          }}></div>
        </div>

        {/* Elegant cross-hatch pattern */}
        <div className={`absolute inset-0 ${patternStrength === "strong" ? "opacity-[0.10] dark:opacity-[0.12]" : "opacity-[0.06] dark:opacity-[0.08]"}`}>
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, transparent, transparent 35px, #1e88e5 35px, #1e88e5 36px, transparent 36px, transparent 70px),
              repeating-linear-gradient(-45deg, transparent, transparent 35px, #D4AF37 35px, #D4AF37 36px, transparent 36px, transparent 70px)
            `
          }}></div>
        </div>

        {/* Animated drifting color tints */}
        <div className={`absolute inset-0 ${patternStrength === "strong" ? "opacity-[0.18] dark:opacity-[0.22]" : "opacity-[0.10] dark:opacity-[0.12]"}`}>
          {/* Blue tint 1 */}
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, #1e88e5 0%, transparent 70%)',
            }}
            animate={{
              x: ['10%', '30%', '15%', '25%', '10%'],
              y: ['20%', '40%', '25%', '35%', '20%'],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Gold tint 1 */}
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)',
            }}
            animate={{
              x: ['70%', '55%', '65%', '60%', '70%'],
              y: ['60%', '75%', '65%', '70%', '60%'],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Blue tint 2 */}
          <motion.div
            className="absolute w-[450px] h-[450px] rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, #1e88e5 0%, transparent 70%)',
            }}
            animate={{
              x: ['50%', '65%', '55%', '60%', '50%'],
              y: ['10%', '25%', '15%', '20%', '10%'],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Gold tint 2 */}
          <motion.div
            className="absolute w-[550px] h-[550px] rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)',
            }}
            animate={{
              x: ['20%', '35%', '25%', '30%', '20%'],
              y: ['70%', '85%', '75%', '80%', '70%'],
            }}
            transition={{
              duration: 32,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Subtle noise texture for depth */}
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
            className="px-6 pb-0 lg:pb-2 text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white ">
            {heading}
          </h1>
          {byline && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
              className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
            >
              {byline}
            </motion.p>
          )}
        </motion.div>
        {/* Wrapper card around the entire grid */}
        <div className="relative z-10 max-w-7xl mx-auto px-3 md:px-4 lg:px-6">
          <div className="rounded-2xl border border-gray-700/20 bg-white/60 dark:bg-gray-900/30 shadow-sm backdrop-blur-md p-3 md:p-4 lg:p-6">
            <div className="grid h-full grid-cols-1 lg:grid-cols-2 gap-3">
              {slide.panels.map((panel, panelIndex) => (
                <motion.div
                  key={panelIndex}
                  initial={{ opacity: 0, y: 20, ...(panel.type === "book" ? { scale: 0.85 } : {}) }}
                  whileInView={{ opacity: 1, y: 0, ...(panel.type === "book" ? { scale: 1 } : {}) }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 * panelIndex, ease: "easeInOut" }}
                  whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.6, ease: [0.22, 0.61, 0.36, 1] } }}
                  className={`group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-gray-700/20 bg-white/5 hover:shadow-2xl transition-all duration-500 ${
                    panelIndex === 0
                      ? "lg:col-start-1 lg:row-start-1 min-h-[320px]"
                      : panelIndex === 1
                      ? "lg:col-start-1 lg:row-start-2 min-h-[320px]"
                      : panelIndex === 2
                      ? "lg:col-start-2 lg:row-span-2 min-h-[680px]"
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
                        className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.02]"
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
                        className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.02]"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-black/60" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-full bg-red-600 opacity-90 shadow-2xl">
                          <div className="ml-1 h-0 w-0 border-t-[7px] border-b-[7px] border-l-[11px] md:border-t-[9px] md:border-b-[9px] md:border-l-[14px] border-t-transparent border-b-transparent border-l-white"></div>
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
        </div>
      </div>
    </section>
  );
}; 