// Empty layout for login page - bypasses admin authentication check
// This prevents redirect loops when accessing /admin/login
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
