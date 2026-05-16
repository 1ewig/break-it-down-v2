'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Lock } from 'lucide-react';
import { AuthLayout, AuthInput, AuthButton } from '@/components/auth';

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

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <AuthButton loading={loading} loadingText="Updating...">
          Update Password
        </AuthButton>
      </form>
    </AuthLayout>
  );
}
