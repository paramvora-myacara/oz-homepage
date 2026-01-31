import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  const { pathname } = request.nextUrl

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

  // Dashboard protection (independent of standard user session)
  if (pathname.startsWith('/dashboard')) {
    // Skip protection for login page
    if (pathname === '/dashboard/login') {
      return response
    }

    // Check for admin cookie
    const adminCookie = request.cookies.get('oz_admin_basic')
    if (!adminCookie?.value) {
      const loginUrl = new URL('/dashboard/login', request.url)
      loginUrl.searchParams.set('returnUrl', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Protected routes that require standard user authentication
  const protectedRoutes = [
    '/profile',
    '/settings',
    '/listings',
    '/schedule-a-call',
    '/check-oz',
    '/tax-calculator',
    '/webinars'
  ]

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  // If it's a protected route and user is not authenticated, redirect to the same URL with a query param
  // To prevent infinite redirect loops, skip the redirect if the URL already
  // contains the `auth=required` flag added by a previous redirect.
  const authParam = request.nextUrl.searchParams.get('auth');

  if (isProtectedRoute && !session && authParam !== 'required') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.searchParams.set('auth', 'required');
    redirectUrl.searchParams.set('redirectTo', pathname);
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