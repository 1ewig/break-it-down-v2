'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Lock, ArrowRight, Sparkles } from 'lucide-react';

// Server-side password policy should be configured in Supabase Auth settings
// (Settings > Authentication > Password Policy) to enforce min length, etc.
// This client-side check is a UX courtesy, not a security boundary.

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
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
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/home');
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
          <h1 className="text-2xl font-light text-text-primary mb-1 text-center">Set New Password</h1>
          <p className="text-text-secondary text-sm text-center mb-8">Choose a new password for your account.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="password" className="sr-only">New Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  id="password"
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-text-secondary/10 rounded-2xl text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-primary/50 transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="sr-only">Confirm New Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-text-secondary/10 rounded-2xl text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-primary/50 transition-colors text-sm"
                />
              </div>
              {isPasswordWeak && (
                <p className="text-red-400 text-xs mt-2">At least 8 characters needed.</p>
              )}
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-primary text-white rounded-2xl hover:bg-primary-hover transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Password'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
