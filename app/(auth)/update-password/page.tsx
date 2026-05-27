'use client';

import { Lock } from 'lucide-react';
import { AuthLayout, AuthInput, AuthButton, AuthError } from '@/components/auth';
import { useUpdatePasswordFlow } from '@/hooks/useUpdatePasswordFlow';

export default function UpdatePasswordPage() {
  const {
    password, setPassword,
    confirmPassword, setConfirmPassword,
    isPasswordWeak, error, loading, handleSubmit,
  } = useUpdatePasswordFlow();

  return (
    <AuthLayout
      title="Set New Password"
      description="Choose a new password for your account."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          id="password"
          type="password"
          label="New Password"
          placeholder="New Password"
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />

        <AuthInput
          id="confirm-password"
          type="password"
          label="Confirm New Password"
          placeholder="Confirm New Password"
          icon={Lock}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
        />

        {isPasswordWeak && (
          <p className="text-red-400 text-xs mt-2">At least 8 characters needed.</p>
        )}

        {error && <AuthError message={error} />}

        <AuthButton loading={loading} loadingText="Updating...">
          Update Password
        </AuthButton>
      </form>
    </AuthLayout>
  );
}
