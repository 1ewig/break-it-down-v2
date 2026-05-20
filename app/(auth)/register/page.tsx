'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { AuthLayout, AuthInput, AuthButton, AuthError, GoogleSignInButton } from '@/components/auth';
import { useAuthForm } from '@/hooks/useAuthForm';
import { validatePassword } from '@/lib/auth-validation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registered, setRegistered] = useState(false);
  const [errorLink, setErrorLink] = useState<{ href: string; label: string } | null>(null);
  const form = useAuthForm();
  const router = useRouter();

  const isPasswordWeak = password.length > 0 && password.length < 8;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorLink(null);

    const validationError = validatePassword(password, confirmPassword);
    if (validationError) {
      form.fail(validationError);
      return;
    }

    form.begin();

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      if (error.code === 'user_already_exists' || error.code === 'email_exists') {
        setErrorLink({ href: '/login', label: 'Sign in instead →' });
        form.fail('An account with this email already exists.');
      } else {
        form.fail(error.message);
      }
      return;
    }

    if (data?.user?.identities?.length === 0) {
      setErrorLink({ href: '/login', label: 'Sign in instead →' });
      form.fail('An account with this email already exists.');
      return;
    }

    if (!data.session) {
      setRegistered(true);
      form.succeed();
      return;
    }

    router.push('/home');
  };

  return (
    <AuthLayout 
      title={registered ? "Check Your Email" : "Start Fresh"} 
      description={registered ? "" : "Join us for a calmer way to get things done."}
    >
      {registered ? (
        <div className="space-y-8">
          <p className="text-text-secondary text-sm text-center">
            We&apos;ve sent a confirmation email to{' '}
            <strong className="text-text-primary">{email}</strong>.
            Click the link to activate your account and get started.
          </p>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-white rounded-2xl hover:bg-primary-hover transition-colors font-medium"
          >
            <ArrowLeft size={16} />
            Back to Sign In
          </Link>
        </div>
      ) : (
        <>
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

            {form.error && <AuthError message={form.error} link={errorLink ?? undefined} />}

            <AuthButton loading={form.loading} loadingText="Creating account...">
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
        </>
      )}
    </AuthLayout>
  );
}
