import { Loader2, Sparkles, Check } from 'lucide-react';

interface StepActionsProps {
  isBreakingDown: boolean;
  hasChildren?: boolean;
  onBreakdown: (e: React.MouseEvent) => void;
  onToggleComplete: (e: React.MouseEvent) => void;
}

export function StepActions({ 
  isBreakingDown, 
  hasChildren,
  onBreakdown, 
  onToggleComplete 
}: StepActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 mt-2">
      <button
        onClick={onBreakdown}
        disabled={isBreakingDown || hasChildren}
        className="flex items-center justify-center gap-2 py-3 bg-surface border border-text-secondary/10 hover:border-primary/30 rounded-2xl text-sm text-text-primary transition-all disabled:opacity-50 cursor-pointer"
      >
        {isBreakingDown ? (
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
        ) : (
          <Sparkles className="w-4 h-4 text-primary" />
        )}
        <span>{isBreakingDown ? 'Breaking...' : hasChildren ? 'Broken down' : 'Break it down'}</span>
      </button>

      <button
        onClick={onToggleComplete}
        className="flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-2xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20 cursor-pointer"
      >
        <Check className="w-4 h-4" />
        <span>Mark done</span>
      </button>
    </div>
  );
}
