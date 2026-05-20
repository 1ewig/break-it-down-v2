'use client';

import { useState } from 'react';

export function useAuthForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return {
    error,
    loading,
    setError,
    setLoading,
    begin: () => { setError(null); setLoading(true); },
    fail: (message: string) => { setError(message); setLoading(false); },
    succeed: () => { setLoading(false); },
    reset: () => { setError(null); setLoading(false); },
  };
}
