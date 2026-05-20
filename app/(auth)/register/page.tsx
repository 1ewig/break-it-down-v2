'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock } from 'lucide-react';
import { AuthLayout, AuthInput, AuthButton, GoogleSignInButton } from '@/components/auth';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'generic' | 'email_exists'>('generic');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isPasswordWeak = password.length > 0 && password.length < 8;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      if (error.code === 'user_already_exists' || error.code === 'email_exists') {
        setErrorType('email_exists');
        setError('An account with this email already exists.');
      } else {
        setErrorType('generic');
        setError(error.message);
      }
      setLoading(false);
      return;
    }

    if (data?.user?.identities?.length === 0) {
      setErrorType('email_exists');
      setError('An account with this email already exists.');
      setLoading(false);
      return;
    }

    router.push('/home');
  };

  return (
    <AuthLayout 
      title="Start Fresh" 
      description="Join us for a calmer way to get things done."
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
          minLength={8}
        />

        <AuthInput
          id="confirm-password"
          type="password"
          label="Confirm Password"
          placeholder="Confirm Password"
          icon={Lock}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
        />
        
        {isPasswordWeak && (
          <p className="text-red-400 text-xs mt-2">At least 8 characters needed.</p>
        )}

        {error && errorType === 'email_exists' ? (
          <p className="text-red-400 text-sm text-center">
            {error}{' '}
            <Link href="/login" className="text-primary hover:underline">
              Sign in instead &rarr;
            </Link>
          </p>
        ) : error ? (
          <p className="text-red-400 text-sm text-center">{error}</p>
        ) : null}

        <AuthButton loading={loading} loadingText="Creating account...">
          Create Account
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

      <GoogleSignInButton text="Sign up with Google" />

      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
