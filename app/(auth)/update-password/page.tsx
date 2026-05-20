'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Lock } from 'lucide-react';
import { AuthLayout, AuthInput, AuthButton, AuthError } from '@/components/auth';
import { useAuthForm } from '@/hooks/useAuthForm';
import { validatePassword } from '@/lib/auth-validation';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const form = useAuthForm();
  const router = useRouter();

  const isPasswordWeak = password.length > 0 && password.length < 8;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationError = validatePassword(password, confirmPassword);
    if (validationError) {
      form.fail(validationError);
      return;
    }

    form.begin();

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      form.fail(error.message);
      return;
    }

    router.push('/home');
  };

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

        {form.error && <AuthError message={form.error} />}

        <AuthButton loading={form.loading} loadingText="Updating...">
          Update Password
        </AuthButton>
      </form>
    </AuthLayout>
  );
}
