'use client';

import { useState } from 'react';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useTasks } from '@/hooks/useTasks';

export default function Home() {
  const [taskTitle, setTaskTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { addLocalTask } = useTasks();

  const handleBreakdown = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!taskTitle.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/tasks/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskTitle }),
      });

      if (!response.ok) throw new Error('Failed to breakdown task');

      const data = await response.json();
      
      const taskId = `task-${Date.now()}`;
      const stepsData = data.steps.map((step: any, idx: number) => ({
        id: `${taskId}-s-${idx}`,
        task_id: taskId,
        parent_step_id: null,
        title: step.title,
        subtitle: step.subtitle,
        time_estimate: step.time_estimate,
        materials: step.materials,
        note: step.note,
        why: step.why,
        is_completed: false,
        order_index: idx,
        created_at: new Date().toISOString()
      }));

      addLocalTask({
        id: taskId,
        user_id: 'anonymous',
        title: data.title || taskTitle,
        affirmation: data.affirmation,
        is_completed: false,
        progress_percentage: 0,
        created_at: new Date().toISOString(),
        steps: stepsData
      });

      router.push(`/tasks/${taskId}`);
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Let\'s try again gently.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] max-w-2xl mx-auto w-full p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex p-4 rounded-full bg-primary/10 mb-6"
        >
          <Sparkles className="w-12 h-12 text-primary" />
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-light text-text-primary mb-6 tracking-tight">
          What's on your mind?
        </h1>
        <p className="text-xl text-text-secondary font-light leading-relaxed">
          Type that big, overwhelming task. 
          <span className="block mt-1 opacity-60">We'll break it into tiny, gentle steps for you.</span>
        </p>
      </motion.div>

      <motion.form 
        onSubmit={handleBreakdown}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full relative"
      >
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="e.g., Clean the entire house, Start a business..."
          disabled={isLoading}
          className="w-full bg-surface border-2 border-surface-hover focus:border-primary/30 rounded-3xl px-8 py-6 text-lg md:text-xl outline-none transition-all shadow-sm focus:shadow-xl placeholder:opacity-30 pr-20"
        />
        
        <button
          type="submit"
          disabled={!taskTitle.trim() || isLoading}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-white p-4 rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-lg shadow-primary/20 flex items-center justify-center"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <ArrowRight className="w-6 h-6" />
          )}
        </button>
      </motion.form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex items-center gap-2 text-text-secondary/40 text-sm italic"
      >
        Powered by Groq & Llama 3.3 • Gentle AI
      </motion.div>
    </div>
  );
}
