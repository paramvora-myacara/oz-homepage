'use client';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer>

            {/* Copyright Strip */}
            <div className="bg-[#1C252F] py-8 text-center text-white/40 text-sm">
                © {new Date().getFullYear()} OZ Listings. Legal | Privacy | Contact
            </div>
        </footer>
    );
}
