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
  children?: React.ReactNode;
  onToggleComplete: (taskId: string, stepId: string, isCompleted: boolean) => void;
  onBreakdown: (taskId: string, stepId: string, stepTitle: string) => void;
  isBreakingDown: boolean;
}

export function StepItem({ 
  step, 
  children, 
  onToggleComplete, 
  onBreakdown,
  isBreakingDown 
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
      </div>
      
      {children && (
        <div className="ml-6 pl-4 border-l border-primary/10 flex flex-col pt-1">
          {children}
        </div>
      )}
    </motion.div>
  );
}