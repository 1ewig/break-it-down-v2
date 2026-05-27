'use client';

import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';
import { AuthLayout, AuthInput, AuthButton, AuthError } from '@/components/auth';
import { useForgotPasswordFlow } from '@/hooks/useForgotPasswordFlow';

export default function ForgotPasswordPage() {
  const {
    email, setEmail,
    sent, error, loading, handleSubmit,
  } = useForgotPasswordFlow();

  return (
    <AuthLayout
      title={sent ? 'Check Your Email' : 'Reset Password'}
      description={sent ? '' : "Enter your email and we'll send you a reset link."}
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

          {error && <AuthError message={error} />}

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
