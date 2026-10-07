import Link from 'next/link';
import { Button } from '@/components/ui';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <nav className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="text-2xl font-bold text-primary">TEACH ME</div>
          <Link href="/login">
            <Button variant="primary">Start Learning</Button>
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            AI-powered learning supervision
          </p>
          <h1 className="text-display">
            Learn with Focus.
            <span className="block text-primary">Master with AI.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-body-lg text-secondaryText">
            Turn passive video watching into focused, interactive learning with
            AI-powered supervision and real-time learning assistance.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button variant="primary" size="lg">
                Start Learning
              </Button>
            </Link>
            <Button variant="secondary" size="lg">
              See How It Works
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
