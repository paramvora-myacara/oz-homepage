import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  // Early: proxy Next.js assets for listings pages to oz-dev-dash
  const { pathname, search } = request.nextUrl
  const referer = request.headers.get('referer') || ''
  const host = (request.headers.get('host') || '').toLowerCase()

  const isNextAsset = pathname.startsWith('/_next/static/') || pathname.startsWith('/_next/image')
  const isListingsReferer = /\/listings\//.test(referer)
  const isOzListingsHost = /^(www\.)?ozlistings\.com$/.test(host)

  if (isNextAsset && isListingsReferer && isOzListingsHost) {
    return NextResponse.rewrite(new URL(`https://oz-dev-dash-ten.vercel.app${pathname}${search}`))
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request: {
              headers: request.headers,
            }
          });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession()

  // Protected routes that require authentication
  const protectedRoutes = [
    '/profile', 
    '/settings', 
    '/listings', 
    '/schedule-a-call',
    '/check-oz',
    '/tax-calculator'
  ]
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // If it's a protected route and user is not authenticated, redirect to the same URL with a query param
  // To prevent infinite redirect loops, skip the redirect if the URL already
  // contains the `auth=required` flag added by a previous redirect.
  const authParam = request.nextUrl.searchParams.get('auth');

  if (isProtectedRoute && !session && authParam !== 'required') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.searchParams.set('auth', 'required');
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.href.replace(request.nextUrl.origin, ''));
    return NextResponse.redirect(redirectUrl);
  }
  
  return response
}

export const config = {
  matcher: [
    // Run on everything except favicon.ico and raw public images
    '/((?!favicon.ico|auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 