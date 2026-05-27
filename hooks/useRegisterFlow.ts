'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getURL } from '@/lib/utils';
import { validatePassword } from '@/lib/auth-validation';
import { useAuthForm } from '@/hooks/useAuthForm';

export function useRegisterFlow() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorLink, setErrorLink] = useState<{ href: string; label: string } | null>(null);
  const [registered, setRegistered] = useState(false);
  const form = useAuthForm();
  const router = useRouter();

  const isPasswordWeak = password.length > 0 && password.length < 8;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorLink(null);

    const validationError = validatePassword(password, confirmPassword);
    if (validationError) {
      form.fail(validationError);
      return;
    }

    form.begin();

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${getURL()}/auth/callback?next=/home`,
      },
    });

    if (signUpError) {
      if (signUpError.code === 'user_already_exists' || signUpError.code === 'email_exists') {
        setErrorLink({ href: '/login', label: 'Sign in instead →' });
        form.fail('An account with this email already exists.');
      } else {
        form.fail(signUpError.message);
      }
      return;
    }

    if (data?.user?.identities?.length === 0) {
      setErrorLink({ href: '/login', label: 'Sign in instead →' });
      form.fail('An account with this email already exists.');
      return;
    }

    if (!data.session) {
      setRegistered(true);
      form.succeed();
      return;
    }

    router.push('/home');
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isPasswordWeak,
    registered,
    error: form.error,
    errorLink,
    loading: form.loading,
    handleSubmit,
  };
}
