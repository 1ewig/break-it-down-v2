import { Info, Heart } from 'lucide-react';
import { Step } from '@/types';

interface StepContentProps {
  step: Step;
}

export function StepContent({ step }: StepContentProps) {
  const parts = step.note ? step.note.split('---') : [];
  const noteLines = parts[0] 
    ? parts[0].includes('\n')
      ? parts[0].split('\n').map(l => l.trim()).filter(Boolean)
      : parts[0].split(/(?=\d+\.\s)/).map(l => l.trim()).filter(Boolean)
    : [];
  const reassurance = parts[1] ? parts[1].trim() : null;

  return (
    <>
      {noteLines.length > 0 && (
        <div className="flex flex-col gap-3">
          {noteLines.map((line, idx) => (
            <div 
              key={idx}
              className="text-text-primary text-[15px] font-normal leading-relaxed border-l-2 border-primary/40 pl-4 py-2.5 bg-surface/40 rounded-r-2xl pr-4 shadow-2xs"
            >
              {line}
            </div>
          ))}
        </div>
      )}

      {reassurance && (
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-start gap-3 shadow-2xs">
          <Heart className="w-4 h-4 text-primary mt-1 shrink-0" />
          <p className="text-primary/90 text-sm font-medium italic leading-relaxed">
            {reassurance}
          </p>
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
