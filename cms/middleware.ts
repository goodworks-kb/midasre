// Middleware removed - no longer needed
// Login page moved outside admin directory to prevent redirect loops

export function middleware() {
  // Empty middleware
}

export const config = {
  matcher: '/admin/:path*',
};
