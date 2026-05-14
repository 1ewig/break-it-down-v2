'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Sparkles } from 'lucide-react';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('Completing your sign in...');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const token_hash = searchParams.get('token_hash');
      const type = searchParams.get('type');

      const supabase = createClient();

      if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({
          type: type as 'email' | 'sms' | 'recovery' | 'invite' | 'email_change',
          token_hash,
        });
        if (error) {
          setMessage('Verification failed. Redirecting...');
          setTimeout(() => router.push('/login'), 2000);
          return;
        }
        router.push(type === 'recovery' ? '/update-password' : '/home');
        return;
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setMessage('Sign in failed. Redirecting...');
          setTimeout(() => router.push('/login'), 2000);
          return;
        }
        router.push('/home');
        return;
      }

      router.push('/login');
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/20 rounded-lg">
          <Sparkles size={20} className="text-primary" />
        </div>
        <p className="text-text-secondary text-sm">{message}</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/20 rounded-lg">
            <Sparkles size={20} className="text-primary" />
          </div>
          <p className="text-text-secondary text-sm">Completing your sign in...</p>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
