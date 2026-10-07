'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Input } from '@/components/ui';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const name = email.split('@')[0]?.replace(/[._-]+/g, ' ').trim();
    if (!email.includes('@') || password.length < 6) {
      setError('Enter a valid email and a password with at least 6 characters.');
      return;
    }
    window.localStorage.setItem('teach-me-name', name || 'Learner');
    window.localStorage.setItem('teach-me-email', email);
    router.push('/onboarding/interests');
  }

  return (
    <div>
      <p className="eyebrow mb-3">YOUR LEARNING JOURNEY STARTS HERE</p>
      <h1 className="text-[30px] font-semibold tracking-[-1px]">Welcome back.</h1>
      <p className="mt-2 text-sm leading-6 text-secondaryText">Sign in to pick up where your curiosity left off.</p>
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          minLength={6}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
        />
        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-error">{error}</p>}
        <Button className="w-full" type="submit">Continue with email <span aria-hidden="true">→</span></Button>
      </form>
      <div className="my-6 flex items-center gap-3 text-xs text-[#a2aaa5]"><span className="h-px flex-1 bg-border" />OR<span className="h-px flex-1 bg-border" /></div>
      <p className="text-center text-xs text-secondaryText">Your demo learning profile is created on this device when you continue.</p>
    </div>
  );
}
