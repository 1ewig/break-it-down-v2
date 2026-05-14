'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Mail, ArrowLeft, Sparkles } from 'lucide-react';

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
    const redirectTo = `${window.location.origin}/auth/callback?next=/update-password`;
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center justify-center w-8 h-8 bg-primary/20 rounded-lg">
            <Sparkles size={16} className="text-primary" />
          </div>
          <span className="font-bold text-xl text-text-primary tracking-tight">Break It Down</span>
        </div>

        <div className="p-8 bg-surface border border-text-secondary/5 rounded-3xl shadow-sm">
          {sent ? (
            <>
              <h1 className="text-2xl font-light text-text-primary mb-1 text-center">Check Your Email</h1>
              <p className="text-text-secondary text-sm text-center mb-8">
                If an account exists for <strong className="text-text-primary">{email}</strong>, we&apos;ve sent a password reset link.
              </p>
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-white rounded-2xl hover:bg-primary-hover transition-colors font-medium"
              >
                <ArrowLeft size={16} />
                Back to Sign In
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-light text-text-primary mb-1 text-center">Reset Password</h1>
              <p className="text-text-secondary text-sm text-center mb-8">
                Enter your email and we&apos;ll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                    <input
                      id="email"
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-background border border-text-secondary/10 rounded-2xl text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-primary/50 transition-colors text-sm"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-primary text-white rounded-2xl hover:bg-primary-hover transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-text-secondary">
                Remember your password?{' '}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
