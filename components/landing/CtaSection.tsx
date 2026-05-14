'use client';

import { motion } from 'motion/react';
import { FADE_UP, SPRING_GENTLE } from '@/lib/motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';

export default function CtaSection() {
  const { user } = useAuth();

  return (
    <section className="relative bg-charcoal overflow-hidden py-[clamp(6rem,10vw,10rem)] px-6">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 18, ease: 'easeInOut', repeat: Infinity }}
          className="absolute inset-0"
        >
          <div
            className="absolute top-[30%] left-[40%] -translate-x-1/2 -translate-y-1/2"
            style={{
              width: 1200,
              height: 1000,
              background: 'radial-gradient(ellipse at center, rgba(44,94,67,0.18), transparent 70%)',
            }}
          />
        </motion.div>
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 18, ease: 'easeInOut', repeat: Infinity, delay: 9 }}
          className="absolute inset-0"
        >
          <div
            className="absolute top-[70%] left-[60%] -translate-x-1/2 -translate-y-1/2"
            style={{
              width: 1000,
              height: 800,
              background: 'radial-gradient(ellipse at center, rgba(74,160,115,0.15), transparent 70%)',
            }}
          />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-[800px] w-full mx-auto flex flex-col items-center gap-10 text-center">
        {/* Sparkle Badge */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            animate={{ y: [0, -8, 0] }}
            transition={{ y: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
            className="flex items-center justify-center w-[60px] h-[60px] rounded-full bg-emerald/15 border-[1.5px] border-emerald/30 shadow-[0_0_60px_rgba(74,160,115,0.25)]"
          >
            <Sparkles size={28} className="text-emerald" />
          </motion.div>
        </div>

        {/* Headings */}
        <div className="flex flex-col gap-6 items-center">
          <motion.h2
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            transition={{ ...SPRING_GENTLE, delay: 0.1 }}
            className="text-white font-bold text-[clamp(2.5rem,5.5vw,4.5rem)] tracking-tight leading-[1.1]"
          >
            The hardest part <br />
            is deciding to start. <br />
            <span className="text-emerald">We&apos;ve got the rest.</span>
          </motion.h2>
          
          <motion.p
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            transition={{ ...SPRING_GENTLE, delay: 0.2 }}
            className="text-white/45 font-medium text-base max-w-[480px] leading-relaxed"
          >
            Free to use. Create your account in seconds. Just type what&apos;s overwhelming you and let us make it tiny.
          </motion.p>
        </div>

        {/* Buttons */}
        <motion.div
          variants={FADE_UP}
          initial="initial"
          whileInView="whileInView"
          transition={{ ...SPRING_GENTLE, delay: 0.3 }}
          className="flex flex-col items-center gap-6"
        >
          <Link href={user ? '/home' : '/register'}>
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 12px 60px rgba(74,160,115,0.5)' }}
              whileTap={{ scale: 0.97 }}
              className="bg-emerald text-white font-bold text-lg px-10 py-4 rounded-2xl shadow-[0_8px_40px_rgba(74,160,115,0.35)] flex items-center justify-center hover:bg-[#5BB585] transition-colors cursor-pointer"
            >
              {user ? 'Go to Dashboard' : 'Break Down My First Task'} <ArrowRight size={20} className="inline-block ml-2" />
            </motion.div>
          </Link>
          
          <Link href="#how-it-works" className="text-white/35 hover:text-white/65 font-medium text-sm transition-colors">
            See how it works ↓
          </Link>
        </motion.div>

        {/* Feature Ticks */}
        <motion.div
          variants={FADE_UP}
          initial="initial"
          whileInView="whileInView"
          transition={{ ...SPRING_GENTLE, delay: 0.4 }}
          className="flex flex-row flex-wrap items-center justify-center gap-6 md:gap-8 mt-4"
        >
          {[ 'Free forever', 'Quick signup', 'Built for overwhelmed brains' ].map((text, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-emerald font-bold text-sm">✓</span>
              <span className="text-white/35 font-medium text-xs">{text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
