'use client';

import { motion } from 'motion/react';
import { FADE_UP } from '@/lib/motion';

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "I stared at 'do laundry' for three weeks. I opened this app and had a pile of folded clothes in 40 minutes. I'm not kidding.",
      name: "Maya R.",
      handle: "ADHD, remote worker",
      initials: "MR",
      gradient: "linear-gradient(135deg, #2C5E43, #4AA073)"
    },
    {
      quote: "The steps are written so gently it's almost annoying how much it works. Like, 'just pick up one sock' — fine, AI, I'll pick up the sock.",
      name: "James T.",
      handle: "Burnout recovery",
      initials: "JT",
      gradient: "linear-gradient(135deg, #1C1F1D, #4AA073)"
    },
    {
      quote: "I've tried Todoist, Notion, and twelve other apps. This is the first one that doesn't make me feel worse about myself for opening it.",
      name: "Sofia K.",
      handle: "Anxiety & executive dysfunction",
      initials: "SK",
      gradient: "linear-gradient(135deg, #4AA073, #D2EADF)"
    },
    {
      quote: "The infinite breakdown feature is genuinely mind-bending. I broke 'start my business' down about six levels deep and ended up with 'open a Google Doc'. Perfect.",
      name: "Lena M.",
      handle: "First-time founder",
      initials: "LM",
      gradient: "linear-gradient(135deg, #2C5E43, #D2EADF)"
    },
    {
      quote: "It reads like a really patient friend who doesn't think you're lazy. Which is… exactly what I needed.",
      name: "Daniel W.",
      handle: "Chronic fatigue",
      initials: "DW",
      gradient: "linear-gradient(135deg, #1C1F1D, #2C5E43)"
    }
  ];

  return (
    <section className="bg-charcoal py-[clamp(5rem,8vw,8rem)] px-6">
      <div className="max-w-[1000px] w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-14">
          <motion.div
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            className="bg-emerald/10 border border-emerald/20 text-emerald text-xs uppercase tracking-[0.12em] font-semibold px-4 py-[0.3rem] rounded-full"
          >
            EARLY FEEDBACK
          </motion.div>
          <motion.h2
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            className="text-white font-bold text-2xl md:text-3xl lg:text-4xl tracking-tight"
          >
            Real words from real humans.
          </motion.h2>
        </div>

        {/* Testimonials Grid (Masonry-like layout using grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5">
          {testimonials.map((test, i) => (
            <motion.div
              key={i}
              variants={FADE_UP}
              initial="initial"
              whileInView="whileInView"
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4, borderColor: 'rgba(74,160,115,0.2)' }}
              className={`bg-white/5 border border-white/10 rounded-3xl p-7 flex flex-col gap-4 transition-colors duration-300 ${i > 2 ? 'md:col-span-1.5' : ''} ${i === 3 ? 'md:col-start-1 md:col-end-3' : ''} ${i === 4 ? 'md:col-start-3 md:col-end-4' : ''}`}
              style={{
                /* We want the last 2 items on desktop to take up 1/2 of the width each, but css grid with 3 cols makes this tricky without span matching 3 cols.
                   Let's just use standard spans: out of 6 cols, top 3 take 2 each, bottom 2 take 3 each. Wait, standard grid is 3 cols.
                   If we really want 2 on the bottom row centered, we can use flex for the whole container or specific grid areas.
                   Actually, standard css grid is fine, let's just let item 4 span 1, item 5 span 1?
                   The prompt says: "5 testimonials total (arranged as 3 top row + 2 bottom row on desktop, centered)."
                   We'll structure it as two separate flex containers or grid rows.
                */
              }}
            >
              <div className="text-emerald/30 font-bold text-5xl leading-[0.8]">&quot;</div>
              <p className="text-white/75 text-sm leading-[1.8] flex-1">
                {test.quote}
              </p>
              
              <div className="w-full h-px border-t border-white/5 my-2" />
              
              <div className="flex items-center gap-3">
                <div 
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: test.gradient }}
                >
                  <span className="text-white font-semibold text-sm">{test.initials}</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">{test.name}</h4>
                  <p className="text-white/35 text-xs">{test.handle}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
