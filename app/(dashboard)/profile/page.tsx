'use client';

import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { STAGGER_CONTAINER, FADE_IN_UP } from '@/lib/animations';
import { Mail, Calendar, LogOutIcon } from 'lucide-react';
import { NameSetting } from '@/components/settings/NameSetting';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export default function ProfilePage() {
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

  if (!user) return null;

  return (
    <motion.div
      variants={STAGGER_CONTAINER}
      initial="initial"
      animate="animate"
      className="flex flex-col h-full max-w-3xl mx-auto w-full p-4 md:p-8 gap-4 md:gap-8"
    >
      <motion.div variants={FADE_IN_UP} className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2 tracking-tight">Profile</h1>
        <p className="text-text-secondary text-base font-medium">Your account details</p>
      </motion.div>

      <NameSetting userName={userName} onSave={handleSaveName} />

      <motion.div variants={FADE_IN_UP} className="bg-surface border border-text-secondary/5 rounded-3xl p-6 space-y-5">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 bg-background rounded-xl">
            <Mail className="h-5 w-5 text-text-secondary" />
          </div>
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wider">Email</p>
            <p className="text-text-primary font-medium">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 bg-background rounded-xl">
            <Calendar className="h-5 w-5 text-text-secondary" />
          </div>
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wider">Joined</p>
            <p className="text-text-primary font-medium">
              {new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {(() => {
          const providers = user.identities?.map(i => i.provider) || ['email'];
          const hasGoogle = providers.includes('google');
          return (
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 bg-background rounded-xl">
                {hasGoogle ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                ) : (
                  <Mail className="h-5 w-5 text-text-secondary" />
                )}
              </div>
              <div>
                <p className="text-xs text-text-secondary uppercase tracking-wider">Login Method</p>
                <p className="text-text-primary font-medium capitalize">
                  {providers.map(p => p === 'google' ? 'Google' : p === 'email' ? 'Email' : p).join(', ')}
                </p>
              </div>
            </div>
          );
        })()}

      </motion.div>

      <motion.div variants={FADE_IN_UP}>
        <button
          onClick={() => setShowSignOutConfirm(true)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-surface border border-text-secondary/5 rounded-2xl text-text-secondary hover:text-red-400 hover:border-red-400/20 transition-colors font-medium"
        >
          <LogOutIcon className="h-5 w-5" />
          Sign Out
        </button>
      </motion.div>

      <ConfirmDialog
        open={showSignOutConfirm}
        title="Sign Out"
        message="Are you sure you want to sign out? You'll need to sign back in to access your tasks."
        confirmLabel="Sign Out"
        onConfirm={handleSignOut}
        onCancel={() => setShowSignOutConfirm(false)}
      />
    </motion.div>
  );
}
