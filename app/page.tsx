import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f7f8f6]">
      <nav className="border-b border-[#e5ebe6] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="brand-lockup"><span className="brand-mark"><Icon name="sparkle" size={18} /></span><span>teach<span className="brand-accent">me</span></span></Link>
          <Link href="/login" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2e6654]">Get started <span aria-hidden="true">→</span></Link>
        </div>
      </nav>

      <section className="relative overflow-hidden px-5 pb-16 pt-20 sm:px-8 sm:pb-24 sm:pt-28">
        <div className="absolute -right-24 top-12 h-80 w-80 rounded-full border border-[#e5ebe6]" />
        <div className="absolute -right-4 top-24 h-56 w-56 rounded-full border border-[#e5ebe6]" />
        <div className="relative mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <p className="eyebrow">A CALMER WAY TO LEARN</p>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.08] tracking-[-2.3px] sm:text-6xl">Make space for what you want to <span className="text-primary">understand.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-secondaryText">Turn watching into learning. Find a lesson, set a small intention, and get gentle support along the way.</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/login" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-[#2e6654]">Start learning <Icon name="arrow" size={17} /></Link>
              <a href="#how-it-works" className="rounded-xl border border-[#dfe6e0] bg-white px-5 py-3 text-sm font-semibold text-[#4d5b52] hover:bg-[#f1f5f1]">See how it works</a>
            </div>
          </div>
        </div>
      </section>
      <section id="how-it-works" className="mx-auto grid max-w-5xl gap-4 px-5 pb-20 sm:grid-cols-3 sm:px-8">
        {[['01', 'Choose what interests you', 'Recommendations start with the things you’re curious about.'], ['02', 'Set your own pace', 'Pick a focus time and an intention that feels right today.'], ['03', 'Reflect on what you learned', 'See your questions, focus time, and progress after each session.']].map(([number, title, text]) => <article key={number} className="rounded-2xl border border-[#e4eae5] bg-white p-5"><span className="text-xs font-bold tracking-wider text-primary">{number}</span><h2 className="mt-4 text-base font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-secondaryText">{text}</p></article>)}
      </section>
    </main>
  );
}
