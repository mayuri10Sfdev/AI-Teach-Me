'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';

const navigation: { href: string; label: string; icon: IconName }[] = [
  { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/explore', label: 'Explore', icon: 'search' },
  { href: '/sessions', label: 'Sessions', icon: 'clock' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [name, setName] = useState('Learner');

  useEffect(() => {
    const storedName = window.localStorage.getItem('teach-me-name');
    if (storedName) setName(storedName);
  }, []);

  return (
    <div className="min-h-screen bg-[#f3f7fc]">
      <aside className="app-sidebar">
        <Link href="/dashboard" className="brand-lockup">
          <span className="brand-mark"><Icon name="sparkle" size={19} /></span>
          <span>Teach Me</span>
        </Link>
        <nav className="sidebar-nav" aria-label="Main navigation">
          {navigation.map((item) => {
            const active = pathname === item.href ||
              (item.href === '/explore' && pathname.startsWith('/video')) ||
              (item.href === '/sessions' && (pathname.startsWith('/study') || pathname.startsWith('/session-report')));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link${active ? ' active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                <Icon name={item.icon} size={19} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span className="assistant-avatar"><Icon name="sparkle" size={18} /></span>
            <p className="mt-3 text-sm font-bold text-ink">Have a question?</p>
            <p className="mt-1 text-center text-xs leading-5 text-secondaryText">Ask Teach Me anytime during your lesson.</p>
            <Link href="/explore" className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-xs font-semibold text-white"><Icon name="help" size={15} /> Ask Teach Me</Link>
          </div>
          <Link className="sidebar-link sidebar-utility" href="/onboarding/interests"><Icon name="settings" size={18} /> Settings</Link>
          <Link className="sidebar-link sidebar-utility" href="/explore"><Icon name="help" size={18} /> Help &amp; Support</Link>
          <div className="profile-row">
            <span className="avatar">{name.charAt(0).toUpperCase()}</span>
            <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-ink">{name}</span><span className="block text-xs text-secondaryText">Learner</span></span>
            <Link aria-label="Sign out" title="Sign out" href="/login" onClick={() => window.localStorage.removeItem('teach-me-name')} className="text-secondaryText hover:text-primary"><Icon name="logout" size={16} /></Link>
          </div>
        </div>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <Link href="/explore" className="topbar-search"><Icon name="search" size={17} /><span>Search videos, skills or topics...</span><kbd>⌘ K</kbd></Link>
          <div className="topbar-profile">
            <Link href="/sessions" aria-label="Notifications" className="notification-button"><Icon name="bell" size={19} /><span /></Link>
            <span className="avatar avatar-small">{name.charAt(0).toUpperCase()}</span>
            <span className="text-sm font-medium text-ink">{name}</span>
            <span className="text-secondaryText">⌄</span>
          </div>
        </header>
        <main className="app-content">{children}</main>
      </div>

      <nav className="mobile-nav" aria-label="Main navigation">
        {navigation.map((item) => {
          const active = pathname === item.href ||
            (item.href === '/explore' && pathname.startsWith('/video')) ||
            (item.href === '/sessions' && (pathname.startsWith('/study') || pathname.startsWith('/session-report')));
          return <Link key={item.href} href={item.href} className={active ? 'active' : ''} aria-label={item.label}><Icon name={item.icon} size={20} /><span>{item.label}</span></Link>;
        })}
      </nav>
    </div>
  );
}
