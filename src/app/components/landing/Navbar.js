'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth/AuthProvider';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuthNavigation } from '../../../lib/auth/useAuthNavigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, MessageSquare } from 'lucide-react';

export default function Navbar() {
    const { user, signOut } = useAuth();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false); // Hamburger state
    const { navigateWithAuth } = useAuthNavigation(); // Need this for nav
    const pathname = usePathname();
    const router = useRouter();

    // Navigation handlers
    const handleListings = () => {
        navigateWithAuth('/listings');
    };

    const handleScheduleCall = () => {
        navigateWithAuth(`/schedule-a-call?endpoint=${pathname}`);
    };

    const handleInvest = () => {
        router.push('/invest');
    };

    const handleCommunity = () => {
        router.push('/community');
    };

    const handleDevelopers = () => {
        router.push('/developers');
    };

    const handleLogout = async () => {
        await signOut();
    };

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
            <div className="hidden md:flex items-center gap-8">
                <Link 
                    href="/invest"
                    className={`text-navy font-semibold hover:text-primary transition-all duration-200 py-1 border-b-2 ${
                        pathname === '/invest' ? 'text-primary border-primary' : 'border-transparent'
                    }`}
                >
                    Investors
                </Link>
                <button
                    onClick={handleListings}
                    className={`text-navy font-semibold hover:text-primary transition-all duration-200 py-1 border-b-2 ${
                        pathname === '/listings' ? 'text-primary border-primary' : 'border-transparent'
                    }`}
                >
                    Listings
                </button>
                <Link 
                    href="/community"
                    className={`text-navy font-semibold hover:text-primary transition-all duration-200 py-1 border-b-2 ${
                        pathname === '/community' ? 'text-primary border-primary' : 'border-transparent'
                    }`}
                >
                    Community
                </Link>
                <Link 
                    href="/developers"
                    className={`text-navy font-semibold hover:text-primary transition-all duration-200 py-1 border-b-2 ${
                        pathname === '/developers' ? 'text-primary border-primary' : 'border-transparent'
                    }`}
                >
                    Developers
                </Link>
                <button
                    onClick={handleScheduleCall}
                    className={`text-navy font-semibold hover:text-primary transition-all duration-200 py-1 border-b-2 ${
                        pathname === '/schedule-a-call' ? 'text-primary border-primary' : 'border-transparent'
                    }`}
                >
                    Schedule a Call
                </button>
                {user && (
                    <motion.button
                        onClick={handleLogout}
                        className="rounded-lg p-2 transition-all duration-300 hover:bg-gray-100 focus:ring-2 focus:ring-[#1e88e5] focus:ring-offset-2 focus:outline-none dark:hover:bg-gray-800 dark:focus:ring-offset-gray-900"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Log out"
                        aria-label="Log out"
                    >
                        <LogOut
                            size={20}
                            className="text-gray-700 transition-colors duration-300 dark:text-gray-300"
                        />
                    </motion.button>
                )}
            </div>

            {/* Mobile Hamburger */}
            <div className="flex md:hidden items-center gap-4">
                {/* Chat icon */}
                <button
                    onClick={(e) => {
                        if (pathname === '/invest') {
                            e.preventDefault();
                            window.dispatchEvent(new Event('openMobileChat'));
                        } else {
                            router.push('/invest');
                        }
                    }}
                    className="rounded-xl p-2.5 w-10 h-10 flex items-center justify-center bg-[#1e88e5] hover:bg-[#1976d2] transition-all duration-200 shadow-lg shadow-[#1e88e5]/25 hover:shadow-[#1e88e5]/40 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#1e88e5]/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    title="Chat with Ozzie AI"
                    aria-label="Chat with Ozzie AI"
                >
                    <motion.div
                        initial={{ opacity: 0, rotate: -180 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <MessageSquare size={20} className="text-white" />
                    </motion.div>
                </button>
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
                className="fixed top-0 w-full h-[90px] left-0 md:relative md:top-auto md:left-auto md:w-full max-w-[1440px] md:mx-auto z-40 flex items-center justify-between px-4 sm:px-8 mx-auto bg-white"
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
                        <Link 
                            href="/invest"
                            onClick={() => setMenuOpen(false)}
                            className="px-4 py-3 rounded-xl text-lg font-medium text-navy dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                            Investors
                        </Link>
                        <button
                            onClick={() => {
                                setMenuOpen(false);
                                handleListings();
                            }}
                            className="px-4 py-3 rounded-xl text-lg font-medium text-navy dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left"
                        >
                            Listings
                        </button>
                        <Link 
                            href="/community"
                            onClick={() => setMenuOpen(false)}
                            className="px-4 py-3 rounded-xl text-lg font-medium text-navy dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                            Community
                        </Link>
                        <Link 
                            href="/developers"
                            onClick={() => setMenuOpen(false)}
                            className="px-4 py-3 rounded-xl text-lg font-medium text-navy dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                            Developers
                        </Link>
                        <button
                            onClick={() => {
                                setMenuOpen(false);
                                handleScheduleCall();
                            }}
                            className="px-4 py-3 rounded-xl text-lg font-medium text-navy dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left"
                        >
                            Schedule a Call
                        </button>
                        {user && (
                            <button
                                onClick={async () => {
                                    setMenuOpen(false);
                                    await handleLogout();
                                }}
                                className="flex items-center gap-2 px-4 py-3 rounded-xl text-lg font-medium text-navy dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                title="Log out"
                                aria-label="Log out"
                            >
                                <LogOut
                                    size={20}
                                    className="text-gray-700 transition-colors duration-300 dark:text-gray-300"
                                />
                                <span>Log out</span>
                            </button>
                        )}
                    </div>
                </motion.div>
            )}
        </>
    );
}
