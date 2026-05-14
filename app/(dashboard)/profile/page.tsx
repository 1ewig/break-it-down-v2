'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useUIStore } from '@/store/useUIStore';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { STAGGER_CONTAINER } from '@/lib/animations';
import { User, Mail, Calendar, LogOut, LogOut as LogOutIcon } from 'lucide-react';
import { NameSetting } from '@/components/settings/NameSetting';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useState } from 'react';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { userName, setUserName } = useUIStore();
  const router = useRouter();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

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
      className="flex flex-col flex-1 max-w-2xl mx-auto w-full p-6 gap-6"
    >
      <div className="flex items-center gap-4 mb-2">
        <div className="flex items-center justify-center w-12 h-12 bg-primary/15 rounded-full">
          <User className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Profile</h1>
          <p className="text-sm font-medium text-text-secondary">Your account details</p>
        </div>
      </div>

      <NameSetting userName={userName} onSave={setUserName} />

      <div className="bg-surface border border-text-secondary/5 rounded-3xl p-6 space-y-5">
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

        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 bg-background rounded-xl">
            {user.identities?.[0]?.provider === 'google' ? (
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
              {user.identities?.[0]?.provider || 'Email'}
            </p>
          </div>
        </div>

      </div>

      <button
        onClick={() => setShowSignOutConfirm(true)}
        className="flex items-center justify-center gap-2 py-3 px-4 bg-surface border border-text-secondary/5 rounded-2xl text-text-secondary hover:text-red-400 hover:border-red-400/20 transition-colors font-medium"
      >
        <LogOutIcon className="h-5 w-5" />
        Sign Out
      </button>

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
