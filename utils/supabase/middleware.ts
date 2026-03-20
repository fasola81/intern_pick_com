import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This will refresh the session if expired
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Protected routes — redirect to login if not authenticated
  const protectedRoutes = ['/student', '/employer', '/educator', '/account']
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))
  
  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Auth routes — redirect to dashboard if already logged in
  const authRoutes = ['/login', '/signup', '/forgot-password']
  const isAuthRoute = authRoutes.some(route => pathname === route)
  
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone()
    const role = user.user_metadata?.role || 'student'
    if (role === 'educator') {
      url.pathname = '/educator'
    } else if (role === 'employer') {
      url.pathname = '/employer'
    } else {
      url.pathname = '/student'
    }
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
