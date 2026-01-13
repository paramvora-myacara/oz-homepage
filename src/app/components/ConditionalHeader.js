'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

// These are the routes where we want to use the new ResponsiveLayout,
// so we should hide the default root Header.
const TOOL_PAGE_ROUTES = [
  '/', // Hide default header on homepage (using custom Navbar)
  '/check-oz',
  '/tax-calculator',
  '/raise',
  '/community', // Hide default header on community page (using custom Navbar)
  '/invest', // Removed - now uses standard header
  '/listings', // Hide default header on listings page (using custom Navbar)
  '/schedule-a-call', // Hide default header on schedule-a-call page
];

export default function ConditionalHeader() {
  const pathname = usePathname();

  // If the current path is one of the tool pages, don't render the header.
  if (TOOL_PAGE_ROUTES.includes(pathname)) {
    return null;
  }

  // Otherwise, render the default header.
  return <Header />;
} 