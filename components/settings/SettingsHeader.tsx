'use client';

import { motion } from 'motion/react';
import { FADE_IN_UP } from '@/lib/animations';

export function SettingsHeader() {
  return (
    <motion.div 
      variants={FADE_IN_UP}
      className="text-center"
    >
      <h1 className="text-3xl font-light text-text-primary mb-2">Settings</h1>
      <p className="text-text-secondary text-sm">Customize your safe space.</p>
    </motion.div>
  );
}