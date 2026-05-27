'use client';

import Link from 'next/link';
import { User, Mail, Lock, ArrowLeft } from 'lucide-react';
import { AuthLayout, AuthInput, AuthButton, AuthError, GoogleSignInButton } from '@/components/auth';
import { useRegisterFlow } from '@/hooks/useRegisterFlow';

export default function RegisterPage() {
  const {
    name, setName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    isPasswordWeak, registered, error, errorLink,
    loading, handleSubmit,
  } = useRegisterFlow();

  return (
    <AuthLayout
      title={registered ? 'Check Your Email' : 'Start Fresh'}
      description={registered ? '' : 'Join us for a calmer way to get things done.'}
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
              id="name"
              type="text"
              label="Your Name"
              placeholder="Your Name"
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

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

            {error && <AuthError message={error} link={errorLink ?? undefined} />}

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
        </>
      )}
    </AuthLayout>
  );
}
