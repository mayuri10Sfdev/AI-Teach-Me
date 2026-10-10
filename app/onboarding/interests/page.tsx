'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { INTERESTS } from '@/lib/constants';

export default function InterestsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState('there');

  useEffect(() => {
    const storedInterests = window.localStorage.getItem('teach-me-interests');
    if (storedInterests) setSelected(JSON.parse(storedInterests) as string[]);
    const storedName = window.localStorage.getItem('teach-me-name');
    if (storedName) setName(storedName.split(' ')[0]);
  }, []);

  function toggleInterest(interest: string) {
    setSelected((current) => current.includes(interest)
      ? current.filter((item) => item !== interest)
      : [...current, interest]);
  }

  function continueToDashboard() {
    if (!selected.length) return;
    window.localStorage.setItem('teach-me-interests', JSON.stringify(selected));
    router.push('/dashboard');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f7fc] px-4 py-10">
      <section className="w-full max-w-[720px] rounded-3xl border border-[#e2eaf5] bg-white px-6 py-8 shadow-[0_16px_48px_rgba(33,79,150,.06)] sm:px-10 sm:py-10">
        <Link href="/dashboard" className="brand-lockup mb-10"><span className="brand-mark"><Icon name="sparkle" size={18} /></span><span>teach<span className="brand-accent">me</span></span></Link>
        <div className="mb-7 h-1.5 overflow-hidden rounded-full bg-[#edf2f9]"><div className="h-full w-1/2 rounded-full bg-primary" /></div>
        <p className="eyebrow">A LITTLE ABOUT YOU · 1 OF 2</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-1px]">What are you curious about, {name}?</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-secondaryText">Choose a few topics you’d like to explore. We’ll use them to shape your recommendations — you can always change these later.</p>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {INTERESTS.map((interest) => {
            const active = selected.includes(interest);
            return (
              <button key={interest} type="button" aria-pressed={active} onClick={() => toggleInterest(interest)}
                className={`flex min-h-[54px] items-center justify-between gap-2 rounded-xl border px-3 text-left text-sm transition-colors ${active ? 'border-[#83aaf5] bg-[#f0f5ff] font-semibold text-[#2456aa]' : 'border-[#e5ebf4] bg-white text-[#526178] hover:border-[#a9c2f2]'}`}>
                <span>{interest}</span>
                <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${active ? 'border-primary bg-primary text-white' : 'border-[#dce5f2] text-transparent'}`}><Icon name="check" size={13} /></span>
              </button>
            );
          })}
        </div>
        <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 border-t border-[#edf1f7] pt-6 sm:flex-row">
          <p className="text-xs text-secondaryText" aria-live="polite">{selected.length} {selected.length === 1 ? 'topic' : 'topics'} selected</p>
          <button type="button" onClick={continueToDashboard} disabled={!selected.length} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1554d3] disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto">
            Build my learning space <Icon name="arrow" size={17} />
          </button>
        </div>
      </section>
    </main>
  );
}
