'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthModal } from '../../contexts/AuthModalContext';
import { useAuth } from '../../../lib/auth/AuthProvider';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuthNavigation } from '../../../lib/auth/useAuthNavigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
    const { openModal } = useAuthModal();
    const { user } = useAuth();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false); // Hamburger state
    const { navigateWithAuth } = useAuthNavigation(); // Need this for nav
    const [isInSlideshow, setIsInSlideshow] = useState(false); // Add slideshow check just in case compatibility is needed

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent hydration mismatch
    const currentTheme = mounted ? resolvedTheme : 'light';

    // Mobile Menu Items
    const mobileLinks = [
        { label: 'Investors', href: '/invest' },
        { label: 'Listings', href: '/listings' },
        { label: 'Community', href: '/community' },
        { label: 'Schedule a Call', href: '/schedule-a-call' },
    ];

    const NavContent = () => (
        <>
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
                <div className="relative h-10 w-40">
                    <Image
                        src={
                            currentTheme === "dark"
                                ? "/OZListings-Dark.png"
                                : "/OZListings-Light-removebg.png"
                        }
                        alt="OZ Listings"
                        fill
                        className="object-contain object-left"
                        priority
                        unoptimized
                    />
                </div>
            </Link>

            {/* Desktop Links & Actions */}
            <div className="hidden md:flex items-center gap-8">
                <Link href="/invest" className="text-navy font-semibold hover:text-primary transition-colors">
                    Investors
                </Link>
                <Link href="/listings" className="text-navy font-semibold hover:text-primary transition-colors">
                    Listings
                </Link>
                <Link href="/community" className="text-navy font-semibold hover:text-primary transition-colors">
                    Community
                </Link>
                <Link href="/schedule-a-call" className="text-navy font-semibold hover:text-primary transition-colors">
                    Schedule a Call
                </Link>
            </div>

            {/* Mobile Hamburger */}
            <div className="flex md:hidden items-center gap-4">
                 {/* Hamburger icon */}
                  <button
                    className="rounded-lg p-2 w-10 h-10 flex items-center justify-center border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-[#1e88e5] focus:outline-none bg-white/50 backdrop-blur-sm"
                    onClick={() => setMenuOpen((open) => !open)}
                    aria-label="Open menu"
                  >
                    {menuOpen ? (
                        <svg className="w-6 h-6 text-navy dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6 text-navy dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                  </button>
            </div>
        </>
    );

    return (
        <>
            {/* 1. Initial Top Navbar */}
            <motion.nav
                initial={{ opacity: 1 }}
                animate={{
                    opacity: scrolled ? 0 : 1,
                    pointerEvents: scrolled ? 'none' : 'auto'
                }}
                transition={{ duration: 0.3 }}
                className="fixed top-0 w-full h-[90px] left-0 md:relative md:top-auto md:left-auto md:w-full max-w-[1440px] md:mx-auto z-40 flex items-center justify-between px-4 sm:px-8 mx-auto"
            >
                <NavContent />
            </motion.nav>

            {/* 2. Floating Scrolled Navbar */}
            <motion.nav
                initial={{ opacity: 0 }}
                animate={{
                    opacity: scrolled ? 1 : 0,
                    pointerEvents: scrolled ? 'auto' : 'none'
                }}
                transition={{ duration: 0.3 }}
                className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] sm:w-[90%] max-w-[1440px] h-[70px] rounded-full shadow-2xl bg-white/95 backdrop-blur-sm z-50 flex items-center justify-between px-4 sm:px-8 mx-auto"
            >
                <NavContent />
            </motion.nav>

            {/* Mobile Dropdown Menu (Standardized) */}
            {menuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed top-[100px] left-4 right-4 z-50 rounded-2xl bg-white dark:bg-black p-4 shadow-2xl border border-gray-100 dark:border-white/10 md:hidden"
                >
                    <div className="flex flex-col gap-2">
                        {mobileLinks.map((link) => (
                            <Link 
                                key={link.href}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className="px-4 py-3 rounded-xl text-lg font-medium text-navy dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </motion.div>
            )}
        </>
    );
}
