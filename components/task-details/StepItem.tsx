'use client';

import { useState } from 'react';
import { GentleCheckbox } from '@/components/ui/GentleCheckbox';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2, ChevronDown, Clock, Package, Info, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FADE_IN_UP, ACCORDION_ANIMATION, SPRING_GENTLE } from '@/lib/animations';
import { useTaskMutations } from '@/hooks/useTaskMutations';

interface StepItemProps {
  step: any;
  children?: React.ReactNode;
}

/**
 * Dumb presentational step component that maps user events directly to our custom mutations hook,
 * eliminating drill-down callback handlers and parent state tracking.
 */
export function StepItem({ step, children }: StepItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { updateStepCompletion, breakdownTask } = useTaskMutations();

  // Determine if this specific step is currently breaking down
  const isBreakingDown = breakdownTask.isPending && breakdownTask.variables?.stepId === step.id;

  const handleToggle = (checked: boolean) => {
    updateStepCompletion.mutate({
      taskId: step.task_id,
      stepId: step.id,
      isCompleted: checked
    });
    if (checked) {
      setIsOpen(false);
    }
  };

  const handleBreakdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    breakdownTask.mutate({
      taskId: step.task_id,
      stepId: step.id,
      stepTitle: step.title
    });
  };

  return (
    <motion.div
      layout
      variants={FADE_IN_UP}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-2"
    >
      <div className={cn(
        "flex flex-col bg-surface rounded-3xl border",
        step.is_completed ? "opacity-50 border-transparent" : "border-text-secondary/10 shadow-sm",
        isOpen && !step.is_completed && "border-primary/20 bg-surface-raised"
      )}>
        <div 
          className="flex items-start gap-4 p-5 cursor-pointer"
          onClick={() => !step.is_completed && setIsOpen(!isOpen)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <GentleCheckbox 
              checked={step.is_completed} 
              onChange={handleToggle}
              className="mt-1"
            />
          </div>
          
          <div className="flex-1">
            <h3 className={cn(
              "text-[16px] font-medium transition-all duration-300",
              step.is_completed ? 'text-text-secondary line-through' : 'text-text-primary'
            )}>
              {step.title}
            </h3>
            {step.subtitle && (
              <p className="text-text-secondary/70 text-sm mt-1">{step.subtitle}</p>
            )}
          </div>

          {!step.is_completed && (
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={SPRING_GENTLE}
              className="text-text-secondary/40 mt-1"
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {isOpen && !step.is_completed && (
            <motion.div
              variants={ACCORDION_ANIMATION}
              initial="initial"
              animate="animate"
              exit="exit"
              className="overflow-hidden"
            >
              <div className="px-5 pb-6 flex flex-col gap-5 border-t border-text-secondary/5 pt-5">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {step.time_estimate && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-raised border border-text-secondary/10 rounded-full text-[11px] text-text-secondary uppercase tracking-wider">
                      <Clock className="w-3 h-3" />
                      {step.time_estimate}
                    </div>
                  )}
                  {step.materials && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-raised border border-text-secondary/10 rounded-full text-[11px] text-text-secondary uppercase tracking-wider">
                      <Package className="w-3 h-3" />
                      {step.materials}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[11px] text-primary uppercase tracking-wider font-medium">
                    <Sparkles className="w-3 h-3" />
                    Tiny Step
                  </div>
                </div>

                {/* Note */}
                {step.note && (
                  <div className="text-text-primary/80 text-[15px] leading-relaxed italic border-l-2 border-primary/20 pl-4 py-1">
                    {step.note}
                  </div>
                )}

                {/* Why Box */}
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

                {/* Actions Grid */}
                {!children && (
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <button
                      onClick={handleBreakdownClick}
                      disabled={isBreakingDown}
                      className="flex items-center justify-center gap-2 py-3 bg-surface border border-text-secondary/10 hover:border-primary/30 rounded-2xl text-sm text-text-primary transition-all disabled:opacity-50"
                    >
                      {isBreakingDown ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Sparkles className="w-4 h-4 text-primary" />}
                      <span>{isBreakingDown ? 'Breaking...' : 'Break it down'}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(true);
                      }}
                      className="flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-2xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
                    >
                      <Check className="w-4 h-4" />
                      <span>Mark done</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {children && (
        <div className="ml-6 pl-4 border-l border-primary/10 flex flex-col pt-1">
          {children}
        </div>
      )}
    </motion.div>
  );
}
