"use client";
import { FaLinkedin, FaFacebook, FaXTwitter, FaYoutube } from "react-icons/fa6";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const socialLinks = [
  { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: FaFacebook, href: "https://facebook.com", label: "Facebook" },
  { icon: FaXTwitter, href: "https://twitter.com", label: "X (Twitter)" },
  { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
];

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
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

export default function OZListingsFooter() {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: "-100px" });

  return (
    <motion.footer 
      ref={footerRef}
      className="w-full bg-[#262626] py-10 text-white relative overflow-hidden"
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

      <div className="mx-auto flex max-w-6xl flex-row flex-wrap items-start justify-between gap-y-8 px-4 relative z-10">
        {/* Left: Logo and Social Icons */}
        <motion.div 
          className="flex flex-col items-start"
          variants={itemVariants}
        >
          {/* Enhanced Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Image
              src="/images/oz-listings-horizontal2-logo-white.webp"
              alt="OZ Listings Logo"
              width={230}
              height={18}
              className="mb-2 transition-all duration-300"
              priority
            />
          </motion.div>
          
          {/* Enhanced Social Media Icons */}
          <motion.div 
            className="mt-1 flex flex-row gap-6"
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
                  size={24} 
                  className="relative z-10 text-white transition-colors duration-300 group-hover:text-[#1e88e5]"
                />
                
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm text-xs text-gray-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  {label}
                </div>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: Enhanced Navigation Links */}
        <motion.div 
          className="ml-auto flex flex-row items-center gap-8"
          variants={containerVariants}
        >
          {navLinks.map(({ href, label }) => (
            <motion.a
              key={label}
              href={href}
              className="relative group text-white font-medium"
              variants={itemVariants}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-[#1e88e5]">
                {label}
              </span>
              
              {/* Animated underline */}
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#1e88e5] to-[#42a5f5] rounded-full"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              />
              
              {/* Subtle glow on hover */}
              <div 
                className="absolute inset-0 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: "radial-gradient(circle, rgba(30, 136, 229, 0.1) 0%, transparent 70%)",
                  transform: "scale(1.5)",
                }}
              />
            </motion.a>
          ))}
        </motion.div>
      </div>
      
      {/* Enhanced Copyright */}
      <motion.div 
        className="mt-8 text-center text-sm text-white/60 relative z-10"
        variants={itemVariants}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          &copy; {new Date().getFullYear()} OZ Listings. All rights reserved.
        </motion.span>
        
        {/* Subtle decorative line */}
        <motion.div
          className="mx-auto mt-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{ width: "200px" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </motion.div>
    </motion.footer>
  );
}
