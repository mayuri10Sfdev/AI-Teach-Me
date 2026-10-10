'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Icon } from '@/components/ui/Icon';
import { getSupabaseClient } from '@/lib/supabase/client';
import { getCompletedSession, getErrorMessage, type SessionRecord } from '@/lib/supabase/learning';

export default function SessionReportPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [session, setSession] = useState<SessionRecord | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSession() {
      try {
        const supabase = getSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user) {
          router.replace('/login');
          return;
        }
        const found = await getCompletedSession(user.id, params.id);
        if (found) setSession(found);
        else router.replace('/sessions');
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      }
    }
    void loadSession();
  }, [params.id, router]);

  if (!session) {
    return error ? (
      <AppShell><p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-error">{error}</p></AppShell>
    ) : null;
  }

  const completed = new Date(session.completedAt);
  const completedDate = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(completed);

  return (
    <AppShell>
      {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-error">{error}</p>}
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#eaf1ff] text-primary"><Icon name="check" size={27} /></span>
          <p className="eyebrow mt-5">A MOMENT WELL SPENT</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-1px]">You showed up. That counts.</h1>
          <p className="mt-2 text-sm text-secondaryText">{completedDate} · Your learning session</p>
        </div>
        <section className="mt-8 rounded-2xl border border-[#e4eae5] bg-white p-5 sm:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[.1em] text-primary">TODAY YOU EXPLORED</p>
          <h2 className="mt-2 text-xl font-semibold">{session.title}</h2>
          <div className="mt-6 grid grid-cols-3 gap-3 border-y border-[#edf0ed] py-5">
            <div><p className="text-2xl font-semibold">{session.focusMinutes || '<1'}<span className="ml-1 text-xs font-normal text-secondaryText">min</span></p><p className="mt-1 text-[11px] text-secondaryText">Focus time</p></div>
            <div><p className="text-2xl font-semibold">{session.questions}</p><p className="mt-1 text-[11px] text-secondaryText">Questions asked</p></div>
            <div><p className="text-2xl font-semibold">{session.distractions}</p><p className="mt-1 text-[11px] text-secondaryText">Gentle resets</p></div>
          </div>
          <div className="mt-5 rounded-xl bg-[#f4f7fc] p-4"><p className="text-[10px] font-semibold uppercase tracking-[.1em] text-[#72809a]">YOUR INTENTION</p><p className="mt-1.5 text-sm font-medium">“{session.intention}”</p></div>
          <p className="mt-5 text-xs leading-5 text-secondaryText">Learning isn’t about getting everything right. It’s about giving yourself the time to try.</p>
        </section>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={`/video/${session.videoId}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-[#1554d3]">Keep learning <Icon name="arrow" size={16} /></Link>
          <Link href="/dashboard" className="inline-flex items-center justify-center rounded-xl border border-[#e1e8f2] bg-white px-5 py-3 text-sm font-semibold text-[#536178] hover:bg-[#f5f8fd]">Back to home</Link>
        </div>
      </div>
    </AppShell>
  );
}
