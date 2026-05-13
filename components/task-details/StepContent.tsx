import { Info } from 'lucide-react';
import { Step } from '@/types';

interface StepContentProps {
  step: Step;
}

export function StepContent({ step }: StepContentProps) {
  return (
    <>
      {step.note && (
        <div className="text-text-primary text-[15px] font-normal leading-relaxed border-l-2 border-primary/30 pl-4 py-1.5 whitespace-pre-line bg-surface/30 rounded-r-xl pr-3">
          {step.note}
        </div>
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
