'use client';

import { motion } from 'motion/react';
import { FADE_UP } from '@/lib/motion';
import { Zap, Heart, BarChart3, Moon, Bookmark, Smartphone } from 'lucide-react';

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-charcoal py-[clamp(5rem,8vw,8rem)] px-6">
      <div className="max-w-[1100px] w-full mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4">
          <motion.div
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            className="bg-emerald/10 border border-emerald/20 text-emerald text-xs uppercase tracking-[0.12em] font-semibold px-4 py-[0.3rem] rounded-full"
          >
            FEATURES
          </motion.div>
          <motion.h2
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            className="text-white font-bold text-[clamp(2rem,4vw,3rem)] tracking-tight max-w-[600px]"
          >
            Everything designed to lower the bar.
          </motion.h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Speed */}
          <motion.div
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            transition={{ delay: 0 }}
            whileHover={{ y: -3, borderColor: 'rgba(74,160,115,0.25)', backgroundColor: 'rgba(255,255,255,0.06)' }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-start gap-4 transition-colors duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center">
              <Zap size={20} className="text-emerald" />
            </div>
            <h3 className="text-white font-bold text-lg">Instant AI Breakdown</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Groq&apos;s Llama 3.3 processes your task in under a second. No waiting. No loading spinners. Just steps, instantly.
            </p>
          </motion.div>

          {/* Card 2: Empathetic Language */}
          <motion.div
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            transition={{ delay: 0.08 }}
            whileHover={{ y: -3, borderColor: 'rgba(74,160,115,0.25)', backgroundColor: 'rgba(255,255,255,0.06)' }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-start gap-4 transition-colors duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center">
              <Heart size={20} className="text-emerald" />
            </div>
            <h3 className="text-white font-bold text-lg">Words That Don&apos;t Judge</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Every step is written to be encouraging. The AI uses language calibrated for anxiety, burnout, and executive dysfunction. No &apos;just do it&apos; energy.
            </p>
          </motion.div>

          {/* Card 3: Progress */}
          <motion.div
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            transition={{ delay: 0.16 }}
            whileHover={{ y: -3, borderColor: 'rgba(74,160,115,0.25)', backgroundColor: 'rgba(255,255,255,0.06)' }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-start gap-4 transition-colors duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center">
              <BarChart3 size={20} className="text-emerald" />
            </div>
            <h3 className="text-white font-bold text-lg">Gentle Progress Tracking</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              See how far you&apos;ve come, not how far you have to go. Progress bars are designed to celebrate tiny wins, not remind you of the gap.
            </p>
          </motion.div>

          {/* Card 4: Dark Interface */}
          <motion.div
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            transition={{ delay: 0.24 }}
            whileHover={{ y: -3, borderColor: 'rgba(74,160,115,0.25)', backgroundColor: 'rgba(255,255,255,0.06)' }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-start gap-4 transition-colors duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center">
              <Moon size={20} className="text-emerald" />
            </div>
            <h3 className="text-white font-bold text-lg">Calming Visual Design</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              No harsh whites or aggressive reds. A warm charcoal palette, generous spacing, and rounded everything — designed to lower your cortisol, not spike it.
            </p>
          </motion.div>

          {/* Card 5: Tasks That Stick Around */}
          <motion.div
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            transition={{ delay: 0.32 }}
            whileHover={{ y: -3, borderColor: 'rgba(74,160,115,0.25)', backgroundColor: 'rgba(255,255,255,0.06)' }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-start gap-4 transition-colors duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center">
              <Bookmark size={20} className="text-emerald" />
            </div>
            <h3 className="text-white font-bold text-lg">Tasks That Stick Around</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Your broken-down tasks are saved so you can come back anytime. Pick up exactly where you left off, even after closing the app.
            </p>
          </motion.div>

          {/* Card 6: Works Everywhere */}
          <motion.div
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            transition={{ delay: 0.4 }}
            whileHover={{ y: -3, borderColor: 'rgba(74,160,115,0.25)', backgroundColor: 'rgba(255,255,255,0.06)' }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-start gap-4 transition-colors duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center">
              <Smartphone size={20} className="text-emerald" />
            </div>
            <h3 className="text-white font-bold text-lg">Works Everywhere</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Use it on your phone, tablet, or desktop. Your tasks sync automatically so you can switch devices without losing your progress.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}