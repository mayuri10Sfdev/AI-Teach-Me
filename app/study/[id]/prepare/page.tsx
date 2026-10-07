'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Icon } from '@/components/ui/Icon';
import { VIDEOS } from '@/lib/constants/videos';

const intentions = ['Understand the key ideas', 'Practice a new skill', 'Get a quick overview'];

export default function PrepareSessionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const video = VIDEOS.find((item) => item.id === params.id);
  const [intention, setIntention] = useState(intentions[0]);
  const [duration, setDuration] = useState(25);
  const [focusRemindersOn, setFocusRemindersOn] = useState(false);

  useEffect(() => {
    if (!video) router.replace('/explore');
  }, [router, video]);

  if (!video) return null;
  const currentVideo = video;

  function startSession() {
    window.localStorage.setItem('teach-me-intention', intention);
    window.localStorage.setItem('teach-me-duration', String(duration));
    window.localStorage.setItem('teach-me-focus-reminders', focusRemindersOn ? 'on' : 'off');
    router.push(`/study/${currentVideo.id}`);
  }

  return (
    <AppShell>
      <Link href={`/video/${video.id}`} className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-secondaryText hover:text-primary"><span aria-hidden="true">←</span> Back to lesson</Link>
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">BEFORE YOU BEGIN</p><h1 className="mt-2 text-3xl font-semibold tracking-[-1px]">Let’s make this time yours.</h1><p className="mt-2 text-sm leading-6 text-secondaryText">A moment to set up can make it easier to settle in.</p>
        <section className="mt-7 rounded-2xl border border-[#e4eae5] bg-white p-5 sm:p-7">
          <div className="flex items-center gap-3 border-b border-[#edf0ed] pb-5"><div className={`grid h-14 w-14 place-items-center rounded-xl bg-gradient-to-br ${video.thumbnail ?? 'from-emerald-500 to-green-700'} text-white`}><Icon name="video" size={23} /></div><div className="min-w-0"><p className="text-[11px] font-medium text-primary">{video.category} · {video.difficulty}</p><h2 className="mt-1 truncate text-sm font-semibold">{video.title}</h2><p className="mt-1 text-xs text-secondaryText">About {video.duration} minutes</p></div></div>
          <div className="mt-6">
            <h3 className="text-sm font-semibold">What would you like to get from this session?</h3>
            <p className="mt-1 text-xs text-secondaryText">Choose an intention to keep in mind while you learn.</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">{intentions.map((item) => <button key={item} onClick={() => setIntention(item)} aria-pressed={intention === item} className={`rounded-xl border px-3 py-3 text-left text-xs font-medium ${intention === item ? 'border-[#82aa90] bg-[#f0f6f1] text-[#315f50]' : 'border-[#e5eae5] text-[#627067] hover:border-[#adc5b3]'}`}>{item}</button>)}</div>
          </div>
          <div className="mt-6">
            <h3 className="text-sm font-semibold">How long would you like to focus?</h3>
            <div className="mt-3 flex flex-wrap gap-2">{[15, 25, 40].map((mins) => <button key={mins} onClick={() => setDuration(mins)} aria-pressed={duration === mins} className={`min-w-[82px] rounded-lg border px-4 py-2.5 text-sm font-semibold ${duration === mins ? 'border-[#35735f] bg-[#eef4ef] text-[#315f50]' : 'border-[#e5eae5] text-[#627067]'}`}>{mins} min</button>)}</div>
          </div>
          <div className="mt-6 flex items-start justify-between gap-4 rounded-xl border border-[#e6ebe6] bg-[#fafbf9] p-4">
            <div className="flex gap-3"><span className="mt-0.5 text-primary"><Icon name="target" size={19} /></span><div><p className="text-xs font-semibold">Focus check-ins</p><p className="mt-1 max-w-md text-[11px] leading-5 text-secondaryText">Optional gentle reminders can help you return to your intention. This demo does not use your camera.</p></div></div>
            <button role="switch" aria-checked={focusRemindersOn} onClick={() => setFocusRemindersOn((value) => !value)} className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition ${focusRemindersOn ? 'bg-primary' : 'bg-[#dbe2dc]'}`} aria-label="Toggle optional focus reminders"><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${focusRemindersOn ? 'left-6' : 'left-1'}`} /></button>
          </div>
          <div className="mt-6 flex flex-col-reverse items-center justify-between gap-4 border-t border-[#edf0ed] pt-5 sm:flex-row">
            <p className="text-[11px] text-secondaryText">You can change this setting any time.</p>
            <button onClick={startSession} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-[#2e6654] sm:w-auto">Start my session <Icon name="arrow" size={16} /></button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
