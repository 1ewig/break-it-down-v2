'use client';

import { motion } from 'motion/react';
import { FADE_IN_UP } from '@/lib/animations';

export function SettingsHeader() {
  return (
    <motion.div 
      variants={FADE_IN_UP}
      className="text-center"
    >
      <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2 tracking-tight">Settings</h1>
      <p className="text-text-secondary text-base font-medium">Customize your safe space.</p>
    </motion.div>
  );
}