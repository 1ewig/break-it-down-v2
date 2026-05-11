'use client';

import { motion } from 'motion/react';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeForm } from '@/components/home/HomeForm';
import { HomeFooter } from '@/components/home/HomeFooter';
import { STAGGER_CONTAINER } from '@/lib/animations';

/**
 * Next.js Orchestration Page: Mounts the decoupled UI blocks.
 */
export default function Home() {
  return (
    <motion.div 
      variants={STAGGER_CONTAINER}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-center flex-1 max-w-2xl mx-auto w-full p-6 gap-4"
    >
      <HomeHeader />
      <HomeForm />
      <HomeFooter />
    </motion.div>
  );
}
