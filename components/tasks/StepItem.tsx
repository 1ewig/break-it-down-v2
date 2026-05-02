import { GentleCheckbox } from '@/components/ui/GentleCheckbox';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2 } from 'lucide-react';

interface StepItemProps {
  step: any; // Using any for now to avoid circular dependency issues in types if they arise
  onToggle: (checked: boolean) => void;
  onBreakdown: () => void;
  isBreakingDown?: boolean;
  children?: React.ReactNode;
}

export function StepItem({ step, onToggle, onBreakdown, isBreakingDown, children }: StepItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-3 mt-4"
    >
      <div className="flex items-start gap-4 p-4 bg-surface rounded-2xl border border-text-secondary/5 shadow-sm group">
        <GentleCheckbox 
          checked={step.is_completed} 
          onChange={onToggle}
          className="mt-1"
        />
        <div className="flex-1">
          <p className={`text-[15px] transition-all duration-300 ${step.is_completed ? 'text-text-secondary line-through opacity-50' : 'text-text-primary'}`}>
            {step.title}
          </p>
          
          <AnimatePresence>
            {!step.is_completed && !children && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onBreakdown}
                disabled={isBreakingDown}
                className="mt-2 flex items-center gap-1.5 text-xs text-secondary hover:text-primary transition-colors disabled:opacity-50"
              >
                {isBreakingDown ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{isBreakingDown ? 'Breaking it down gently...' : 'Break down further'}</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {children && (
        <div className="ml-6 pl-4 border-l-2 border-surface flex flex-col pt-1">
          {children}
        </div>
      )}
    </motion.div>
  );
}
