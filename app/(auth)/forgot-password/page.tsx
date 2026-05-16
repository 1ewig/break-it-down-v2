'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Mail, ArrowLeft } from 'lucide-react';
import { AuthLayout, AuthInput, AuthButton } from '@/components/auth';
import { getURL } from '@/lib/utils';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const redirectTo = `${getURL()}/auth/callback?next=/update-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
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

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <AuthButton loading={loading} loadingText="Sending..." showIcon={false}>
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
