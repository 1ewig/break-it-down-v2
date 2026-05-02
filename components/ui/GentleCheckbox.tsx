'use client';

import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GentleCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export function GentleCheckbox({ checked, onChange, className }: GentleCheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        checked ? "border-primary bg-primary/20 text-primary" : "border-text-secondary/50 text-transparent",
        className
      )}
    >
      <motion.div
        initial={false}
        animate={{
          scale: checked ? [1.2, 1] : 1,
          opacity: checked ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <Check className="h-4 w-4" strokeWidth={3} />
      </motion.div>
    </button>
  );
}
