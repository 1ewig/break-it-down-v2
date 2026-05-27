'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { createClient } from '@/lib/supabase/client';

export function useProfileSettings() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [userName, setUserName] = useState(user?.user_metadata?.name || '');

  const handleSaveName = async (name: string) => {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ data: { name } });
    if (!error) {
      setUserName(name);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const providers = user?.identities?.map(i => i.provider) || ['email'];
  const hasGoogle = providers.includes('google');

  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return {
    user,
    userName,
    handleSaveName,
    showSignOutConfirm,
    setShowSignOutConfirm,
    handleSignOut,
    joinedDate,
    providers,
    hasGoogle,
  };
}
