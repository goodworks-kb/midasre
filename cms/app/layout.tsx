import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Midas Realty - Property Listings',
  description: 'Browse our premium real estate listings',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
