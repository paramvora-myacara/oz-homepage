"use client";
import { FaLinkedin, FaYoutube, FaFacebook } from "react-icons/fa6";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MotionCTAButton } from "./CTAButton";
import { useAuthNavigation } from "../../lib/auth/useAuthNavigation";
import { trackUserEvent } from "../../lib/analytics/trackUserEvent";

const socialLinks = [
  { icon: FaLinkedin, href: "https://www.linkedin.com/company/ozlistings", label: "LinkedIn" },
  { icon: FaYoutube, href: "https://www.youtube.com/@ozlistings", label: "YouTube" },
  { icon: FaFacebook, href: "https://www.facebook.com/opportunityzonelistings", label: "Facebook" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: [0.25, 0.1, 0.25, 1] 
    }
  },
};

// Custom button component for footer-styled buttons
function CustomFooterButton({ children, isCenter = false, variants, onClick, ...props }) {
  const baseClasses = "group relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#1e88e5] focus:ring-offset-2 font-brand-semibold px-6 py-2.5 text-sm border-2";
  
  const buttonStyle = isCenter ? {
    background: "linear-gradient(to right, #1e88e5, #42a5f5)",
    color: "white",
    boxShadow: "0 4px 15px rgba(30, 136, 229, 0.2)",
    borderColor: "transparent",
  } : {
    background: "var(--background)",
    color: "#1e88e5",
    borderColor: "transparent",
  };

  const handleMouseEnter = (e) => {
    if (isCenter) {
      e.currentTarget.style.transform = "scale(1.05) translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 8px 30px rgba(30, 136, 229, 0.4)";
    } else {
      e.currentTarget.style.backgroundColor = "var(--background)";
      e.currentTarget.style.borderColor = "#1e88e5";
    }
  };
  
  const handleMouseLeave = (e) => {
    if (isCenter) {
      e.currentTarget.style.transform = "scale(1) translateY(0px)";
      e.currentTarget.style.boxShadow = "0 4px 15px rgba(30, 136, 229, 0.2)";
    } else {
      e.currentTarget.style.backgroundColor = "var(--background)";
      e.currentTarget.style.borderColor = "transparent";
    }
  };

  return (
    <motion.button
      className={baseClasses}
      style={buttonStyle}
      variants={variants}
      whileHover={{ y: -2 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      {...props}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-600 group-hover:translate-x-full" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

export default function OZListingsFooter() {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: "-100px" });
  const { navigateWithAuth } = useAuthNavigation();

  const handleSeeDashboard = async () => {
    await trackUserEvent('dashboard_accessed');
    window.location.href = process.env.NEXT_PUBLIC_DASH_URL;
  };

  const handleQualifyAsInvestor = () => {
    window.location.href = process.env.NEXT_PUBLIC_QUALIFY_INVEST_URL;
  };

  const handleSpeakToTeam = () => {
    navigateWithAuth('/contact-team');
  };

  const handleSpeakToOzzieAI = () => {
    window.location.href = process.env.NEXT_PUBLIC_DASH_URL;
  };

  const handleSeeOZListings = async () => {
    await trackUserEvent('viewed_listings');
    navigateWithAuth('/listings');
  };

  return (
    <motion.footer 
      ref={footerRef}
      className="w-full bg-[#262626] dark:bg-black text-white relative overflow-hidden transition-colors duration-300"
      style={{ paddingTop: '4.5rem', paddingBottom: '4.5rem' }}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #1e88e5 0%, transparent 50%),
                              radial-gradient(circle at 75% 75%, #42a5f5 0%, transparent 50%)`,
          }}
        />
      </div>
      
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-[#1e88e5]/20"
            animate={{
              x: [0, 100, 0],
              y: [0, -80, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2,
            }}
            style={{
              left: `${20 + i * 20}%`,
              top: `${30 + i * 15}%`,
            }}
          />
        ))}
      </div>

      {/* Logo and Social Icons - Top Left Corner with Relative Spacing */}
      <motion.div 
        className="absolute top-12 left-12 z-20 flex flex-col"
        variants={containerVariants}
      >
        {/* Logo */}
        <motion.div
          className="mb-4"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <a href="/" className="cursor-pointer block">
            <Image
              src="/images/oz-listings-horizontal2-logo-white.webp"
              alt="OZ Listings Logo"
              width={300}
              height={24}
              className="transition-all duration-300 hover:opacity-80"
              priority
            />
          </a>
        </motion.div>

        {/* Social Media Icons - Directly Below Logo */}
        <motion.div 
          className="flex flex-row gap-6"
          variants={containerVariants}
        >
          {socialLinks.map(({ icon: Icon, href, label }, index) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group"
              aria-label={label}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.2,
                y: -2,
                transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
              }}
              whileTap={{ scale: 0.9 }}
            >
              {/* Icon glow effect */}
              <div 
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: "radial-gradient(circle, rgba(30, 136, 229, 0.3) 0%, transparent 70%)",
                  transform: "scale(2)",
                }}
              />
              
              <Icon 
                size={28} 
                className="relative z-10 text-white transition-colors duration-300 group-hover:text-[#1e88e5]"
              />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>

      <div className="mx-auto max-w-6xl px-4 relative z-10">
        {/* Centered 5-Button Row */}
        <motion.div 
          className="flex items-center justify-center gap-4 mb-8"
          variants={containerVariants}
        >
          <CustomFooterButton 
            variants={itemVariants}
            onClick={handleSeeDashboard}
          >
            See Dashboard
          </CustomFooterButton>
          
          <CustomFooterButton 
            variants={itemVariants}
            onClick={handleQualifyAsInvestor}
          >
            Qualify as an Investor
          </CustomFooterButton>
          
          <CustomFooterButton 
            isCenter={true} 
            variants={itemVariants}
            onClick={handleSpeakToTeam}
          >
            Speak to the Team
          </CustomFooterButton>

          <CustomFooterButton 
            variants={itemVariants}
            onClick={handleSpeakToOzzieAI}
          >
            Speak to Ozzie AI
          </CustomFooterButton>
          
          <CustomFooterButton 
            variants={itemVariants}
            onClick={handleSeeOZListings}
          >
            See OZ Listings
          </CustomFooterButton>
        </motion.div>
      </div>
      
      {/* Enhanced Copyright */}
      <motion.div 
        className="text-center text-sm text-white/60 relative z-10"
        style={{ marginTop: '3rem' }}
        variants={itemVariants}
      >
        <motion.span
          className="font-brand-normal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          &copy; {new Date().getFullYear()} OZ Listings. All rights reserved.
        </motion.span>
        
        {/* Subtle decorative line */}
        <motion.div
          className="mx-auto h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{ width: "9.375rem", marginTop: "0.5rem" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </motion.div>
    </motion.footer>
  );
}
