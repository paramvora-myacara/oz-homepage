import "./globals.css";
import { Suspense } from 'react';
import ConditionalHeader from "./components/ConditionalHeader";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "../lib/auth/AuthProvider";
import { AuthModalProvider } from "./contexts/AuthModalContext";
import AuthModal from "./components/AuthModal";
import AuthObserver from '../lib/auth/AuthObserver';
import Script from 'next/script';

export const metadata = {
  title: "OZ Listings | Premier marketplace for Opportunity Zone investments",
  description: "Premier marketplace for Opportunity Zone investments. Tax-advantaged real estate deals.",
  openGraph: {
    title: "OZ Listings | Premier marketplace for Opportunity Zone investments",
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
    title: "OZ Listings | Premier marketplace for Opportunity Zone investments",
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
      </head>
      <body className="antialiased">
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
              <ConditionalHeader />
              <AuthModal />
              {children}
            </ThemeProvider>
          </AuthProvider>
        </AuthModalProvider>
      </body>
    </html>
  );
}
