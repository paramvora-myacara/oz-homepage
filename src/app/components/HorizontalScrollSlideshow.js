"use client";
import Image from "next/image";
import { slides } from "../data/slideshowData";
import { trackUserEvent } from "../../lib/analytics/trackUserEvent";

const SectionContent = () => {
  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col">
      {slides.map((slide, index) => (
        <section
          key={index}
          className="relative flex items-center justify-center w-full h-screen"
        >
          {slide.layout === "webinar" ? (
            <div className="h-full w-full flex flex-col">
              <div className="px-6 pt-20 pb-6 text-center">
                <h1 className="text-5xl font-black tracking-tight md:text-6xl lg:text-7xl">
                  <span className="text-gray-900 dark:text-white dark:drop-shadow-lg">
                    Upcoming Event
                  </span>
                </h1>
              </div>
              <div className="flex-grow flex">
                <div className="w-[30%] bg-white dark:bg-black text-black dark:text-white flex flex-col justify-center items-start p-12">
                  <h2 className="text-5xl font-bold mb-6">{slide.title}</h2>
                  <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl mb-8">
                    <p className="text-2xl font-semibold">
                      {slide.webinarDate}
                    </p>
                  </div>
                  <button
                    className="rounded-full bg-[#1e88e5] px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-[#1976d2] hover:shadow-xl hover:scale-105"
                    onClick={() => {
                      if (slide.link.startsWith("http")) {
                        openInNewTab(slide.link);
                      } else {
                        window.location.href = slide.link;
                      }
                    }}
                  >
                    {slide.buttonText}
                  </button>
                </div>
                <div className="w-[70%] bg-white dark:bg-black p-12 flex items-center justify-center">
                  <div className="relative w-full h-[60vh]">
                    <Image
                      src={slide.img}
                      alt={slide.title}
                      fill
                      className="object-contain rounded-2xl"
                      priority={index === 0}
                      sizes="70vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : slide.isPanelSlide ? (
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
          ) : (
            <>
              <div className="absolute inset-0">
                {slide.videoId ? (
                  <Image
                    src={`https://img.youtube.com/vi/${slide.videoId}/maxresdefault.jpg`}
                    alt={slide.title}
                    fill
                    className={`object-cover ${
                      slide.title === "OZ Listings Trailer" ? "opacity-50" : ""
                    }`}
                    priority={index === 0}
                    sizes="100vw"
                  />
                ) : (
                  <Image
                    src={slide.img}
                    alt={slide.title}
                    fill
                    className="object-contain"
                    priority={index === 0}
                    sizes="100vw"
                  />
                )}
                <div className="absolute inset-0 bg-black/40" />
              </div>
              <div className="relative z-10 flex h-full flex-col items-center justify-center p-6 md:p-8 text-center text-white">
                <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center max-w-4xl mx-auto">
                  <h2
                    className={`mb-4 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold`}
                  >
                    {slide.title}
                  </h2>
                  <p
                    className={`mb-6 text-base md:text-lg lg:text-xl opacity-90 max-w-3xl`}
                  >
                    {slide.details}
                  </p>
                  <button
                    className="rounded-full bg-[#1e88e5] px-6 py-3 text-base md:text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#1976d2] hover:shadow-xl hover:scale-105"
                    onClick={() => {
                      if (slide.videoId) {
                        openInNewTab(
                          `https://www.youtube.com/watch?v=${slide.videoId}`
                        );
                      } else if (slide.link.startsWith("http")) {
                        openInNewTab(slide.link);
                      } else {
                        window.location.href = slide.link;
                      }
                    }}
                  >
                    {slide.buttonText ||
                      (slide.videoId ? "Watch Full Video" : "Learn More")}
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      ))}
    </div>
  );
};

export default SectionContent;
