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
      className="text-center flex flex-col items-center gap-6 mb-8"
    >
      <motion.div
        variants={SCALE_IN}
        className="flex items-center justify-center w-[72px] h-[72px] rounded-full bg-primary/15 border-[1.5px] border-primary/30 shadow-[0_0_60px_rgba(74,160,115,0.15)] mb-2"
      >
        <Sparkles size={32} className="text-primary" />
      </motion.div>

      <h1 className="text-text-primary font-bold tracking-tight text-[clamp(2rem,8vw,4rem)] leading-[1.1]">
        What&apos;s on <br className="md:hidden" /> your mind?
      </h1>
      
      <p className="text-text-secondary font-medium text-[clamp(1rem,3vw,1.25rem)] leading-relaxed max-w-[480px]">
        Type that big, overwhelming task. <br />
        We&apos;ll break it into tiny, gentle steps for you.
      </p>
    </motion.div>
  );
}
