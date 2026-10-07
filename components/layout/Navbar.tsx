import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-primary">
          TEACH ME
        </Link>
        <div className="flex items-center gap-6 text-sm text-secondaryText">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/explore">Explore</Link>
          <Link href="/sessions">Sessions</Link>
        </div>
      </div>
    </nav>
  );
}
