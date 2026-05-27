'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function useLoginFlow() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [errorLink, setErrorLink] = useState<{ href: string; label: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorLink(null);
    setError(null);
    setLoading(true);

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
            setError('No account found with this email.');
          } else {
            setError('Invalid password. Please try again.');
          }
        } catch {
          setError('Invalid login credentials.');
        }
      } else {
        setError(signInError.message);
      }
      setLoading(false);
      return;
    }

    router.push('/home');
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    errorLink,
    loading,
    handleSubmit,
  };
}
