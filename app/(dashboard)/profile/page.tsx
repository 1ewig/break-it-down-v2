'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { STAGGER_CONTAINER } from '@/lib/animations';
import { User, Mail, Calendar, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

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
          <h1 className="text-2xl font-light text-text-primary">Profile</h1>
          <p className="text-sm text-text-secondary">Your account details</p>
        </div>
      </div>

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

      </div>

      <button
        onClick={handleSignOut}
        className="flex items-center justify-center gap-2 py-3 px-4 bg-surface border border-text-secondary/5 rounded-2xl text-text-secondary hover:text-red-400 hover:border-red-400/20 transition-colors font-medium"
      >
        <LogOut className="h-5 w-5" />
        Sign Out
      </button>
    </motion.div>
  );
}
