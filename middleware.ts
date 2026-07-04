import { NextRequest, NextResponse } from 'next/server';

/**
 * Gates every /admin/* route server-side (SDD §7.7 — "Admin routes gated
 * server-side, not just client redirect"). Session verification against
 * Supabase is wired in once the real project + auth cookies exist
 * (Phase 5/6); for now this only establishes the matcher and the shape
 * of the check so no route ships without this gate present.
 */
export async function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginRoute = request.nextUrl.pathname === '/admin/login';

  if (isAdminRoute && !isLoginRoute) {
    // TODO (Phase 5/6): verify Supabase session cookie here; redirect to
    // /admin/login when absent or role !== 'admin'.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
