'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Input } from '@/components/ui';
import { getSupabaseClient } from '@/lib/supabase/client';
import { getErrorMessage } from '@/lib/supabase/learning';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);
    const name = email.split('@')[0]?.replace(/[._-]+/g, ' ').trim() || 'Learner';

    try {
      const supabase = getSupabaseClient();
      if (isCreatingAccount) {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (authError) throw authError;
        if (!data.session) {
          setMessage('Account created. Check your email to confirm your address, then sign in.');
          setIsCreatingAccount(false);
          return;
        }
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
      }

      router.push('/onboarding/interests');
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <p className="eyebrow mb-3">YOUR LEARNING JOURNEY STARTS HERE</p>
      <h1 className="text-[30px] font-semibold tracking-[-1px]">{isCreatingAccount ? 'Create your account.' : 'Welcome back.'}</h1>
      <p className="mt-2 text-sm leading-6 text-secondaryText">{isCreatingAccount ? 'Create an account to save your learning journey.' : 'Sign in to pick up where your curiosity left off.'}</p>
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
          autoComplete={isCreatingAccount ? 'new-password' : 'current-password'}
          minLength={6}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
        />
        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-error">{error}</p>}
        {message && <p role="status" className="rounded-lg bg-[#edf4ff] px-3 py-2 text-sm text-primary">{message}</p>}
        <Button className="w-full" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Please wait…' : isCreatingAccount ? 'Create account' : 'Sign in'} <span aria-hidden="true">→</span></Button>
      </form>
      <div className="my-6 flex items-center gap-3 text-xs text-[#a2aaa5]"><span className="h-px flex-1 bg-border" />OR<span className="h-px flex-1 bg-border" /></div>
      <p className="text-center text-xs text-secondaryText">
        {isCreatingAccount ? 'Already have an account? ' : 'New to Teach Me? '}
        <button type="button" className="font-semibold text-primary" onClick={() => { setIsCreatingAccount((value) => !value); setError(''); setMessage(''); }}>
          {isCreatingAccount ? 'Sign in' : 'Create an account'}
        </button>
      </p>
    </div>
  );
}
