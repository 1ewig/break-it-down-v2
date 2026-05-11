'use client';

import { Leaf } from 'lucide-react';
import { GentleCheckbox } from '@/components/ui/GentleCheckbox';
import { motion } from 'motion/react';
import { FADE_IN_UP, SCALE_IN } from '@/lib/animations';

interface NotificationsToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function NotificationsToggle({ enabled, onToggle }: NotificationsToggleProps) {
  return (
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
          <GentleCheckbox checked={enabled} onChange={onToggle} />
          <span className="text-sm font-medium text-text-primary">
            {enabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}