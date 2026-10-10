'use client';

import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { VideoTile } from '@/components/dashboard/VideoTile';
import { Icon } from '@/components/ui/Icon';
import { VIDEOS } from '@/lib/constants/videos';

const categories = ['All topics', 'Artificial Intelligence', 'Python', 'Salesforce', 'Data Science', 'Cloud Computing'];

export default function ExplorePage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All topics');

  useEffect(() => {
    const topic = new URLSearchParams(window.location.search).get('topic');
    if (topic && categories.includes(topic)) setCategory(topic);
    else if (topic) setQuery(topic);
  }, []);

  const results = useMemo(() => VIDEOS.filter((video) => {
    const matchesCategory = category === 'All topics' || video.category === category;
    const search = `${video.title} ${video.category} ${video.description}`.toLowerCase();
    return matchesCategory && search.includes(query.toLowerCase().trim());
  }), [category, query]);

  return (
    <AppShell>
      <div className="max-w-2xl"><p className="eyebrow">A LIBRARY FOR YOUR NEXT CURIOSITY</p><h1 className="mt-2 text-3xl font-semibold tracking-[-1px]">Find something to learn.</h1><p className="mt-2 text-sm leading-6 text-secondaryText">A growing collection of short lessons. Choose one that feels right for today.</p></div>
      <label className="mt-7 flex max-w-xl items-center gap-3 rounded-xl border border-[#e2eaf5] bg-white px-4 py-3.5 focus-within:border-[#83aaf5] focus-within:ring-2 focus-within:ring-[#2164ee]/10">
        <Icon name="search" size={19} className="text-[#8b9690]" />
        <span className="sr-only">Search lessons</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search skills, topics, or lessons" className="w-full bg-transparent text-sm outline-none placeholder:text-[#a0aaa3]" />
      </label>
      <div className="chat-scroll mt-5 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Filter by topic">
        {categories.map((item) => <button key={item} onClick={() => setCategory(item)} aria-pressed={category === item} className={`whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-medium transition ${category === item ? 'border-primary bg-primary text-white' : 'border-[#e2eaf5] bg-white text-[#67758a] hover:border-[#9bb8f1]'}`}>{item}</button>)}
      </div>
      <div className="mb-4 mt-8 flex items-center justify-between"><h2 className="section-title">Lessons to explore</h2><span className="text-xs text-secondaryText">{results.length} {results.length === 1 ? 'lesson' : 'lessons'}</span></div>
      {results.length ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{results.map((video) => <VideoTile key={video.id} video={video} />)}</div> : <div className="rounded-2xl border border-dashed border-[#dce4dd] bg-white px-5 py-14 text-center"><Icon name="search" size={25} className="mx-auto text-[#8e9b92]" /><p className="mt-4 text-sm font-semibold">No lessons match that search yet.</p><p className="mt-1 text-xs text-secondaryText">Try another topic or a different search.</p><button onClick={() => { setQuery(''); setCategory('All topics'); window.history.replaceState(null, '', '/explore'); }} className="mt-4 text-xs font-semibold text-primary">Clear filters</button></div>}
    </AppShell>
  );
}
