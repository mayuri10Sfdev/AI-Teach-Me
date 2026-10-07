import Link from 'next/link';
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            TEACH ME
          </Link>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
