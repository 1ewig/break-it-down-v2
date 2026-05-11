'use client';

import { motion } from 'motion/react';
import { FADE_UP } from '@/lib/motion';

export default function ForWhoSection() {
  const personas = [
    {
      emoji: '🧠',
      title: 'ADHD Warriors',
      body: "Your brain needs tasks chunked small enough to feel approachable. Break It Down's recursive breakdown was built with ADHD hyperfocus and paralysis in mind."
    },
    {
      emoji: '🪫',
      title: 'The Burnt Out',
      body: "When you're running on empty, even small tasks feel enormous. We strip them down to their absolute minimum viable first action."
    },
    {
      emoji: '😰',
      title: 'Anxiety Brains',
      body: "Vague tasks create vague dread. Specific, tiny steps dissolve anxiety by replacing the unknown with the very, very known."
    },
    {
      emoji: '🌫️',
      title: 'Executive Dysfunction',
      body: "When the 'getting started' part of the brain isn't working, an external scaffold helps. That's us — your scaffold, no judgment."
    }
  ];

  return (
    <section id="for-who" className="bg-[#0F1210] py-[clamp(5rem,8vw,8rem)] px-6">
      <div className="max-w-[960px] w-full mx-auto flex flex-col items-center gap-14">
        <div className="flex flex-col items-center text-center gap-4">
          <motion.div
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            className="bg-emerald/10 border border-emerald/20 text-emerald text-xs uppercase tracking-[0.12em] font-semibold px-4 py-[0.3rem] rounded-full"
          >
            FOR WHO
          </motion.div>
          <motion.h2
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            className="text-white font-bold text-[clamp(1.875rem,4vw,3rem)] tracking-tight max-w-[700px] leading-[1.15]"
          >
            You don't need to be 'productive'. You just need to start.
          </motion.h2>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {personas.map((persona, i) => (
            <motion.div
              key={i}
              variants={FADE_UP}
              initial="initial"
              whileInView="whileInView"
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, borderColor: 'rgba(74,160,115,0.2)' }}
              className="bg-white/5 border border-white/10 rounded-3xl pt-8 pb-8 px-7 flex flex-col gap-3.5 transition-colors duration-300"
            >
              <div className="text-[2.25rem] leading-none mb-1">{persona.emoji}</div>
              <h3 className="text-white font-bold text-lg">{persona.title}</h3>
              <p className="text-white/50 font-normal text-sm leading-[1.7]">
                {persona.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}