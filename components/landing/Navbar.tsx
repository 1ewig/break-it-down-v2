'use client';

import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { Sparkles, Menu, X } from 'lucide-react';
import { SPRING_GENTLE } from '@/lib/motion';
import Link from 'next/link';

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 60);
  });

  return (
    <>
      <motion.nav
        initial={false}
        animate={{
          backgroundColor: isScrolled ? 'rgba(18,20,19,0.85)' : 'rgba(18,20,19,0)',
          borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(255,255,255,0)',
          backdropFilter: isScrolled ? 'blur(20px)' : 'blur(0px)',
        }}
        transition={SPRING_GENTLE}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-[68px] px-6 lg:px-12"
      >
        <Link href="/" className="flex items-center gap-[0.6rem] group">
          <div className="flex items-center justify-center w-[28px] h-[28px] bg-white/10 rounded-lg">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="font-bold text-lg text-white font-sans tracking-tight">Break It Down</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-white/65 hover:text-white transition-colors">
            <motion.span whileHover={{ scale: 1.02 }} className="inline-block">Features</motion.span>
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium text-white/65 hover:text-white transition-colors">
            <motion.span whileHover={{ scale: 1.02 }} className="inline-block">How It Works</motion.span>
          </Link>
          <Link href="#for-who" className="text-sm font-medium text-white/65 hover:text-white transition-colors">
            <motion.span whileHover={{ scale: 1.02 }} className="inline-block">For Who</motion.span>
          </Link>

          <Link href="/home">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="bg-emerald text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#5BB585] transition-colors"
            >
              Get Started Free
            </motion.button>
          </Link>
        </div>

        <button
          className="md:hidden text-white/70"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>
      </motion.nav>

      <motion.div
        initial={false}
        animate={{ x: isMobileMenuOpen ? '0%' : '-100%' }}
        transition={SPRING_GENTLE}
        className="fixed inset-0 z-[60] bg-charcoal flex flex-col pt-6 px-6"
      >
        <div className="flex items-center justify-between h-[68px] mb-8">
          <div className="flex items-center gap-[0.6rem]">
            <div className="flex items-center justify-center w-[28px] h-[28px] bg-white/10 rounded-lg">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-bold text-lg text-white font-sans tracking-tight">Break It Down</span>
          </div>
          <button className="text-white/70" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <Link href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white/80 hover:text-white">
            Features
          </Link>
          <Link href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white/80 hover:text-white">
            How It Works
          </Link>
          <Link href="#for-who" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white/80 hover:text-white">
            For Who
          </Link>
          <Link href="/home" onClick={() => setIsMobileMenuOpen(false)} className="bg-emerald text-white font-semibold text-base py-3 rounded-xl mt-4 text-center">
            Get Started Free
          </Link>
        </div>
      </motion.div>
    </>
  );
}