import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

const PROTECTED_ROUTES = [
  '/profile',
  '/settings',
  '/schedule-a-call',
  '/check-oz',
  '/tax-calculator',
  '/webinars',
]

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

function isProtectedRoute(pathname) {
  const isListingsDetailRoute =
    pathname.startsWith('/listings/') && pathname !== '/listings'

  return (
    PROTECTED_ROUTES.some((route) => pathname.startsWith(route)) ||
    isListingsDetailRoute
  )
}

export async function middleware(request) {
  const { pathname } = request.nextUrl

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Dashboard protection (independent of standard user session)
  if (pathname.startsWith('/dashboard')) {
    if (pathname === '/dashboard/login') {
      return response
    }

    const adminCookie = request.cookies.get('oz_admin_basic')
    if (!adminCookie?.value) {
      const loginUrl = new URL('/dashboard/login', request.url)
      loginUrl.searchParams.set('returnUrl', request.url)
      return NextResponse.redirect(loginUrl)
    }

    return response
  }

  if (!isProtectedRoute(pathname) || !isSupabaseConfigured()) {
    return response
  }

  let session = null

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const {
      data: { session: activeSession },
    } = await supabase.auth.getSession()
    session = activeSession
  } catch (error) {
    console.warn(
      'Supabase session check failed in middleware:',
      error?.message ?? error
    )
  }

  const authParam = request.nextUrl.searchParams.get('auth')

  if (!session && authParam !== 'required') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.searchParams.set('auth', 'required')
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Run on page routes only — skip Next.js internals, API routes, and static files.
     * Previously every /_next/static chunk triggered a Supabase session refresh.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
