"use client";
import { FaLinkedin, FaYoutube, FaFacebook } from "react-icons/fa6";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import LegalModal from "./LegalModal";

const socialLinks = [
  {
    icon: FaLinkedin,
    href: "https://www.linkedin.com/company/ozlistings",
    label: "LinkedIn",
  },
  {
    icon: FaYoutube,
    href: "https://www.youtube.com/@ozlistings",
    label: "YouTube",
  },
  {
    icon: FaFacebook,
    href: "https://www.facebook.com/opportunityzonelistings",
    label: "Facebook",
  },
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
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export default function OZListingsFooter() {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: "-100px" });
  const [isMobile, setIsMobile] = useState(null);
  const [legalModal, setLegalModal] = useState({ open: false, type: null });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile === null) return null;

  // MOBILE FOOTER
  if (isMobile) {
    return (
      <footer className="relative w-full overflow-hidden bg-black pt-10 pb-10 text-white transition-colors duration-300">
        {/* Logo and Social Icons */}
        <div className="mb-8 flex flex-col items-center">
          <a href="/" className="mb-4 block">
            <Image
              src="/images/oz-listings-horizontal2-logo-white.webp"
              alt="OZ Listings Logo"
              width={200}
              height={20}
              className="transition-all duration-300 hover:opacity-80"
              priority
            />
          </a>
          <div className="mb-2 flex flex-row gap-6">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
                aria-label={label}
              >
                <Icon
                  size={24}
                  className="text-white transition-colors duration-300 group-hover:text-[#1e88e5]"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="px-4 text-center text-xs text-white/60">
          <span className="font-brand-normal mb-2 block">
            &copy; {new Date().getFullYear()} OZ Listings. All rights reserved.
          </span>
          <div className="mx-auto mt-2 max-w-xs text-[11px] text-white/50">
            <p>
              OZ Listings is a marketing platform and does not offer, solicit,
              or sell securities. The information provided on this website is
              for general informational purposes only and should not be
              construed as investment, tax, or legal advice. OZ Listings does
              not operate as a broker-dealer, funding portal, or investment
              adviser and does not recommend or endorse any specific securities,
              offerings, or issuers. All investments carry risk, including the
              potential loss of principal. Opportunity Zone investments are
              subject to complex IRS rules and may not be suitable for all
              investors. Eligibility for associated tax benefits depends on a
              variety of factors and should be evaluated in consultation with
              your own legal, tax, and financial advisors. OZ Listings makes no
              representations or warranties as to the accuracy, completeness, or
              timeliness of any third-party project information, financial
              projections, or associated content.
            </p>
          </div>
          <div
            className="mx-auto mt-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{ width: "7rem" }}
          />
          {/* Legal Disclosures & Terms Links */}
          <div className="mt-6 flex flex-col items-center gap-1 text-[11px] text-white/60">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setLegalModal({ open: true, type: "disclosures" });
              }}
              className="hover:underline"
            >
              Legal Disclosures
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setLegalModal({ open: true, type: "terms" });
              }}
              className="hover:underline"
            >
              Terms &amp; Conditions
            </a>
            <LegalModal
              open={legalModal.open}
              onClose={() => setLegalModal({ open: false, type: null })}
              type={legalModal.type}
            />
          </div>
        </div>
      </footer>
    );
  }

  // DESKTOP FOOTER
  return (
    <motion.footer
      ref={footerRef}
      className="relative w-full overflow-hidden bg-black text-white transition-colors duration-300"
      style={{ paddingTop: "4.5rem", paddingBottom: "4.5rem" }}
      initial="hidden"
      //animate={isInView ? "visible" : "hidden"}
      animate="visible"
      variants={containerVariants}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-0 dark:opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #1e88e5 0%, transparent 50%),
                              radial-gradient(circle at 75% 75%, #42a5f5 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* Floating decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-transparent dark:bg-[#1e88e5]/20"
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
        className="absolute top-12 left-12 z-10 flex flex-col"
        variants={containerVariants}
      >
        {/* Logo */}
        <motion.div
          className="mb-4"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <a href="/" className="block cursor-pointer">
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
              className="group relative"
              aria-label={label}
              variants={itemVariants}
              whileHover={{
                scale: 1.2,
                y: -2,
                transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
              }}
              whileTap={{ scale: 0.9 }}
            >
              {/* Icon glow effect */}
              <div
                className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle, rgba(30, 136, 229, 0.3) 0%, transparent 70%)",
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

      {/* Enhanced Copyright */}
      <motion.div
        className="relative z-10 text-center text-sm text-white/60"
        style={{ marginTop: "3rem" }}
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

        <motion.div
          className="relative z-10 mx-auto mt-4 max-w-4xl px-4 text-xs text-white/50"
          variants={itemVariants}
        >
          <p>
            OZ Listings is a marketing platform and does not offer, solicit, or
            sell securities. The information provided on this website is for
            general informational purposes only and should not be construed as
            investment, tax, or legal advice. OZ Listings does not operate as a
            broker-dealer, funding portal, or investment adviser and does not
            recommend or endorse any specific securities, offerings, or issuers.
            All investments carry risk, including the potential loss of
            principal. Opportunity Zone investments are subject to complex IRS
            rules and may not be suitable for all investors. Eligibility for
            associated tax benefits depends on a variety of factors and should
            be evaluated in consultation with your own legal, tax, and financial
            advisors. OZ Listings makes no representations or warranties as to
            the accuracy, completeness, or timeliness of any third-party project
            information, financial projections, or associated content.
          </p>
        </motion.div>

        {/* Subtle decorative line */}
        <motion.div
          className="mx-auto h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{ width: "9.375rem", marginTop: "0.5rem" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        />

        {/* Legal Disclosures & Terms Links */}
        <div className="mt-6 flex flex-row justify-center gap-6 text-xs text-white/60">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setLegalModal({ open: true, type: "disclosures" });
            }}
            className="hover:underline"
          >
            Legal Disclosures
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setLegalModal({ open: true, type: "terms" });
            }}
            className="hover:underline"
          >
            Terms &amp; Conditions
          </a>
          <LegalModal
            open={legalModal.open}
            onClose={() => setLegalModal({ open: false, type: null })}
            type={legalModal.type}
          />
        </div>
      </motion.div>
    </motion.footer>
  );
}
