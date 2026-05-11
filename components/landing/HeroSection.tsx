'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Sparkles, ChevronDown, ArrowRight } from 'lucide-react';
import { FADE_UP, STAGGER_CONTAINER } from '@/lib/motion';

const TYPING_PHRASES = [
  'Clean my entire apartment...',
  'Start my business plan...',
  'Reply to all my emails...',
  "Plan my sister's wedding...",
  'Organize my digital clutter...',
  'Research new career paths...',
  'Write my first novel...',
  'Prep for the big presentation...'
];

export default function HeroSection() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [1, 0]);

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typeSpeed = isDeleting ? 30 : 50;
    const currentPhrase = TYPING_PHRASES[currentPhraseIndex];

    if (!isDeleting && typedText === currentPhrase) {
      setTimeout(() => setIsDeleting(true), 2500);
      return;
    }

    if (isDeleting && typedText === '') {
      const nextIndex = (currentPhraseIndex + 1) % TYPING_PHRASES.length;
      setTimeout(() => {
        setIsDeleting(false);
        setCurrentPhraseIndex(nextIndex);
      }, 0);
      return;
    }

    const timeout = setTimeout(() => {
      setTypedText(
        currentPhrase.substring(0, typedText.length + (isDeleting ? -1 : 1))
      );
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, currentPhraseIndex]);

  return (
    <section id="hero" className="relative min-h-[100vh] bg-[#121413] flex flex-col items-center justify-center overflow-hidden">
      {/* Ambient Background Layer */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 18, ease: 'easeInOut', repeat: Infinity }}
          className="absolute inset-0 pt-4"
        >
          <div
            className="absolute top-[40%] left-[30%] -translate-x-1/2 -translate-y-1/2"
            style={{
              width: 1400,
              height: 1000,
              background: 'radial-gradient(ellipse at center, rgba(44,94,67,0.12), transparent 70%)',
            }}
          />
        </motion.div>
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 18, ease: 'easeInOut', repeat: Infinity, delay: 9 }}
          className="absolute inset-0"
        >
          <div
            className="absolute top-[60%] left-[70%] -translate-x-1/2 -translate-y-1/2"
            style={{
              width: 1200,
              height: 800,
              background: 'radial-gradient(ellipse at center, rgba(74,160,115,0.08), transparent 70%)',
            }}
          />
        </motion.div>
      </div>

      {/* Content Stack */}
      <motion.div
        variants={STAGGER_CONTAINER}
        initial="initial"
        animate="whileInView"
        className="relative z-10 flex flex-col items-center gap-8 w-full max-w-[1200px] px-6 text-center"
      >
        {/* App Icon Badge */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, -8, 0] }}
            transition={{ opacity: { duration: 0.7 }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
            className="flex items-center justify-center w-[72px] h-[72px] rounded-full bg-emerald/15 border-[1.5px] border-emerald/30 shadow-[0_0_60px_rgba(74,160,115,0.25)]"
          >
            <Sparkles size={32} className="text-emerald" />
          </motion.div>
        </div>

        {/* Eyebrow Label */}
        <motion.div variants={FADE_UP} className="bg-emerald/10 border border-emerald/20 text-emerald text-xs uppercase tracking-[0.12em] font-semibold px-4 py-[0.3rem] rounded-full">
          Gentle AI Task Architect
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={FADE_UP}
          className="text-white font-bold tracking-tight text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.05]"
        >
          What&apos;s on <br />
          your mind<span className="text-emerald">?</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={FADE_UP}
          className="text-white/55 font-medium text-[clamp(1rem,2vw,1.25rem)] leading-[1.7] max-w-[480px]"
        >
          Type that big, overwhelming task. <br />
          We&apos;ll break it into tiny, gentle steps for you.
        </motion.p>

        {/* Animated Input Mockup */}
        <motion.div variants={FADE_UP} className="flex items-center gap-3 w-full max-w-[560px] mt-4">
          <div className="flex-1 h-[48px] bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl px-5 flex items-center shadow-inner overflow-hidden">
            <p className="text-white/35 font-medium text-base truncate">
              {typedText}
              <span className="inline-block w-px h-5 bg-white/50 animate-pulse ml-0.5 align-middle" />
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="flex items-center justify-center w-[48px] h-[48px] rounded-xl bg-emerald text-white shadow-[0_4px_20px_rgba(74,160,115,0.4)] flex-shrink-0"
          >
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>

        {/* Powered By Label */}
        <motion.p variants={FADE_UP} className="text-white/30 text-xs font-medium">
          Powered by Groq & Llama 3.3 • Gentle AI
        </motion.p>
      </motion.div>

      {/* Scroll Cue */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={24} className="text-white/25" />
        </motion.div>
      </motion.div>
    </section>
  );
}
