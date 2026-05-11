'use client';

import { motion } from 'motion/react';
import { FADE_IN_UP } from '@/lib/animations';

export function SettingsFooter() {
  return (
    <motion.div 
      variants={FADE_IN_UP}
      className="text-center text-text-secondary/50 text-sm max-w-sm mx-auto leading-relaxed mt-4"
    >
      Remember, you are not defined by your productivity. 
      Taking a break is just as important as taking a step.
    </motion.div>
  );
}