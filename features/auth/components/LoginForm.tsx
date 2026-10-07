'use client';

import { useState } from 'react';
import { Button, Card, Input } from '@/components/ui';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Card className="mx-auto w-full max-w-md">
      <h1 className="text-h2 font-bold">Welcome to Teach Me</h1>
      <p className="mt-2 text-body text-secondaryText">Let&apos;s build your learning journey.</p>

      <div className="mt-6 space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        <Button className="w-full" variant="primary">
          Sign In
        </Button>
      </div>
    </Card>
  );
}
