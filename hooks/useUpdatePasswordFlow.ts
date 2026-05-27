'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { validatePassword } from '@/lib/auth-validation';
import { useAuthForm } from '@/hooks/useAuthForm';

export function useUpdatePasswordFlow() {
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
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      form.fail(updateError.message);
      return;
    }

    router.push('/home');
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isPasswordWeak,
    error: form.error,
    loading: form.loading,
    handleSubmit,
  };
}
