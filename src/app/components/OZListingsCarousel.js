"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import { useState } from "react";

// Example data (replace with your real slide content!)
const slides = [
  {
    title: "Welcome from Our Founder",
    img: "/images/jimmy-atkinson-founder.jpg", // add your image path
    details: "2-min intro to the OZ Listings mission",
    link: "/market/st-louis",
  },
  {
    title: "LinkedIn Insights",
    img: "/images/linkedin-cover.jpg",
    details: "Expert commentary & market trends from our team",
    link: "/market/omaha",
  },
  {
    title: "The OZ Investor’s Guide",
    img: "/images/brett-jordan-B4-h2B-DRhs-unsplash.jpg",
    details: "#1 Book on Opportunity Zones (Amazon)",
    link: "/market/minneapolis",
  },
  {
    title: "Podcast: OZ Success Stories",
    img: "/images/isaac-quesada-s34TlUTPIf4-unsplash.jpg",
    details: "Hear from leading OZ developers & investors",
    link: "/market/minneapolis",
  },
  // Add more slides as needed...
];

export default function OZListingsCarousel() {
  // Track which slide is hovered for the overlay
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <section className="flex w-full flex-col items-center bg-white py-16">
      <h2 className="mb-8 text-center font-serif text-3xl font-bold md:text-4xl">
        Latest from OZ Listings
      </h2>
      <div className="flex w-full justify-center">
        <Swiper
          modules={[Navigation]}
          navigation
          slidesPerView={3}
          spaceBetween={32}
          loop={false}
          className="w-full max-w-6xl"
          breakpoints={{
            // Responsive: 1 slide on mobile, 2 on tablet, 3 on desktop
            0: { slidesPerView: 1 },
            700: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={slide.title}>
              <div
                className="group relative h-[400px] cursor-pointer overflow-hidden rounded-3xl shadow-xl"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Background Image */}
                <Image
                  src={slide.img}
                  alt={slide.title}
                  fill
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  style={{ zIndex: 1 }}
                  priority={idx === 0}
                />
                {/* Gradient Overlay for Readability */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* Title at bottom left */}
                <div
                  className="absolute bottom-7 left-6 z-20"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  <span className="text-2xl font-bold tracking-tight text-white drop-shadow-lg md:text-3xl">
                    {slide.title}
                  </span>
                </div>

                {/* Slide-up Card Overlay on Hover */}
                <div
                  className={`absolute bottom-0 left-0 z-30 flex h-full w-full flex-col justify-end rounded-3xl bg-white/95 p-8 transition-transform duration-400 ${hoveredIdx === idx ? "translate-y-0" : "translate-y-full"} group-hover:shadow-2xl`}
                  style={{
                    boxShadow:
                      hoveredIdx === idx
                        ? "0 12px 24px rgba(0,0,0,0.16)"
                        : "none",
                  }}
                >
                  <div className="mb-3 text-lg font-semibold text-[#1A2B4B]">
                    {slide.title}
                  </div>
                  <div className="mb-4 text-base text-gray-700">
                    {slide.details}
                  </div>
                  <a
                    href={slide.link}
                    className="mt-1 inline-block rounded-full border border-[#1A2B4B] px-5 py-2 font-semibold text-[#1A2B4B] transition hover:bg-[#1A2B4B] hover:text-white"
                  >
                    See More
                  </a>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
