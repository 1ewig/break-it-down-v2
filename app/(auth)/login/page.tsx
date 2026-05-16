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
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
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

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

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
