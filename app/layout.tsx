import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Teach Me',
  description: 'Learn with focus. Master with AI.',
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
