import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Teach Me — Learn at your pace',
  description: 'Find a lesson, set an intention, and make time to learn with Teach Me.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
