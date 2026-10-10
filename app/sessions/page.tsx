'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Icon } from '@/components/ui/Icon';
import { getSupabaseClient } from '@/lib/supabase/client';
import { getCompletedSessions, getErrorMessage, type SessionRecord } from '@/lib/supabase/learning';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    async function loadSessions() {
      try {
        const supabase = getSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (user) setSessions(await getCompletedSessions(user.id));
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      }
    }
    void loadSessions();
  }, []);

  return (
    <AppShell>
      {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-error">{error}</p>}
      <p className="eyebrow">YOUR PROGRESS, AT YOUR PACE</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-1px]">My learning sessions</h1>
      <p className="mt-2 text-sm text-secondaryText">Every session is a little time you made for yourself.</p>
      {sessions.length ? <div className="mt-7 space-y-3">{sessions.map((session) => <Link key={session.id} href={`/session-report/${session.id}`} className="flex flex-col justify-between gap-4 rounded-2xl border border-[#e4eae5] bg-white p-4 transition hover:border-[#bfd0c2] sm:flex-row sm:items-center sm:p-5"><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#edf4ff] text-primary"><Icon name="book" size={18} /></span><div><h2 className="text-sm font-semibold">{session.title}</h2><p className="mt-1 text-xs text-secondaryText">{new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(session.completedAt))} · {session.intention}</p></div></div><div className="flex items-center justify-between gap-4 pl-[52px] sm:pl-0"><span className="text-xs text-secondaryText">{session.focusMinutes || '<1'} focused min</span><Icon name="chevron" size={17} className="text-[#8b968f]" /></div></Link>)}</div> : <div className="mt-8 rounded-2xl border border-dashed border-[#dce4dd] bg-white px-5 py-14 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[#edf4ff] text-primary"><Icon name="clock" size={22} /></span><h2 className="mt-4 text-sm font-semibold">Your first session is waiting.</h2><p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-secondaryText">When you finish a learning session, you’ll find your notes and progress here.</p><Link href="/explore" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-white">Explore a lesson <Icon name="arrow" size={15} /></Link></div>}
    </AppShell>
  );
}
