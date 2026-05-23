'use client';

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
      <Check
        className={`h-4 w-4 transition-all duration-300 ${checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
        strokeWidth={3}
      />
    </button>
  );
}
