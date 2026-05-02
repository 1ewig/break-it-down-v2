'use client';

import { useState } from 'react';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useTaskMutations } from '@/hooks/mutations/useTaskMutations';
import { useUIStore } from '@/store/useUIStore';
import { FADE_IN_UP, SCALE_IN, FADE_IN, STAGGER_CONTAINER } from '@/lib/animations';

export default function Home() {
  const [taskTitle, setTaskTitle] = useState('');
  const { createTask } = useTaskMutations();
  const router = useRouter();

  const handleBreakdown = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!taskTitle.trim() || createTask.isPending) return;

    try {
      const newTask = await createTask.mutateAsync(taskTitle);
      router.push(`/tasks/${newTask.id}`);
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Let\'s try again gently.');
    }
  };


  return (
    <motion.div 
      variants={STAGGER_CONTAINER}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-center flex-1 max-w-2xl mx-auto w-full p-6 gap-10"
    >
      <motion.div 
        variants={FADE_IN_UP}
        className="text-center"
      >
        <motion.div
          variants={SCALE_IN}
          className="inline-flex p-4 rounded-full bg-primary/10 mb-6"
        >
          <Sparkles className="w-12 h-12 text-primary" />
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-light text-text-primary mb-4 tracking-tight">
          What's on your mind?
        </h1>
        <p className="text-xl text-text-secondary font-light leading-relaxed">
          Type that big, overwhelming task. 
          <br />
          We'll break it into tiny, gentle steps for you.
        </p>
      </motion.div>

      <motion.form 
        onSubmit={handleBreakdown}
        variants={FADE_IN_UP}
        className="w-full relative"
      >
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="e.g., Clean the entire house, Start a business..."
          disabled={createTask.isPending}
          className="w-full bg-surface border-2 border-transparent focus:border-primary/20 rounded-3xl px-8 py-6 text-lg md:text-xl outline-none transition-all shadow-sm focus:shadow-2xl focus:shadow-primary/5 placeholder:opacity-30 pr-20"
        />
        
        <button
          type="submit"
          disabled={!taskTitle.trim() || createTask.isPending}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-white p-4 rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-lg shadow-primary/20 flex items-center justify-center"
        >
          {createTask.isPending ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <ArrowRight className="w-6 h-6" />
          )}
        </button>
      </motion.form>

      <motion.div
        variants={FADE_IN_UP}
        className="flex items-center gap-2 text-text-secondary/40 text-sm italic"
      >
        Powered by Groq & Llama 3.3 • Gentle AI
      </motion.div>
    </motion.div>


  );
}

