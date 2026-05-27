'use client';

import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import { AuthLayout, AuthInput, AuthButton, AuthError, GoogleSignInButton } from '@/components/auth';
import { useLoginFlow } from '@/hooks/useLoginFlow';

export default function LoginPage() {
  const {
    email, setEmail,
    password, setPassword,
    error, errorLink,
    loading, handleSubmit,
  } = useLoginFlow();

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

        {error && <AuthError message={error} link={errorLink ?? undefined} />}

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
