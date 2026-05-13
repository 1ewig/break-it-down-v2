import { Info, Sparkles } from 'lucide-react';
import { Step } from '@/types';

interface StepContentProps {
  step: Step;
  children?: React.ReactNode;
}

export function StepContent({ step, children }: StepContentProps) {
  return (
    <>
      {children ? (
        <div className="flex flex-col gap-2 pt-1">
          <div className="text-[12px] font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5 mb-1 px-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Micro-steps</span>
          </div>
          <div className="flex flex-col gap-2">
            {children}
          </div>
        </div>
      ) : (
        step.note && (
          <div className="text-text-primary/80 text-[15px] leading-relaxed italic border-l-2 border-primary/20 pl-4 py-1">
            {step.note}
          </div>
        )
      )}

      {step.why && (
        <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
          <div className="flex items-center gap-2 text-[11px] font-bold text-primary uppercase tracking-widest mb-2">
            <Info className="w-3.5 h-3.5" />
            Why this matters
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">
            {step.why}
          </p>
        </div>
      )}
    </>
  );
}
