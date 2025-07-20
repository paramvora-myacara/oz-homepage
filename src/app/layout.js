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
  title: "OZ Listings | Opportunity Zone Listings for Investors and Developers",
  description: "Homepage for OZ Listings, the premier platform for Opportunity Zone listings.",
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
