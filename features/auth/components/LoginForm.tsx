'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { getSupabaseClient } from '@/lib/supabase/client';
import { getErrorMessage } from '@/lib/supabase/learning';

type OtpChannel = 'email' | 'phone';
type AuthStep = 'details' | 'login-otp' | 'signup-first-otp' | 'signup-second-otp';

export function LoginForm() {
  const router = useRouter();
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [step, setStep] = useState<AuthStep>('details');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [channel, setChannel] = useState<OtpChannel>('email');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
  const isOtpStep = step !== 'details';
  const isSecondarySignupOtp = step === 'signup-second-otp';
  const otpChannel: OtpChannel = isSecondarySignupOtp
    ? channel === 'email' ? 'phone' : 'email'
    : channel;
  const otpDestination = otpChannel === 'email' ? email : phone;

  function clearFeedback() {
    setError('');
    setMessage('');
  }

  async function requestOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearFeedback();
    setIsSubmitting(true);

    try {
      const supabase = getSupabaseClient();
      if (isCreatingAccount) {
        if (!firstName.trim() || !lastName.trim()) {
          throw new Error('Enter your first and last name.');
        }
        if (!/^\+[1-9]\d{7,14}$/.test(phone.trim())) {
          throw new Error('Enter your phone number in international format, for example +14155552671.');
        }

        const credentials = channel === 'email' ? { email: email.trim() } : { phone: phone.trim() };
        const { error: otpError } = await supabase.auth.signInWithOtp({
          ...credentials,
          options: {
            shouldCreateUser: true,
            data: {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              full_name: fullName,
              email: email.trim().toLowerCase(),
              phone: phone.trim(),
            },
          },
        });
        if (otpError) throw otpError;
        setStep('signup-first-otp');
        setMessage(`We sent a verification code to ${channel === 'email' ? email : phone}.`);
      } else {
        const destination = channel === 'email' ? email.trim() : phone.trim();
        if (channel === 'phone' && !/^\+[1-9]\d{7,14}$/.test(destination)) {
          throw new Error('Enter your phone number in international format, for example +14155552671.');
        }
        const { error: otpError } = await supabase.auth.signInWithOtp({
          ...(channel === 'email' ? { email: destination } : { phone: destination }),
          options: { shouldCreateUser: false },
        });
        if (otpError) throw otpError;
        setStep('login-otp');
        setMessage(`We sent a verification code to ${destination}.`);
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function verifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearFeedback();
    setIsSubmitting(true);

    try {
      const supabase = getSupabaseClient();
      if (step === 'signup-second-otp') {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          ...(otpChannel === 'email'
            ? { email: email.trim(), token: otp.trim(), type: 'email_change' as const }
            : { phone: phone.trim(), token: otp.trim(), type: 'phone_change' as const }),
        });
        if (verifyError) throw verifyError;

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error('Your account could not be loaded after verification. Please sign in.');

        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            full_name: fullName,
          })
          .eq('id', user.id);
        if (profileError) throw profileError;

        router.push('/onboarding/interests');
        return;
      }

      const { error: verifyError } = await supabase.auth.verifyOtp({
        ...(channel === 'email'
          ? { email: email.trim(), token: otp.trim(), type: 'email' as const }
          : { phone: phone.trim(), token: otp.trim(), type: 'sms' as const }),
      });
      if (verifyError) throw verifyError;

      if (step === 'signup-first-otp') {
        const { error: linkError } = channel === 'email'
          ? await supabase.auth.updateUser({ phone: phone.trim() })
          : await supabase.auth.updateUser({ email: email.trim().toLowerCase() });
        if (linkError) throw linkError;

        const secondaryChannel = channel === 'email' ? 'phone' : 'email';
        setOtp('');
        setStep('signup-second-otp');
        setMessage(`First contact verified. We sent a second code to your ${secondaryChannel}. Verify it to finish creating your account.`);
        return;
      }

      router.push('/onboarding/interests');
    } catch (verifyError) {
      setError(getErrorMessage(verifyError));
    } finally {
      setIsSubmitting(false);
    }
  }

  function switchMode() {
    setIsCreatingAccount((current) => !current);
    setStep('details');
    setOtp('');
    setChannel('email');
    clearFeedback();
  }

  return (
    <div>
      <p className="eyebrow mb-3">YOUR LEARNING JOURNEY STARTS HERE</p>
      <h1 className="text-[30px] font-semibold tracking-[-1px]">
        {isOtpStep ? 'Enter your verification code.' : isCreatingAccount ? 'Create your account.' : 'Welcome back.'}
      </h1>
      <p className="mt-2 text-sm leading-6 text-secondaryText">
        {isOtpStep
          ? `Enter the code sent to ${otpDestination}.`
          : isCreatingAccount
            ? 'Add your details, then verify both your email and phone.'
            : 'Sign in securely with a one-time code sent to your email or phone.'}
      </p>

      {!isOtpStep ? (
        <form className="mt-8 space-y-5" onSubmit={requestOtp}>
          {isCreatingAccount && (
            <>
              <Input label="First name" autoComplete="given-name" required value={firstName} onChange={(event) => setFirstName(event.target.value)} maxLength={80} />
              <Input label="Last name" autoComplete="family-name" required value={lastName} onChange={(event) => setLastName(event.target.value)} maxLength={80} />
            </>
          )}
          {(isCreatingAccount || channel === 'email') && (
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          )}
          {(isCreatingAccount || channel === 'phone') && (
            <Input
              label="Phone number"
              type="tel"
              autoComplete="tel"
              required
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+14155552671"
              helperText={isCreatingAccount ? 'Include your country code. Both phone and email will be verified.' : 'Include your country code, for example +14155552671.'}
            />
          )}
          <fieldset className="space-y-2">
            <legend className="mb-2 text-sm font-medium text-ink">
              {isCreatingAccount ? 'Send the first verification code to' : 'Receive your sign-in code by'}
            </legend>
            {(['email', 'phone'] as const).map((option) => (
              <label key={option} className="flex cursor-pointer items-center gap-2 text-sm capitalize text-secondaryText">
                <input
                  type="radio"
                  name="otp-channel"
                  value={option}
                  checked={channel === option}
                  onChange={() => setChannel(option)}
                  required
                />
                {option} {option === 'phone' && !isCreatingAccount && ' (SMS)'}
              </label>
            ))}
          </fieldset>
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-error">{error}</p>}
          {message && <p role="status" className="rounded-lg bg-[#edf4ff] px-3 py-2 text-sm text-primary">{message}</p>}
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait…' : 'Send verification code'} <span aria-hidden="true">→</span>
          </Button>
        </form>
      ) : (
        <form className="mt-8 space-y-5" onSubmit={verifyOtp}>
          <Input
            label="One-time code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
            maxLength={10}
            placeholder="Enter the code"
          />
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-error">{error}</p>}
          {message && <p role="status" className="rounded-lg bg-[#edf4ff] px-3 py-2 text-sm text-primary">{message}</p>}
          <Button className="w-full" type="submit" disabled={isSubmitting || !otp.trim()}>
            {isSubmitting ? 'Verifying…' : isSecondarySignupOtp ? 'Verify and finish registration' : 'Verify code'} <span aria-hidden="true">→</span>
          </Button>
          <button type="button" className="w-full text-sm font-semibold text-primary" onClick={() => { setStep('details'); setOtp(''); clearFeedback(); }}>
            Change details
          </button>
        </form>
      )}

      {!isOtpStep && (
        <>
          <div className="my-6 flex items-center gap-3 text-xs text-[#a2aaa5]"><span className="h-px flex-1 bg-border" />OR<span className="h-px flex-1 bg-border" /></div>
          <p className="text-center text-xs text-secondaryText">
            {isCreatingAccount ? 'Already registered? ' : 'New to Teach Me? '}
            <button type="button" className="font-semibold text-primary" onClick={switchMode}>
              {isCreatingAccount ? 'Sign in' : 'Create an account'}
            </button>
          </p>
        </>
      )}
    </div>
  );
}
