'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

// These are the routes where we want to use the new ResponsiveLayout,
// so we should hide the default root Header.
const TOOL_PAGE_ROUTES = [
  '/dashboard',
  '/check-oz',
  '/check-investor-eligibility',
  '/tax-calculator'
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