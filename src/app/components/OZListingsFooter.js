"use client";
import { FaLinkedin, FaFacebook, FaXTwitter, FaYoutube } from "react-icons/fa6";
import Image from "next/image";

export default function OZListingsFooter() {
  return (
    <footer className="w-full bg-[#262626] py-10 text-white">
      <div className="mx-auto flex max-w-6xl flex-row flex-wrap items-start justify-between gap-y-8 px-4">
        {/* Left: Logo and Social Icons */}
        <div className="flex flex-col items-start">
          {/* Logo (update src as needed) */}
          <Image
            src="/images/oz-listings-horizontal2-logo-white.webp" // or your logo path
            alt="OZ Listings Logo"
            width={230}
            height={18}
            className="mb-2"
            priority
          />
          {/* Social Media Icons */}
          <div className="mt-1 flex flex-row gap-6">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-[#C2A059]"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-[#C2A059]"
              aria-label="Facebook"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-[#C2A059]"
              aria-label="X (Twitter)"
            >
              <FaXTwitter size={24} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-[#C2A059]"
              aria-label="YouTube"
            >
              <FaYoutube size={24} />
            </a>
          </div>
        </div>

        {/* Right: Navigation Links */}
        <div className="ml-auto flex flex-row items-center gap-8">
          <a href="/about" className="transition hover:text-[#C2A059]">
            About
          </a>
          <a href="/contact" className="transition hover:text-[#C2A059]">
            Contact
          </a>
          <a href="/privacy" className="transition hover:text-[#C2A059]">
            Privacy
          </a>
          <a href="/terms" className="transition hover:text-[#C2A059]">
            Terms
          </a>
        </div>
      </div>
      <div className="mt-8 text-center text-sm text-white/60">
        &copy; {new Date().getFullYear()} OZ Listings. All rights reserved.
      </div>
    </footer>
  );
}
