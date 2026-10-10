import type { Video } from '@/lib/types';

export function YouTubePlayer({ video }: { video: Video }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.youtubeVideoId)}`}
        title={video.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
