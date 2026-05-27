'use client';

import { useState, type FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getURL } from '@/lib/utils';
import { useAuthForm } from '@/hooks/useAuthForm';

export function useForgotPasswordFlow() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const form = useAuthForm();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    form.begin();

    const supabase = createClient();
    const redirectTo = `${getURL()}/auth/callback?next=/update-password`;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (resetError) {
      form.fail(resetError.message);
      return;
    }

    form.succeed();
    setSent(true);
  };

  return {
    email,
    setEmail,
    sent,
    error: form.error,
    loading: form.loading,
    handleSubmit,
  };
}
