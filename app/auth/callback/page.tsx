'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Sparkles } from 'lucide-react';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const run = async () => {
      const code = searchParams.get('code');
      const token_hash = searchParams.get('token_hash');
      const type = searchParams.get('type');

      if (!code && !token_hash) {
        router.push('/login');
        return;
      }

      const supabase = createClient();

      if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({
          type: type as 'email' | 'sms' | 'recovery' | 'invite' | 'email_change',
          token_hash,
        });
        router.push(error ? '/login' : type === 'recovery' ? '/update-password' : '/home');
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        const next = searchParams.get('next') || '/home';
        router.push(next);
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code!);
      const next = searchParams.get('next') || '/home';
      router.push(error ? '/login' : next);
    };

    run();
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/20 rounded-lg">
          <Sparkles size={20} className="text-primary" />
        </div>
        <p className="text-text-secondary text-sm">Completing your sign in...</p>
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
