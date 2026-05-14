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
        placeholder="e.g., Clean the entire house..."
        disabled={isPending}
        className="w-full h-[72px] bg-surface border border-text-secondary/10 rounded-[2rem] px-8 text-lg md:text-xl outline-none transition-all shadow-sm focus:shadow-[0_0_40px_rgba(74,160,115,0.1)] focus:border-primary/30 placeholder:text-text-secondary/30 pr-20 font-medium"
      />
      
      <button
        type="submit"
        disabled={!canSubmit || isPending}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-white w-[52px] h-[52px] rounded-[1.25rem] hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 shadow-[0_4px_20px_rgba(74,160,115,0.3)] flex items-center justify-center"
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