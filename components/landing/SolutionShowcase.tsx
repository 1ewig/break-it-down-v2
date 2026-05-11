'use client';

import { motion } from 'motion/react';
import { FADE_UP } from '@/lib/motion';
import { Sparkles, ChevronDown, MoveRight } from 'lucide-react';

export default function SolutionShowcase() {
  return (
    <section id="how-it-works" className="bg-[#0F1210] py-[clamp(5rem,8vw,8rem)] px-6">
      <div className="max-w-[1100px] w-full mx-auto">
        <div className="flex flex-col items-center text-center gap-5 mb-16">
          <motion.div
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            className="bg-emerald/10 border border-emerald/20 text-emerald text-xs uppercase tracking-[0.12em] font-semibold px-4 py-[0.3rem] rounded-full"
          >
            HOW IT WORKS
          </motion.div>
          <motion.h2
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            className="text-white font-bold text-[clamp(2rem,4.5vw,3.5rem)] tracking-tight"
          >
            Your AI co-pilot for <br className="hidden sm:block" />
            getting unstuck.
          </motion.h2>
          <motion.p
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            className="text-white/45 font-medium text-sm sm:text-base"
          >
            Three screens. One simple idea. <br className="sm:hidden" />
            You tell us the scary thing — we make it tiny.
          </motion.p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          <div className="hidden md:block absolute top-[14px] left-[16.66%] right-[16.66%] h-px border-t border-dashed border-white/10 z-0" />

          <motion.div
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            transition={{ delay: 0 }}
            className="relative z-10 flex flex-col gap-5"
          >
            <div className="mx-auto flex items-center justify-center w-[28px] h-[28px] bg-emerald/15 border border-emerald/25 rounded-full text-sm font-bold text-emerald">
              1
            </div>
            
            <div className="bg-[#1C1F1D] border border-white/10 rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.3)] aspect-[4/5] p-7 overflow-hidden flex flex-col items-center justify-center relative">
              <div className="w-[52px] h-[52px] rounded-full bg-emerald/15 border border-emerald/30 mb-6 flex items-center justify-center">
                <Sparkles size={24} className="text-emerald" />
              </div>
              <h3 className="text-white font-bold text-xl text-center mb-2">What's on your mind?</h3>
              <p className="text-white/40 text-xs text-center mb-8">Type that big, overwhelming task.</p>
              
              <div className="w-full h-[48px] bg-white/5 border border-white/10 rounded-2xl flex items-center px-4 mb-4">
                <p className="text-white/20 text-sm truncate flex-1">e.g., Clean the entire house...</p>
                <div className="w-6 h-6 rounded-md bg-emerald/20 flex items-center justify-center">
                   <MoveRight size={14} className="text-emerald" />
                </div>
              </div>
              
              <p className="absolute bottom-5 text-white/20 text-[10px] w-full text-center">Powered by Groq & Llama 3.3</p>
            </div>

            <div className="mt-2">
              <h4 className="text-white font-bold text-base mb-1">Tell Us The Scary Thing</h4>
              <p className="text-white/45 text-xs leading-relaxed">No need to plan. Just describe the overwhelming thing exactly as it feels.</p>
            </div>
          </motion.div>

          <motion.div
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            transition={{ delay: 0.12 }}
            className="relative z-10 flex flex-col gap-5"
          >
            <div className="mx-auto flex items-center justify-center w-[28px] h-[28px] bg-emerald/15 border border-emerald/25 rounded-full text-sm font-bold text-emerald">
              2
            </div>
            
            <div className="bg-[#1C1F1D] border border-white/10 rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.3)] aspect-[4/5] p-7 overflow-hidden">
              <h3 className="text-white font-bold text-lg text-center mb-1">My Tasks</h3>
              <p className="text-white/40 text-[11px] text-center mb-6">One gentle step at a time.</p>
              
              <div className="space-y-3">
                {[
                  { name: "Finding Your Friends...", steps: "7 steps", progress: 0 },
                  { name: "Start My Business Plan...", steps: "24 steps", progress: 35 },
                  { name: "Clean My Apartment...", steps: "12 steps", progress: 10 }
                ].map((task, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-white font-semibold text-sm truncate">{task.name}</p>
                      <span className="text-white/30 text-xs flex-shrink-0">{task.steps}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/30 text-[9px] font-bold tracking-widest">PROGRESS</span>
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald rounded-full" style={{ width: `${task.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-2">
              <h4 className="text-white font-bold text-base mb-1">See Everything Organized</h4>
              <p className="text-white/45 text-xs leading-relaxed">All your broken-down tasks live here, with gentle progress tracking. No deadlines. No pressure.</p>
            </div>
          </motion.div>

          <motion.div
            variants={FADE_UP}
            initial="initial"
            whileInView="whileInView"
            transition={{ delay: 0.24 }}
            className="relative z-10 flex flex-col gap-5"
          >
            <div className="mx-auto flex items-center justify-center w-[28px] h-[28px] bg-emerald/15 border border-emerald/25 rounded-full text-sm font-bold text-emerald">
              3
            </div>
            
            <div className="bg-[#1C1F1D] border border-white/10 rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.3)] aspect-[4/5] p-6 lg:p-7 overflow-hidden flex flex-col">
              <h3 className="text-white font-bold text-lg text-center mb-4 truncate">Finding Your Friends...</h3>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-4">
                <p className="text-white/50 text-[11px] text-center italic leading-relaxed">"It's perfectly okay to feel a little lost..."</p>
              </div>
              
              <p className="text-white/40 text-xs mb-2">0 of 7 completed</p>
              <div className="w-full h-1.5 bg-white/10 rounded-full mb-4" />
              
              <div className="space-y-2 flex-1">
                {[
                  { title: "Take a Deep Breath", sub: "Just one. In and out." },
                  { title: "Think of One Friend's Name", sub: "Don't message them yet." },
                  { title: "Check Your Phone", sub: "Look at your last text." }
                ].map((step, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border-[1.5px] border-white/20 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-white font-semibold text-[13px]">{step.title}</p>
                      <p className="text-white/35 text-[10px] mt-0.5">{step.sub}</p>
                    </div>
                    <ChevronDown size={14} className="text-white/25 mt-1" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-2">
              <h4 className="text-white font-bold text-base mb-1">Break It Down, Infinitely</h4>
              <p className="text-white/45 text-xs leading-relaxed">Click any step to break it into even tinier micro-actions. Go as deep as you need. The AI has infinite patience.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}