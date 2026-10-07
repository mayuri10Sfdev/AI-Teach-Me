import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Icon } from '@/components/ui/Icon';
import { VIDEOS } from '@/lib/constants/videos';

export default function VideoDetailsPage({ params }: { params: { id: string } }) {
  const video = VIDEOS.find((item) => item.id === params.id);
  if (!video) notFound();

  return (
    <AppShell>
      <Link href="/explore" className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-secondaryText hover:text-primary"><span aria-hidden="true">←</span> Back to lessons</Link>
      <div className="grid gap-7 lg:grid-cols-[1.45fr_.8fr]">
        <div>
          <div className={`video-thumb min-h-[260px] bg-gradient-to-br sm:min-h-[350px] ${video.thumbnail ?? 'from-emerald-500 to-green-700'}`}>
            <div className="relative z-[1] max-w-sm px-6 text-center text-white">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-white/40 bg-white/15 backdrop-blur"><Icon name="play" size={22} fill="currentColor" /></span>
              <p className="mt-4 text-sm font-semibold">Lesson preview</p>
              <p className="mt-1 text-xs text-white/75">Video playback is not connected in this prototype.</p>
            </div>
            <span className="absolute bottom-4 right-4 z-[1] rounded-md bg-black/25 px-2.5 py-1.5 text-xs text-white">{video.duration} minutes</span>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#edf4ef] px-3 py-1.5 text-xs font-semibold text-[#4d7965]">{video.category}</span><span className="rounded-full bg-[#f2f3f1] px-3 py-1.5 text-xs text-[#6f7b73]">{video.difficulty}</span></div>
          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-[-1px]">{video.title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-secondaryText">{video.description}</p>
          <div className="mt-7 grid gap-4 border-t border-[#e8ede9] pt-6 sm:grid-cols-2">
            <div><p className="text-xs text-secondaryText">You’ll practice</p><p className="mt-1 text-sm font-semibold">{video.skill}</p></div>
            <div><p className="text-xs text-secondaryText">Lesson guide</p><p className="mt-1 text-sm font-semibold">{video.instructor}</p></div>
          </div>
        </div>
        <aside className="h-fit rounded-2xl border border-[#e4eae5] bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2 text-sm font-semibold"><Icon name="target" size={17} className="text-primary" /> Make it a focused session</div>
          <p className="mt-2 text-xs leading-5 text-secondaryText">Set a small intention before you begin. Teach Me will help you stay on track.</p>
          <div className="my-5 space-y-3 border-y border-[#edf0ed] py-5">
            <div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#f0f4f0] text-primary"><Icon name="clock" size={16} /></span><div><p className="text-xs font-semibold">About {video.duration} minutes</p><p className="text-[11px] text-secondaryText">At your own pace</p></div></div>
            <div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#f0f4f0] text-primary"><Icon name="headphones" size={16} /></span><div><p className="text-xs font-semibold">AI learning companion</p><p className="text-[11px] text-secondaryText">Ask questions along the way</p></div></div>
          </div>
          <Link href={`/study/${video.id}/prepare`} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2e6654]">Prepare my session <Icon name="arrow" size={16} /></Link>
          <p className="mt-3 text-center text-[10px] leading-4 text-secondaryText">The lesson player is a visual demo in this prototype.</p>
        </aside>
      </div>
    </AppShell>
  );
}
