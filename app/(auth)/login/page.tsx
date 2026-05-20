'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock } from 'lucide-react';
import { AuthLayout, AuthInput, AuthButton, GoogleSignInButton } from '@/components/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'generic' | 'email_not_found' | 'invalid_password'>('generic');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.code === 'invalid_credentials') {
        try {
          const res = await fetch('/api/auth/check-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });
          const data = await res.json();
          if (!data.exists) {
            setErrorType('email_not_found');
            setError('No account found with this email.');
          } else {
            setErrorType('invalid_password');
            setError('Invalid password. Please try again.');
          }
        } catch {
          setErrorType('generic');
          setError('Invalid login credentials.');
        }
      } else {
        setErrorType('generic');
        setError(error.message);
      }
      setLoading(false);
      return;
    }

    router.push('/home');
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      description="Sign in to continue your gentle journey."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          id="email"
          type="email"
          label="Email"
          placeholder="Email"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <AuthInput
          id="password"
          type="password"
          label="Password"
          placeholder="Password"
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && errorType === 'email_not_found' ? (
          <p className="text-red-400 text-sm text-center">
            {error}{' '}
            <Link href="/register" className="text-primary hover:underline">
              Create one &rarr;
            </Link>
          </p>
        ) : error ? (
          <p className="text-red-400 text-sm text-center">{error}</p>
        ) : null}

        <AuthButton loading={loading} loadingText="Signing in...">
          Sign In
        </AuthButton>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-text-secondary/10" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-surface px-3 text-text-secondary">or continue with</span>
        </div>
      </div>

      <GoogleSignInButton />

      <div className="mt-6 text-center">
        <Link href="/forgot-password" className="text-sm text-text-secondary hover:text-primary transition-colors">
          Forgot password?
        </Link>
      </div>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-primary hover:underline">
          Register gently
        </Link>
      </p>
    </AuthLayout>
  );
}
