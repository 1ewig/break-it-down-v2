'use client';

import { useNotifications } from '@/hooks/useNotifications';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { NotificationsToggle } from '@/components/settings/NotificationsToggle';
import { SettingsFooter } from '@/components/settings/SettingsFooter';
import { motion } from 'motion/react';
import { STAGGER_CONTAINER } from '@/lib/animations';

export default function SettingsPage() {
  const { enabled, toggle } = useNotifications();

  return (
    <motion.div 
      variants={STAGGER_CONTAINER}
      initial="initial"
      animate="animate"
      className="flex flex-col h-full max-w-3xl mx-auto w-full p-4 md:p-8 gap-4 md:gap-8"
    >
      <SettingsHeader />
      <NotificationsToggle enabled={enabled} onToggle={toggle} />
      <SettingsFooter />
    </motion.div>
  );
}