'use client';

import { GentleCheckbox } from '@/components/ui/GentleCheckbox';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FADE_IN_UP, ACCORDION_ANIMATION, SPRING_GENTLE } from '@/lib/animations';
import { Step } from '@/types';
import { StepMetadata } from './StepMetadata';
import { StepContent } from './StepContent';
import { StepActions } from './StepActions';
import { useStepItemLogic } from '@/hooks/useStepItemLogic';

interface StepItemProps {
  step: Step;
  children?: React.ReactNode;
  onToggleComplete: (taskId: string, stepId: string, isCompleted: boolean) => void;
  onBreakdown: (taskId: string, stepId: string, stepTitle: string) => void;
  isBreakingDown: boolean;
  level?: number;
}

export function StepItem({ 
  step, 
  children, 
  onToggleComplete, 
  onBreakdown,
  isBreakingDown,
  level = 0
}: StepItemProps) {
  const {
    isOpen,
    setIsOpen,
    handleToggle,
    handleBreakdownClick,
    handleMarkDoneClick,
  } = useStepItemLogic({ step, onToggleComplete, onBreakdown });

  if (level > 0) {
    return (
      <motion.div
        layout
        variants={FADE_IN_UP}
        initial="initial"
        animate="animate"
        className={cn(
          "flex flex-col bg-surface rounded-2xl border border-text-secondary/5 p-3.5 shadow-sm transition-all duration-300",
          step.is_completed ? "opacity-50 bg-transparent border-transparent" : "hover:border-primary/20 bg-surface"
        )}
      >
        <div className="flex items-start gap-3">
          <div onClick={(e) => e.stopPropagation()}>
            <GentleCheckbox 
              checked={step.is_completed} 
              onChange={(checked) => onToggleComplete(step.task_id, step.id, checked)}
              className="mt-0.5 scale-90"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={cn(
              "text-[15px] font-medium transition-all duration-300",
              step.is_completed ? 'text-text-secondary line-through' : 'text-text-primary'
            )}>
              {step.title}
            </h4>
            {step.subtitle && (
              <p className="text-text-secondary/70 text-xs mt-0.5">{step.subtitle}</p>
            )}
            {step.time_estimate && !step.is_completed && (
              <span className="inline-block text-[10px] text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full mt-1.5 font-medium">
                {step.time_estimate}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      variants={FADE_IN_UP}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-2"
    >
      <div className={cn(
        "flex flex-col bg-surface rounded-3xl border transition-all duration-300",
        step.is_completed ? "opacity-60 border-transparent bg-surface/50" : "border-text-secondary/10 shadow-sm",
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
                <StepMetadata step={step} />
                <StepContent step={step} />

                {!children && (
                  <StepActions 
                    isBreakingDown={isBreakingDown}
                    onBreakdown={handleBreakdownClick}
                    onToggleComplete={handleMarkDoneClick}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {children && (
          <div className="px-5 pb-5 pt-4 flex flex-col gap-3 border-t border-text-secondary/5 bg-primary/5 rounded-b-3xl">
            <div className="text-[12px] font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Micro-steps</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {children}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}