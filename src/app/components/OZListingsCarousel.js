"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

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
    title: "The OZ Investor's Guide",
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

// Enhanced slide card component
const SlideCard = ({ slide, idx, isHovered, onHover, onLeave }) => {
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    setMousePosition({ x, y });
    
    // Subtle 3D tilt effect
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };
  
  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    }
    onLeave();
  };

  return (
    <motion.div
      ref={cardRef}
      className="group relative h-[400px] cursor-pointer overflow-hidden rounded-3xl"
      style={{
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      }}
      initial={{ opacity: 0, y: 100, scale: 0.8 }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { 
          duration: 0.8, 
          delay: idx * 0.2,
          ease: [0.25, 0.1, 0.25, 1],
          type: "spring",
          stiffness: 100
        }
      }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => onHover(idx)}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
      }}
    >
      {/* Background Image with parallax effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="h-[120%] w-[120%] -translate-x-[10%] -translate-y-[10%]"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Image
            src={slide.img}
            alt={slide.title}
            fill
            className="h-full w-full object-cover"
            style={{ zIndex: 1 }}
            priority={idx === 0}
          />
        </motion.div>
      </div>
      
      {/* Dynamic gradient overlay */}
      <motion.div 
        className="absolute inset-0 z-10"
        style={{
          background: "linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)",
        }}
        whileHover={{
          background: "linear-gradient(135deg, rgba(30,136,229,0.2) 0%, rgba(0,0,0,0.8) 100%)",
          transition: { duration: 0.5 }
        }}
      />

      {/* Title at bottom left with enhanced typography */}
      <motion.div
        className="absolute bottom-7 left-6 z-20"
        style={{ fontFamily: "Playfair Display, serif" }}
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay: idx * 0.2 + 0.3, duration: 0.6 }}
      >
        <motion.span 
          className="text-2xl font-bold tracking-tight text-white drop-shadow-lg md:text-3xl"
          whileHover={{ 
            scale: 1.05,
            textShadow: "0 0 20px rgba(255,255,255,0.5)",
            transition: { duration: 0.3 }
          }}
        >
          {slide.title}
        </motion.span>
      </motion.div>

      {/* Enhanced slide-up overlay */}
      <motion.div
        className="absolute bottom-0 left-0 z-30 flex h-full w-full flex-col justify-end rounded-3xl p-8"
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
        initial={{ y: "100%" }}
        animate={{ 
          y: isHovered ? "0%" : "100%",
          transition: { 
            duration: 0.6, 
            ease: [0.25, 0.1, 0.25, 1]
          }
        }}
      >
        {/* Content with staggered animations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: isHovered ? 1 : 0, 
            y: isHovered ? 0 : 20,
            transition: { delay: isHovered ? 0.2 : 0, duration: 0.4 }
          }}
        >
          <div className="mb-3 text-lg font-semibold text-[#1A2B4B]">
            {slide.title}
          </div>
          <div className="mb-4 text-base text-gray-700 leading-relaxed">
            {slide.details}
          </div>
          
          {/* Enhanced CTA button */}
          <motion.a
            href={slide.link}
            className="relative inline-block overflow-hidden rounded-full border border-[#1A2B4B] px-5 py-2 font-semibold text-[#1A2B4B] transition-all duration-300"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 8px 25px rgba(26, 43, 75, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1A2B4B";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#1A2B4B";
            }}
          >
            {/* Button shimmer effect */}
            <motion.div
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
              whileHover={{ translateX: "200%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
            <span className="relative z-10">See More</span>
          </motion.a>
        </motion.div>
      </motion.div>
      
      {/* Subtle border glow on hover */}
      <motion.div 
        className="absolute inset-0 rounded-3xl opacity-0 pointer-events-none"
        animate={{
          opacity: isHovered ? 1 : 0,
          boxShadow: isHovered 
            ? "0 0 0 2px rgba(30, 136, 229, 0.3), 0 20px 60px rgba(30, 136, 229, 0.2)" 
            : "0 0 0 0px rgba(30, 136, 229, 0), 0 0px 0px rgba(30, 136, 229, 0)",
          transition: { duration: 0.5 }
        }}
      />
    </motion.div>
  );
};

export default function OZListingsCarousel() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.section 
      ref={sectionRef}
      className="flex w-full flex-col items-center bg-white py-16 relative overflow-hidden"
      style={{ y, opacity }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-[#1e88e5]/5"
            animate={{
              x: [0, 200, 0],
              y: [0, -150, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 12 + i * 3,
              repeat: Infinity,
              ease: "linear",
              delay: i * 1.5,
            }}
            style={{
              left: `${15 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
          />
        ))}
      </div>
      
      {/* Enhanced title */}
      <motion.h2 
        className="mb-8 text-center font-serif text-3xl font-bold md:text-4xl relative"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        viewport={{ once: true }}
      >
        <span className="bg-gradient-to-r from-[#1A2B4B] to-[#1e88e5] bg-clip-text text-transparent">
          Latest from OZ Listings
        </span>
        
        {/* Subtle underline decoration */}
        <motion.div
          className="absolute -bottom-2 left-1/2 h-1 bg-gradient-to-r from-[#1e88e5] to-[#42a5f5] rounded-full"
          initial={{ width: 0, x: "-50%" }}
          whileInView={{ width: "60px" }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
      </motion.h2>
      
      {/* Enhanced carousel container */}
      <div className="flex w-full justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="w-full max-w-6xl"
        >
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            slidesPerView={3}
            spaceBetween={32}
            loop={false}
            className="w-full"
            style={{
              paddingBottom: "20px",
            }}
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 20 },
              700: { slidesPerView: 2, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 32 },
            }}
          >
            {slides.map((slide, idx) => (
              <SwiperSlide key={slide.title}>
                <SlideCard
                  slide={slide}
                  idx={idx}
                  isHovered={hoveredIdx === idx}
                  onHover={setHoveredIdx}
                  onLeave={() => setHoveredIdx(null)}
                />
              </SwiperSlide>
            ))}
            
            {/* Enhanced navigation buttons */}
            <div className="swiper-button-prev !left-4 !top-1/2 !h-12 !w-12 !rounded-full !bg-white/90 !backdrop-blur-md !border !border-white/20 !shadow-lg after:!text-lg after:!font-bold after:!text-[#1A2B4B] hover:!bg-[#1A2B4B] hover:after:!text-white !transition-all !duration-300"></div>
            <div className="swiper-button-next !right-4 !top-1/2 !h-12 !w-12 !rounded-full !bg-white/90 !backdrop-blur-md !border !border-white/20 !shadow-lg after:!text-lg after:!font-bold after:!text-[#1A2B4B] hover:!bg-[#1A2B4B] hover:after:!text-white !transition-all !duration-300"></div>
          </Swiper>
        </motion.div>
      </div>
    </motion.section>
  );
}
