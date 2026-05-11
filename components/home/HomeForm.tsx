'use client';

import { ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { FADE_IN_UP } from '@/lib/animations';

interface HomeFormProps {
  taskTitle: string;
  onTitleChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  canSubmit: boolean;
}

export function HomeForm({ 
  taskTitle, 
  onTitleChange, 
  onSubmit, 
  isPending, 
  canSubmit 
}: HomeFormProps) {
  return (
    <motion.form 
      onSubmit={onSubmit}
      variants={FADE_IN_UP}
      className="w-full relative"
    >
      <input
        type="text"
        value={taskTitle}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="e.g., Clean the entire house, Start a business..."
        disabled={isPending}
        className="w-full bg-surface border-2 border-transparent focus:border-primary/20 rounded-3xl px-8 py-6 text-lg md:text-xl outline-none transition-all shadow-sm focus:shadow-2xl focus:shadow-primary/5 placeholder:opacity-30 pr-20"
      />
      
      <button
        type="submit"
        disabled={!canSubmit || isPending}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-white p-4 rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-lg shadow-primary/20 flex items-center justify-center"
      >
        {isPending ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <ArrowRight className="w-6 h-6" />
        )}
      </button>
    </motion.form>
  );
}