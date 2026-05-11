'use client';

import { motion } from 'motion/react';
import { FADE_UP } from '@/lib/motion';
import { Infinity, Zap, Heart, BarChart3, Moon, Bookmark } from 'lucide-react';

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
          {/* Card 1: Large Hero Feature */}
          <motion.div
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            whileHover={{ y: -3, borderColor: 'rgba(74,160,115,0.25)', backgroundColor: 'rgba(255,255,255,0.06)' }}
            className="col-span-1 md:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8 lg:p-12 transition-all duration-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left Side: Text */}
              <div className="flex flex-col items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald/10 border border-emerald/20 flex items-center justify-center mb-2">
                  <Infinity size={28} className="text-emerald" />
                </div>
                <h3 className="text-white font-bold text-2xl">Infinite Recursive Breakdown</h3>
                <p className="text-white/50 text-sm leading-[1.75]">
                  Every single step can be broken down further. And that step can be broken down. And that one too. The AI never runs out of patience, and there is no floor — only smaller and smaller until you can finally start.
                </p>
                <div className="bg-emerald/10 border border-emerald/20 text-emerald text-xs font-semibold px-3 py-1 rounded-full mt-2">
                  Core Feature
                </div>
              </div>

              {/* Right Side: Visual Diagram */}
              <div className="relative flex flex-col items-start w-full">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="w-full max-w-[320px] bg-white/10 rounded-xl px-4 py-3 border border-white/5 relative z-30"
                >
                  <p className="text-white/80 font-medium text-sm">Clean my apartment</p>
                </motion.div>
                
                <div className="w-[1.5rem] border-l border-white/10 h-4 ml-6" />
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                  className="w-full max-w-[280px] bg-white/5 rounded-xl px-4 py-3 ml-[1.5rem] border border-white/5 relative z-20"
                >
                  <p className="text-white/70 font-medium text-sm">Tackle the living room</p>
                </motion.div>

                <div className="w-[3rem] border-l border-white/10 h-4 ml-12" />

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="w-full max-w-[240px] bg-emerald/15 rounded-xl px-4 py-3 ml-[3rem] border border-emerald/20 relative z-10"
                >
                  <p className="text-white font-medium text-[13px]">Pick up 3 things from the floor</p>
                </motion.div>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-emerald text-xs font-semibold ml-[3rem] mt-3 flex items-center gap-1.5"
                >
                  <span className="text-[10px]">✓</span> That&apos;s it. You&apos;re doing great.
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Speed */}
          <motion.div
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            transition={{ delay: 0.07 }}
            whileHover={{ y: -3, borderColor: 'rgba(74,160,115,0.25)', backgroundColor: 'rgba(255,255,255,0.06)' }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-start gap-4 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center">
              <Zap size={20} className="text-emerald" />
            </div>
            <h3 className="text-white font-bold text-lg">Instant AI Breakdown</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Groq&apos;s Llama 3.3 processes your task in under a second. No waiting. No loading spinners. Just steps, instantly.
            </p>
          </motion.div>

          {/* Card 3: Empathetic Language */}
          <motion.div
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            transition={{ delay: 0.14 }}
            whileHover={{ y: -3, borderColor: 'rgba(74,160,115,0.25)', backgroundColor: 'rgba(255,255,255,0.06)' }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-start gap-4 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center">
              <Heart size={20} className="text-emerald" />
            </div>
            <h3 className="text-white font-bold text-lg">Words That Don&apos;t Judge</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Every step is written to be encouraging. The AI uses language calibrated for anxiety, burnout, and executive dysfunction. No &apos;just do it&apos; energy.
            </p>
          </motion.div>

          {/* Card 4: Progress */}
          <motion.div
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            transition={{ delay: 0.21 }}
            whileHover={{ y: -3, borderColor: 'rgba(74,160,115,0.25)', backgroundColor: 'rgba(255,255,255,0.06)' }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-start gap-4 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center">
              <BarChart3 size={20} className="text-emerald" />
            </div>
            <h3 className="text-white font-bold text-lg">Gentle Progress Tracking</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              See how far you&apos;ve come, not how far you have to go. Progress bars are designed to celebrate tiny wins, not remind you of the gap.
            </p>
          </motion.div>

          {/* Card 5: Dark Interface */}
          <motion.div
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            transition={{ delay: 0.28 }}
            whileHover={{ y: -3, borderColor: 'rgba(74,160,115,0.25)', backgroundColor: 'rgba(255,255,255,0.06)' }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-start gap-4 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center">
              <Moon size={20} className="text-emerald" />
            </div>
            <h3 className="text-white font-bold text-lg">Calming Visual Design</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              No harsh whites or aggressive reds. A warm charcoal palette, generous spacing, and rounded everything — designed to lower your cortisol, not spike it.
            </p>
          </motion.div>

          {/* Card 6: Offline-First Sessions (Wait, it says "Offline-First Sessions" but body says "Your broken-down tasks are saved". Let's assume it's just saved state) */}
          <motion.div
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            transition={{ delay: 0.35 }}
            whileHover={{ y: -3, borderColor: 'rgba(74,160,115,0.25)', backgroundColor: 'rgba(255,255,255,0.06)' }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-start gap-4 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center">
              <Bookmark size={20} className="text-emerald" />
            </div>
            <h3 className="text-white font-bold text-lg">Tasks That Stick Around</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Your broken-down tasks are saved so you can come back anytime. Pick up exactly where you left off, even after closing the app.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
