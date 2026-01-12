'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthModal } from '../../contexts/AuthModalContext';
import { useAuth } from '../../../lib/auth/AuthProvider';
import { useTheme } from '../../contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
    const { openModal } = useAuthModal();
    const { user } = useAuth();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);

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
            <div className="flex items-center gap-8">
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
                className="fixed top-0 w-full bg-white h-[90px] left-0 md:relative md:top-auto md:left-auto md:w-full max-w-[1440px] md:mx-auto z-40 flex items-center justify-between px-4 sm:px-8 mx-auto"
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
        </>
    );
}
