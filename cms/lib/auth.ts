// Simple password-based authentication
// In production, use proper authentication (NextAuth.js, etc.)

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'midas2024';

export function verifyPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}
