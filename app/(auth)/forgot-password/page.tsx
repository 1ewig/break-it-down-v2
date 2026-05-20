'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Mail, ArrowLeft } from 'lucide-react';
import { AuthLayout, AuthInput, AuthButton, AuthError } from '@/components/auth';
import { useAuthForm } from '@/hooks/useAuthForm';
import { getURL } from '@/lib/utils';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const form = useAuthForm();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    form.begin();

    const supabase = createClient();
    const redirectTo = `${getURL()}/auth/callback?next=/update-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      form.fail(error.message);
      return;
    }

    form.succeed();
    setSent(true);
  };

  return (
    <AuthLayout 
      title={sent ? "Check Your Email" : "Reset Password"} 
      description={sent ? "" : "Enter your email and we'll send you a reset link."}
    >
      {sent ? (
        <div className="space-y-8">
          <p className="text-text-secondary text-sm text-center">
            If an account exists for <strong className="text-text-primary">{email}</strong>, we&apos;ve sent a password reset link.
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

          {form.error && <AuthError message={form.error} />}

          <AuthButton loading={form.loading} loadingText="Sending..." showIcon={false}>
            Send Reset Link
          </AuthButton>

          <p className="mt-8 text-center text-sm text-text-secondary">
            Remember your password?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
