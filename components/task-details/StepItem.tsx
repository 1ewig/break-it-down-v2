'use client';

import { GentleCheckbox } from '@/components/ui/GentleCheckbox';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FADE_IN_UP, ACCORDION_ANIMATION, SPRING_GENTLE } from '@/lib/animations';
import { Step } from '@/types';
import { StepMetadata } from './StepMetadata';
import { StepContent } from './StepContent';
import { StepActions } from './StepActions';
import { useStepItemLogic } from '@/hooks/useStepItemLogic';

interface StepItemProps {
  step: Step;
  onToggleComplete: (taskId: string, stepId: string, isCompleted: boolean) => void;
  onBreakdown: (taskId: string, stepId: string, stepTitle: string) => void;
  isBreakingDown: boolean;
}

export function StepItem({ 
  step, 
  onToggleComplete, 
  onBreakdown,
  isBreakingDown,
}: StepItemProps) {
  const {
    isOpen,
    setIsOpen,
    handleToggle,
    handleBreakdownClick,
    handleMarkDoneClick,
  } = useStepItemLogic({ step, onToggleComplete, onBreakdown });

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
        isOpen && !step.is_completed && "border-primary/30 bg-surface/80 shadow-md"
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
              <div className="px-5 pb-6 flex flex-col gap-4 border-t border-text-secondary/10 pt-5">
                <StepMetadata step={step} />
                <StepContent step={step} />

                <StepActions 
                  isBreakingDown={isBreakingDown}
                  hasChildren={step.is_broken_down}
                  onBreakdown={handleBreakdownClick}
                  onToggleComplete={handleMarkDoneClick}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}