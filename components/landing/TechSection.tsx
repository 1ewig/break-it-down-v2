'use client';

import { motion } from 'motion/react';
import { FADE_UP } from '@/lib/motion';
import { Cpu, Zap, Shield } from 'lucide-react';

export default function TechSection() {
  return (
    <section className="bg-[#0F1210] py-[clamp(5rem,8vw,8rem)] px-6">
      <div className="max-w-[900px] w-full mx-auto">
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <motion.div
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            className="bg-emerald/10 border border-emerald/20 text-emerald text-xs uppercase tracking-[0.12em] font-semibold px-4 py-[0.3rem] rounded-full"
          >
            UNDER THE HOOD
          </motion.div>
          <motion.h2
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            className="text-white font-bold text-[clamp(1.75rem,3.5vw,2.75rem)] tracking-tight max-w-[700px]"
          >
            Gentle intelligence, not generic productivity.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            className="flex flex-col gap-6"
          >
            <h3 className="text-white font-bold text-xl lg:text-2xl">Calibrated Prompting for Empathy</h3>
            <div className="flex flex-col gap-5 text-white/50 text-sm font-normal leading-[1.8]">
              <p>
                Break It Down doesn't use a generic productivity prompt. Every task breakdown is generated with a system-level instruction set engineered specifically for people experiencing ADHD, burnout, anxiety, or executive dysfunction.
              </p>
              <p>
                The AI is instructed to: write at a 6th-grade reading level for clarity, never use imperative commanding language, add one micro-encouragement per step, and always present the absolute minimum viable action — not what's efficient, what's possible.
              </p>
              <p>
                Powered by Groq's ultra-low-latency inference with Llama 3.3 70B — the steps appear almost instantly, feeling like a real-time co-pilot rather than a slow tool.
              </p>
            </div>
          </motion.div>

          <div className="flex flex-col gap-4">
            {[
              {
                icon: <Cpu size={20} className="text-emerald" />,
                title: "Llama 3.3 70B",
                desc: "Meta's most capable open model, fine-tuned for nuanced language."
              },
              {
                icon: <Zap size={20} className="text-emerald" />,
                title: "Groq Inference",
                desc: "Sub-second response times. No waiting. No anxiety-inducing spinners."
              },
              {
                icon: <Shield size={20} className="text-emerald" />,
                title: "Privacy First",
                desc: "Tasks are processed but never stored on external servers. Your overwhelm stays yours."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true, margin: '-80px' }}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 lg:px-6 lg:py-5 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-white font-semibold text-base mb-0.5">{item.title}</h4>
                  <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}