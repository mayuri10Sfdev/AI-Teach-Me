import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-[#17418b] px-14 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full border border-white/10" />
        <div className="absolute -right-20 top-[30%] h-72 w-72 rounded-full border border-white/10" />
        <Link href="/" className="relative inline-flex w-fit items-center gap-2.5 text-xl font-bold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/15"><Icon name="sparkle" size={18} /></span>
          teach<span className="text-[#b9d2ff]">me</span>
        </Link>
        <div className="relative max-w-lg pb-8">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[.2em] text-[#b9d2ff]">A calmer way to learn</p>
          <h1 className="text-4xl font-semibold leading-tight tracking-[-1.6px] xl:text-5xl">Make space for the things you want to understand.</h1>
          <p className="mt-5 max-w-md text-base leading-7 text-white/70">Learn with intention, stay in your flow, and get a little help whenever you need it.</p>
        </div>
        <p className="relative text-xs text-white/45">A focused moment is a good place to start.</p>
      </section>
      <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-[410px]">
          <div className="mb-10 text-center lg:hidden">
            <Link href="/" className="brand-lockup mx-auto"><span className="brand-mark"><Icon name="sparkle" size={18} /></span><span>teach<span className="brand-accent">me</span></span></Link>
          </div>
          <LoginForm />
          <p className="mt-6 text-center text-xs leading-5 text-secondaryText">By continuing, you agree to learn at your own pace. Your account and learning profile are securely stored with Supabase.</p>
        </div>
      </section>
    </main>
  );
}
