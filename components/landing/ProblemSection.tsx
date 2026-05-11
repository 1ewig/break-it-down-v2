'use client';

import { motion } from 'motion/react';
import { FADE_UP } from '@/lib/motion';
import { EyeOff, RefreshCw, Snowflake } from 'lucide-react';

export default function ProblemSection() {
  const cards = [
    {
      icon: <EyeOff size={20} className="text-emerald" />,
      title: 'The Blank Stare',
      body: "You know you need to do it. You open a new tab. You close it. You stare at the ceiling. The task feels like a wall."
    },
    {
      icon: <RefreshCw size={20} className="text-emerald" />,
      title: 'The Overwhelm Spiral',
      body: "You try to plan. The plan needs a plan. Suddenly 'send one email' has twelve prerequisites and you've lost two hours."
    },
    {
      icon: <Snowflake size={20} className="text-emerald" />,
      title: 'The Shame Freeze',
      body: "You know what you should do. You just can't make yourself start. And then you feel bad about not starting. And then it's worse."
    }
  ];

  return (
    <section className="bg-charcoal py-[clamp(5rem,8vw,8rem)] px-6">
      <div className="max-w-[900px] w-full mx-auto flex flex-col items-center gap-12">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <motion.div
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            className="text-emerald text-xs uppercase tracking-[0.12em] font-semibold"
          >
            SOUND FAMILIAR?
          </motion.div>
          <motion.h2
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            className="text-white font-bold text-[clamp(2rem,4.5vw,3.5rem)] tracking-tight leading-[1.15]"
          >
            That paralyzing moment <br className="hidden sm:block" />
            before you even start.
          </motion.h2>
        </div>

        {/* Cards Grid */}
        <div className="w-full max-w-[860px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              variants={FADE_UP}
              initial="initial"
              whileInView="whileInView"
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -2 }}
              className="group bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col gap-4 hover:bg-white/10 hover:border-emerald/20 transition-colors"
            >
              <div className="flex items-center justify-center w-[40px] h-[40px] bg-white/5 rounded-xl">
                {card.icon}
              </div>
              <h3 className="text-white font-bold text-lg mt-2">{card.title}</h3>
              <p className="text-white/45 font-normal text-sm leading-[1.7]">
                {card.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
