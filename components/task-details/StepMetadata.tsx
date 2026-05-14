import { Clock, Package, Sparkles } from 'lucide-react';
import { Step } from '@/types';

interface StepMetadataProps {
  step: Step;
}

export function StepMetadata({ step }: StepMetadataProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {step.time_estimate && (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-background/40 border border-text-secondary/15 rounded-full text-[11px] text-text-secondary uppercase tracking-wider">
          <Clock className="w-3 h-3" />
          {step.time_estimate}
        </div>
      )}
      {step.materials && (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-background/40 border border-text-secondary/15 rounded-full text-[11px] text-text-secondary uppercase tracking-wider">
          <Package className="w-3 h-3" />
          {step.materials}
        </div>
      )}
      <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[11px] text-primary uppercase tracking-wider font-medium">
        <Sparkles className="w-3 h-3" />
        Tiny Step
      </div>
    </div>
  );
}
