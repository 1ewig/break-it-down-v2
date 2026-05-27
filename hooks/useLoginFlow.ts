'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuthForm } from '@/hooks/useAuthForm';

export function useLoginFlow() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorLink, setErrorLink] = useState<{ href: string; label: string } | null>(null);
  const form = useAuthForm();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorLink(null);
    form.begin();

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      if (signInError.code === 'invalid_credentials') {
        try {
          const res = await fetch('/api/auth/check-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });
          const data = await res.json();
          if (!data.exists) {
            setErrorLink({ href: '/register', label: 'Create one →' });
            form.fail('No account found with this email.');
          } else {
            form.fail('Invalid password. Please try again.');
          }
        } catch {
          form.fail('Invalid login credentials.');
        }
      } else {
        form.fail(signInError.message);
      }
      return;
    }

    router.push('/home');
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error: form.error,
    errorLink,
    loading: form.loading,
    handleSubmit,
  };
}
