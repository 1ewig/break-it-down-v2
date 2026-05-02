'use client';

import { useGentleNotifications } from '@/hooks/useGentleNotifications';
import { GentleCheckbox } from '@/components/ui/GentleCheckbox';
import { Leaf } from 'lucide-react';
import { motion } from 'motion/react';
import { STAGGER_CONTAINER, FADE_IN_UP, SCALE_IN } from '@/lib/animations';

export default function SettingsPage() {
  const { enabled, toggle } = useGentleNotifications();

  return (
    <motion.div 
      variants={STAGGER_CONTAINER}
      initial="initial"
      animate="animate"
      className="flex flex-col h-full max-w-3xl mx-auto w-full p-4 md:p-8 gap-4 md:gap-8"
    >
      <motion.div 
        variants={FADE_IN_UP}
        className="text-center"
      >
        <h1 className="text-3xl font-light text-text-primary mb-2">Settings</h1>
        <p className="text-text-secondary text-sm">Customize your safe space.</p>
      </motion.div>

      <motion.div 
        variants={FADE_IN_UP}
        className="bg-surface p-6 md:p-8 rounded-3xl border border-text-secondary/5"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <motion.div 
              variants={SCALE_IN}
              className="p-3 bg-primary/10 rounded-2xl text-primary"
            >
              <Leaf className="w-6 h-6" />
            </motion.div>
            <div>
              <h3 className="text-lg text-text-primary font-medium mb-1">Gentle Nudges</h3>
              <p className="text-text-secondary text-sm max-w-md">
                Receive very soft, sporadic reminders to take a tiny step. 
                You can always snooze them with zero guilt by clicking "Not today".
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-background p-4 rounded-2xl">
            <GentleCheckbox checked={enabled} onChange={toggle} />
            <span className="text-sm font-medium text-text-primary">
              {enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        variants={FADE_IN_UP}
        className="text-center text-text-secondary/50 text-sm max-w-sm mx-auto leading-relaxed mt-4"
      >
        Remember, you are not defined by your productivity. 
        Taking a break is just as important as taking a step.
      </motion.div>
    </motion.div>
  );
}

