'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { getSupabaseClient } from '@/lib/supabase/client';
import { getErrorMessage } from '@/lib/supabase/learning';

type OtpChannel = 'email' | 'phone';
type AuthStep = 'details' | 'login-otp' | 'signup-first-otp' | 'signup-second-otp';

const countries = [
  { name: 'India', dialCode: '+91' },
  { name: 'United States', dialCode: '+1' },
  { name: 'United Kingdom', dialCode: '+44' },
  { name: 'Canada', dialCode: '+1' },
  { name: 'Australia', dialCode: '+61' },
  { name: 'New Zealand', dialCode: '+64' },
  { name: 'United Arab Emirates', dialCode: '+971' },
  { name: 'Singapore', dialCode: '+65' },
  { name: 'Ireland', dialCode: '+353' },
  { name: 'Germany', dialCode: '+49' },
  { name: 'France', dialCode: '+33' },
  { name: 'Italy', dialCode: '+39' },
  { name: 'Spain', dialCode: '+34' },
  { name: 'Netherlands', dialCode: '+31' },
  { name: 'Switzerland', dialCode: '+41' },
  { name: 'Sweden', dialCode: '+46' },
  { name: 'Norway', dialCode: '+47' },
  { name: 'Denmark', dialCode: '+45' },
  { name: 'Finland', dialCode: '+358' },
  { name: 'Belgium', dialCode: '+32' },
  { name: 'Austria', dialCode: '+43' },
  { name: 'Portugal', dialCode: '+351' },
  { name: 'Poland', dialCode: '+48' },
  { name: 'Czechia', dialCode: '+420' },
  { name: 'Greece', dialCode: '+30' },
  { name: 'Turkey', dialCode: '+90' },
  { name: 'Japan', dialCode: '+81' },
  { name: 'South Korea', dialCode: '+82' },
  { name: 'China', dialCode: '+86' },
  { name: 'Hong Kong', dialCode: '+852' },
  { name: 'Malaysia', dialCode: '+60' },
  { name: 'Indonesia', dialCode: '+62' },
  { name: 'Thailand', dialCode: '+66' },
  { name: 'Philippines', dialCode: '+63' },
  { name: 'Pakistan', dialCode: '+92' },
  { name: 'Bangladesh', dialCode: '+880' },
  { name: 'Sri Lanka', dialCode: '+94' },
  { name: 'Nepal', dialCode: '+977' },
  { name: 'South Africa', dialCode: '+27' },
  { name: 'Nigeria', dialCode: '+234' },
  { name: 'Kenya', dialCode: '+254' },
  { name: 'Egypt', dialCode: '+20' },
  { name: 'Saudi Arabia', dialCode: '+966' },
  { name: 'Israel', dialCode: '+972' },
  { name: 'Brazil', dialCode: '+55' },
  { name: 'Mexico', dialCode: '+52' },
  { name: 'Argentina', dialCode: '+54' },
  { name: 'Chile', dialCode: '+56' },
  { name: 'Colombia', dialCode: '+57' },
] as const;

export function LoginForm() {
  const router = useRouter();
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [step, setStep] = useState<AuthStep>('details');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryDialCode, setCountryDialCode] = useState('+91');
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
  const normalizedPhone = `${countryDialCode}${phone.replace(/\D/g, '').replace(/^0+/, '')}`;
  const otpDestination = otpChannel === 'email' ? email : normalizedPhone;

  function requirePhoneNumber() {
    const nationalNumber = phone.replace(/\D/g, '').replace(/^0+/, '');
    if (nationalNumber.length < 7 || nationalNumber.length > 14) {
      throw new Error('Enter a valid phone number for the selected country.');
    }
    return `${countryDialCode}${nationalNumber}`;
  }

  function clearFeedback() {
    setError('');
    setMessage('');
  }

  function getAuthErrorMessage(error: unknown) {
    const message = getErrorMessage(error);
    if (/unsupported phone provider|phone provider.*not enabled|sms provider.*not configured/i.test(message)) {
      return 'Phone OTP is not enabled in this Supabase project. In Supabase, open Authentication → Providers → Phone, enable phone sign-in, and configure an SMS provider. You can choose Email to start registration, but phone verification still requires this setup.';
    }
    return message;
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
        const fullPhoneNumber = requirePhoneNumber();

        const credentials = channel === 'email' ? { email: email.trim() } : { phone: fullPhoneNumber };
        const { error: otpError } = await supabase.auth.signInWithOtp({
          ...credentials,
          options: {
            shouldCreateUser: true,
            data: {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              full_name: fullName,
              email: email.trim().toLowerCase(),
              phone: fullPhoneNumber,
            },
          },
        });
        if (otpError) throw otpError;
        setStep('signup-first-otp');
        setMessage(`We sent a verification code to ${channel === 'email' ? email : phone}.`);
      } else {
        const destination = channel === 'email' ? email.trim() : requirePhoneNumber();
        const { error: otpError } = await supabase.auth.signInWithOtp({
          ...(channel === 'email' ? { email: destination } : { phone: destination }),
          options: { shouldCreateUser: false },
        });
        if (otpError) throw otpError;
        setStep('login-otp');
        setMessage(`We sent a verification code to ${destination}.`);
      }
    } catch (requestError) {
      const errorMessage = getErrorMessage(requestError);
      if (/unsupported phone provider|phone provider.*not enabled|sms provider.*not configured/i.test(errorMessage)) {
        setError(getAuthErrorMessage(requestError));
      } else if (!isCreatingAccount && /signups not allowed for otp|user not found|phone number not found|email not found/i.test(errorMessage)) {
        setError('No account was found for this contact, or OTP sign-in is disabled. If you are new, choose “Create an account”. If you already registered, check the Supabase Auth provider settings.');
      } else {
        setError(errorMessage);
      }
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
            : { phone: normalizedPhone, token: otp.trim(), type: 'phone_change' as const }),
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
          : { phone: normalizedPhone, token: otp.trim(), type: 'sms' as const }),
      });
      if (verifyError) throw verifyError;

      if (step === 'signup-first-otp') {
        const { error: linkError } = channel === 'email'
          ? await supabase.auth.updateUser({ phone: normalizedPhone })
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
      setError(getAuthErrorMessage(verifyError));
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
            <div className="w-full">
              <label htmlFor="phone-number" className="mb-2 block text-label font-medium text-ink">Phone number</label>
              <div className="flex gap-2">
                <select
                  aria-label="Country calling code"
                  value={countryDialCode}
                  onChange={(event) => setCountryDialCode(event.target.value)}
                  className="max-w-[48%] rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {countries.map((country) => (
                    <option key={`${country.name}-${country.dialCode}`} value={country.dialCode}>
                      {country.name} ({country.dialCode})
                    </option>
                  ))}
                </select>
                <input
                  id="phone-number"
                  type="tel"
                  autoComplete="tel-national"
                  required
                  value={phone}
                  onChange={(event) => setPhone(event.target.value.replace(/[^\d\s()-]/g, ''))}
                  placeholder="Phone number"
                  className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-body text-ink placeholder:text-secondaryText focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <p className="mt-1 text-caption text-secondaryText">
                {isCreatingAccount ? 'Both your phone number and email will be verified.' : `We’ll send your sign-in code to ${normalizedPhone}.`}
              </p>
            </div>
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
