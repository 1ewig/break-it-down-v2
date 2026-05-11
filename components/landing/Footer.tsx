'use client';

import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { FADE_UP } from '@/lib/motion';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0C0F0D] pt-12 pb-12 px-[clamp(1.5rem,5vw,5rem)]">
      <div className="max-w-[1200px] w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 items-start relative z-10">
        {/* Brand */}
        <motion.div 
          variants={FADE_UP}
          initial="initial"
          whileInView="whileInView"
          className="col-span-1 md:col-span-2 flex flex-col gap-4"
        >
          <div className="flex items-center gap-[0.6rem]">
            <div className="flex items-center justify-center w-[28px] h-[28px] bg-white/10 rounded-lg">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-bold text-lg text-white font-sans tracking-tight">Break It Down</span>
          </div>
          <p className="text-white/35 font-normal text-sm leading-[1.7] max-w-[280px]">
            Your gentle AI co-pilot for getting unstuck.
          </p>
          <p className="text-white/20 font-normal text-xs mt-2">
            Powered by Groq & Llama 3.3
          </p>
        </motion.div>

        {/* Navigation */}
        <motion.div 
          variants={FADE_UP}
          initial="initial"
          whileInView="whileInView"
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-4"
        >
          <h4 className="text-white/25 font-semibold text-xs uppercase tracking-[0.1em]">
            APP
          </h4>
          <div className="flex flex-col gap-3">
            {[ 'Home', 'My Tasks', 'Settings' ].map((link, i) => (
              <motion.div key={i} whileHover={{ x: 3 }}>
                <Link href="#" className="text-white/40 hover:text-white/75 font-medium text-sm transition-colors block">
                  {link}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div 
          variants={FADE_UP}
          initial="initial"
          whileInView="whileInView"
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-4"
        >
          <h4 className="text-white/25 font-semibold text-xs uppercase tracking-[0.1em]">
            BUILT WITH
          </h4>
          <div className="flex flex-col gap-3">
            {[ 'Groq API', 'Llama 3.3', 'Next.js 15', 'Framer Motion' ].map((item, i) => (
               <motion.div key={i} whileHover={{ x: 3 }}>
                <Link href="#" className="text-white/40 hover:text-white/75 font-medium text-sm transition-colors block pointer-events-none">
                  {item}
                </Link>
               </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <motion.div 
        variants={FADE_UP}
        initial="initial"
        whileInView="whileInView"
        transition={{ delay: 0.3 }}
        className="max-w-[1200px] w-full mx-auto border-t border-white/5 mt-10 pt-6 flex flex-row flex-wrap justify-between gap-4"
      >
        <p className="text-white/20 font-normal text-xs">
          © 2025 Break It Down. Made with care for overwhelmed humans.
        </p>
        <p className="text-white/15 font-normal text-xs italic">
          Take your time.
        </p>
      </motion.div>
    </footer>
  );
}
