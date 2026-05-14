'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center justify-center w-8 h-8 bg-primary/20 rounded-lg">
            <Sparkles size={16} className="text-primary" />
          </div>
          <span className="font-bold text-xl text-text-primary tracking-tight">Break It Down</span>
        </div>

        <div className="p-8 bg-surface border border-text-secondary/5 rounded-3xl shadow-sm">
          <h1 className="text-2xl font-light text-text-primary mb-1 text-center">Welcome Back</h1>
          <p className="text-text-secondary text-sm text-center mb-8">Sign in to continue your gentle journey.</p>

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

            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

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
        </div>
      </div>
    </div>
  );
}
