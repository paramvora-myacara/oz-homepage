import "./globals.css";
import { Suspense } from 'react';
import Navbar from "./components/landing/Navbar";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "../lib/auth/AuthProvider";
import { AuthModalProvider } from "./contexts/AuthModalContext";
import AuthModal from "./components/AuthModal";
import AuthObserver from '../lib/auth/AuthObserver';
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';
import FooterWrapper from "./components/FooterWrapper";


export const metadata = {
  title: "OZ Listings | The Premier Marketplace for Opportunity Zone Investments",
  description: "The Premier Marketplace for Opportunity Zone Investments. Tax-advantaged real estate deals.",
  openGraph: {
    title: "OZ Listings | The Premier Marketplace for Opportunity Zone Investments",
    description: "",
    url: "https://ozlistings.com",
    siteName: "OZ Listings",
    images: [
      {
        url: "https://ozlistings.com/OZ-homepage.jpg", // Perfect 1200x630 dimensions
        width: 1200,
        height: 630,
        alt: "OZ Listings - Opportunity Zone Investment Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OZ Listings | The Premier Marketplace for Opportunity Zone Investments",
    description: "",
    images: ["https://ozlistings.com/OZ-homepage.jpg"], // Perfect 1200x630 dimensions
    creator: "@ozlistings", // Add your Twitter handle if you have one
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://ozlistings.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800;900&display=swap" rel="stylesheet" />
        {/* SignWell Script for Confidentiality Agreement Signing */}
        <script src="https://static.signwell.com/assets/embedded.js" async></script>
      </head>
      <body className="antialiased font-sans">
        {/* BACKGROUND: Fixed Grid */}
        <div className="fixed inset-0 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-[-1] pointer-events-none"></div>
        <Script
          src="/scripts/utm_form-1.2.0.min.js"
          strategy="afterInteractive"
        />
        <AuthModalProvider>
          <AuthProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <AuthObserver />
            </Suspense>
            <ThemeProvider>
              <Navbar />
              <AuthModal />
              {children}
              <FooterWrapper />
              {/* High z-index container for SignWell embedded modal */}
              <div id="signwell-modal-root" className="signwell-modal-root" />
            </ThemeProvider>
          </AuthProvider>
        </AuthModalProvider>
        <GoogleAnalytics gaId="G-FJ5FN12SEL" />
      </body>
    </html>
  );
}
