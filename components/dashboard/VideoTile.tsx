import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import type { Video } from '@/lib/types';

export function VideoTile({ video, compact = false }: { video: Video; compact?: boolean }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#e5eae5] bg-white transition-shadow hover:shadow-[0_10px_28px_rgba(34,58,45,.07)]">
      <Link href={`/video/${video.id}`} aria-label={`View ${video.title}`}>
        <div className={`video-thumb bg-gradient-to-br ${video.thumbnail ?? 'from-emerald-500 to-green-700'} ${compact ? 'min-h-[135px]' : ''}`}>
          <span className="thumb-play"><Icon name="play" size={18} fill="currentColor" /></span>
          <span className="absolute bottom-3 right-3 z-[1] rounded-md bg-black/30 px-2 py-1 text-[11px] font-medium text-white backdrop-blur">{video.duration} min</span>
        </div>
      </Link>
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="truncate rounded-full bg-[#edf4ef] px-2.5 py-1 text-[10px] font-semibold text-[#4d7965]">{video.category}</span>
          <span className="text-[10px] text-secondaryText">{video.difficulty}</span>
        </div>
        <Link href={`/video/${video.id}`} className="line-clamp-2 text-sm font-semibold leading-5 text-ink hover:text-primary">{video.title}</Link>
        {!compact && <p className="mt-2 line-clamp-2 text-xs leading-5 text-secondaryText">{video.description}</p>}
        <div className="mt-4 flex items-center justify-between border-t border-[#eff2ef] pt-3">
          <span className="text-[11px] text-secondaryText">{video.instructor}</span>
          <Link href={`/video/${video.id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-primary">View lesson <Icon name="chevron" size={14} /></Link>
        </div>
      </div>
    </article>
  );
}
