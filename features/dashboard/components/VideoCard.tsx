import Link from 'next/link';
import { Badge, Button, Card } from '@/components/ui';
import type { Video } from '@/lib/types';

export function VideoCard({ video }: { video: Video }) {
  return (
    <Card variant="elevated" className="h-full">
      <div className="mb-4 flex h-36 items-center justify-center rounded-xl bg-surface-alt text-secondaryText">
        Thumbnail
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
        <Badge variant="primary">{video.category}</Badge>
        <Badge variant="success">{video.difficulty}</Badge>
      </div>
      <h3 className="text-h3 font-semibold">{video.title}</h3>
      <p className="mt-2 text-body text-secondaryText">{video.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-label text-secondaryText">{video.duration} mins</span>
        <Link href={`/study/${video.id}`}>
          <Button variant="secondary" size="sm">
            Start
          </Button>
        </Link>
      </div>
    </Card>
  );
}
