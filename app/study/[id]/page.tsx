'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Icon } from '@/components/ui/Icon';
import { VIDEOS } from '@/lib/constants/videos';
import { getSupabaseClient } from '@/lib/supabase/client';
import { getErrorMessage, saveCompletedSession, type ChatMessage, type SessionRecord } from '@/lib/supabase/learning';

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

export default function StudySessionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const video = useMemo(() => VIDEOS.find((item) => item.id === params.id), [params.id]);
  const [duration, setDuration] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [intention, setIntention] = useState('Understand the key ideas');
  const [paused, setPaused] = useState(false);
  const [warningVisible, setWarningVisible] = useState(false);
  const [distractions, setDistractions] = useState(0);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isAsking, setIsAsking] = useState(false);

  useEffect(() => {
    if (!video) {
      router.replace('/explore');
      return;
    }
    const savedDuration = Number(window.localStorage.getItem('teach-me-duration')) || 25;
    setDuration(savedDuration);
    setSecondsLeft(savedDuration * 60);
    setIntention(window.localStorage.getItem('teach-me-intention') || 'Understand the key ideas');
  }, [router, video]);

  useEffect(() => {
    if (paused || secondsLeft <= 0) return;
    const timer = window.setInterval(() => setSecondsLeft((value) => Math.max(value - 1, 0)), 1000);
    return () => window.clearInterval(timer);
  }, [paused, secondsLeft]);

  if (!video) return null;
  const currentVideo = video;

  async function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || isAsking) return;
    setSaveError('');
    setIsAsking(true);
    try {
      const supabase = getSupabaseClient();
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError) throw authError;
      if (!session) throw new Error('Your sign-in has expired. Please sign in again to ask the tutor.');

      const history = messages.flatMap((message) => [
        { role: 'user' as const, content: message.question },
        { role: 'assistant' as const, content: message.answer },
      ]).slice(-10);
      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${session.access_token}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ videoId: currentVideo.id, question: trimmed, history }),
      });
      const result = await response.json() as { answer?: string; error?: string };
      if (!response.ok) throw new Error(result.error || 'The tutor could not answer. Please try again.');
      const answer = result.answer;
      if (!answer) throw new Error('The tutor returned an empty answer. Please try again.');

      setMessages((current) => [...current, { question: trimmed, answer }]);
      setQuestion('');
    } catch (askError) {
      setSaveError(getErrorMessage(askError));
    } finally {
      setIsAsking(false);
    }
  }

  async function finishSession() {
    setSaveError('');
    setIsSaving(true);
    const record: Omit<SessionRecord, 'title'> = {
      id: window.crypto.randomUUID(),
      videoId: currentVideo.id,
      intention,
      focusMinutes: Math.floor((duration * 60 - secondsLeft) / 60),
      distractions,
      questions: messages.length,
      completedAt: new Date().toISOString(),
    };
    try {
      const supabase = getSupabaseClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('Your sign-in has expired. Please sign in again before saving this session.');
      await saveCompletedSession(user.id, record, duration, duration * 60 - secondsLeft, messages);
      router.push(`/session-report/${record.id}`);
    } catch (saveError) {
      setSaveError(getErrorMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  }

  function markDistracted() {
    setDistractions((value) => value + 1);
    setWarningVisible(true);
    setPaused(true);
  }

  return (
    <AppShell>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div><p className="eyebrow">FOCUSED LEARNING SESSION</p><h1 className="mt-1 text-xl font-semibold tracking-[-.4px]">{video.title}</h1></div>
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${paused ? 'bg-[#f7f0e8] text-[#ad7839]' : 'bg-[#edf4ff] text-[#2164ee]'}`}><span className={`h-1.5 w-1.5 rounded-full ${paused ? 'bg-[#d49a50]' : 'bg-[#3978ee]'}`} />{paused ? 'Paused' : 'In your focus time'}</span>
      </div>
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,.8fr)]">
        <div className="space-y-4">
          <section className="learning-screen">
            <div className="learning-orbit" />
            <div className="relative z-[1] max-w-md px-7 text-center text-white">
              <div className="mx-auto grid h-[68px] w-[68px] place-items-center rounded-2xl border border-white/15 bg-white/10 text-[#c6dfce]"><Icon name="video" size={30} /></div>
              <p className="mt-5 text-[10px] font-semibold uppercase tracking-[.18em] text-[#b8d0c0]">YOUR LEARNING SPACE</p>
              <h2 className="mt-2 text-xl font-semibold">{video.title}</h2>
              <p className="mt-2 text-xs text-white/65">The video player is not connected in this prototype. Your session timer, notes, and focus tools are ready to try.</p>
            </div>
            <div className="absolute bottom-4 left-4 right-4 z-[1] flex items-center justify-between gap-3 text-[10px] text-white/70"><span>Lesson · {video.instructor}</span><span>{formatTime(secondsLeft)} remaining</span></div>
          </section>

          {warningVisible && <div role="status" className="flex items-start gap-3 rounded-xl border border-[#f1e2cb] bg-[#fffaf2] p-4"><span className="mt-0.5 text-[#bd823d]"><Icon name="sparkle" size={17} /></span><div className="flex-1"><p className="text-xs font-semibold text-[#604b32]">It happens. Let’s gently come back.</p><p className="mt-1 text-xs leading-5 text-[#786750]">Take one slow breath, then return to your intention: “{intention}.”</p></div><button onClick={() => { setWarningVisible(false); setPaused(false); }} className="rounded-lg bg-[#f2e7d6] px-3 py-2 text-xs font-semibold text-[#765a35]">I’m ready</button></div>}

          <section className="rounded-2xl border border-[#e4eae5] bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#edf4ff] text-primary"><Icon name="clock" size={19} /></span><div><p className="text-xs text-secondaryText">Your focus time</p><p className="font-mono text-xl font-semibold tracking-wide">{formatTime(secondsLeft)} <span className="font-sans text-[11px] font-normal text-secondaryText">/ {duration} min</span></p></div></div>
              <div className="flex flex-wrap gap-2"><button onClick={() => setPaused((value) => !value)} className="rounded-lg border border-[#e1e8e2] px-3 py-2 text-xs font-semibold text-[#536158] hover:bg-[#f6f8f6]">{paused ? 'Resume timer' : 'Pause timer'}</button><button onClick={markDistracted} className="inline-flex items-center gap-1.5 rounded-lg border border-[#eee4d7] px-3 py-2 text-xs font-semibold text-[#9b713f] hover:bg-[#fff9f1]"><Icon name="warning" size={14} /> I got distracted</button></div>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#edf1ed]"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, Math.max(0, ((duration * 60 - secondsLeft) / (duration * 60)) * 100))}%` }} /></div>
          </section>

          <div className="flex items-center justify-between rounded-xl border border-[#e8ece8] bg-white px-4 py-3"><p className="text-xs text-secondaryText">When you’re ready, you can wrap up this session.</p><button onClick={() => void finishSession()} disabled={isSaving} className="whitespace-nowrap rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#2e6654] disabled:opacity-50">{isSaving ? 'Saving…' : 'Finish session'}</button></div>
          {saveError && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-error">{saveError}</p>}
        </div>

        <aside className="overflow-hidden rounded-2xl border border-[#e4eae5] bg-white">
          <div className="flex items-center justify-between border-b border-[#edf0ed] px-4 py-4"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#edf4ff] text-primary"><Icon name="sparkle" size={16} /></span><div><h2 className="text-sm font-semibold">Ask Teach Me</h2><p className="text-[10px] text-secondaryText">A little help as you learn</p></div></div><span className="rounded-full bg-[#f2f3f1] px-2 py-1 text-[9px] font-medium text-[#7a857e]">DEMO</span></div>
          <div className="chat-scroll flex min-h-[260px] max-h-[440px] flex-col gap-3 overflow-y-auto p-4">
            <div className="max-w-[92%] rounded-xl rounded-tl-sm bg-[#f3f6f3] p-3"><p className="text-xs leading-5 text-[#536158]">Hi! I can help you think through this lesson. What would you like to understand better?</p><p className="mt-2 text-[9px] text-[#929b95]">Demo response · not connected to an AI service</p></div>
            {messages.map((message, index) => <div key={`${message.question}-${index}`} className="space-y-2"><p className="ml-auto max-w-[92%] rounded-xl rounded-tr-sm bg-primary p-3 text-xs leading-5 text-white">{message.question}</p><div className="max-w-[92%] rounded-xl rounded-tl-sm bg-[#f3f6f3] p-3"><p className="text-xs leading-5 text-[#536158]">{message.answer}</p><p className="mt-2 text-[9px] text-[#929b95]">AI response · lesson metadata context</p></div></div>)}
          </div>
          <div className="border-t border-[#edf0ed] p-4">
            <div className="mb-3 flex flex-wrap gap-1.5">{['Give me an example', 'Why does this matter?'].map((prompt) => <button key={prompt} onClick={() => setQuestion(prompt)} className="rounded-full border border-[#e5eae5] px-2.5 py-1.5 text-[10px] text-[#647168] hover:border-[#a9c4b0]">{prompt}</button>)}</div>
            <form onSubmit={(event) => void submitQuestion(event)} className="flex items-center gap-2 rounded-xl border border-[#e2e8e3] bg-white p-1.5 focus-within:border-[#8eae98]">
              <label className="sr-only" htmlFor="teach-me-question">Ask a question about this lesson</label>
              <input id="teach-me-question" value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={2000} placeholder="Ask about this lesson..." className="min-w-0 flex-1 bg-transparent px-2 text-xs outline-none placeholder:text-[#a3aca6]" />
              <button type="submit" aria-label="Send question" disabled={!question.trim() || isAsking} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-white disabled:opacity-40"><Icon name="send" size={15} /></button>
            </form>
            <p className="mt-2 text-[9px] leading-4 text-[#929b95]" aria-live="polite">{isAsking ? 'The AI tutor is thinking…' : 'AI answers use lesson metadata; no transcript is connected yet.'}</p>
            {saveError && <p role="alert" className="mt-2 text-xs text-error">{saveError}</p>}
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
