'use client';

import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { FADE_IN_UP, SCALE_IN } from '@/lib/animations';

/**
 * Dumb component that renders the home page greeting and animated illustration icon.
 */
export function HomeHeader() {
  return (
    <motion.div 
      variants={FADE_IN_UP}
      className="text-center"
    >
      <motion.div
        variants={SCALE_IN}
        className="inline-flex p-4 rounded-full bg-primary/10 mb-4"
      >
        <Sparkles className="w-12 h-12 text-primary" />
      </motion.div>
      
      <h1 className="text-4xl md:text-6xl font-light text-text-primary mb-4 tracking-tight">
        What&apos;s on your mind?
      </h1>
      <p className="text-xl text-text-secondary font-light leading-relaxed">
        Type that big, overwhelming task. 
        <br />
        We&apos;ll break it into tiny, gentle steps for you.
      </p>
    </motion.div>
  );
}
