'use client';

import { GentleCheckbox } from '@/components/ui/GentleCheckbox';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Clock, Package, Sparkles, Info, Heart, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FADE_IN_UP, ACCORDION_ANIMATION, SPRING_GENTLE } from '@/lib/animations';
import { Step } from '@/types';
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

/**
 * Internal sub-components for StepItem to reduce folder bloat.
 */

function StepMetadata({ step }: { step: Step }) {
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

function StepContent({ step }: { step: Step }) {
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
              className="text-text-primary text-[15px] font-normal leading-relaxed border-l-[3px] border-primary/60 pl-4 py-3 bg-background/30 rounded-r-2xl pr-4 shadow-xs"
            >
              {line}
            </div>
          ))}
        </div>
      )}

      {reassurance && (
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
          <Heart className="w-4 h-4 text-primary mt-1 shrink-0" />
          <p className="text-primary/90 text-sm font-medium italic leading-relaxed">
            {reassurance}
          </p>
        </div>
      )}

      {step.why && (
        <div className="bg-primary/8 rounded-2xl p-4 border border-primary/20">
          <div className="flex items-center gap-2 text-[11px] font-bold text-primary uppercase tracking-widest mb-2">
            <Info className="w-3.5 h-3.5" />
            Why this matters
          </div>
          <p className="text-text-primary/80 text-sm leading-relaxed">
            {step.why}
          </p>
        </div>
      )}
    </>
  );
}

function StepActions({ 
  isBreakingDown, 
  hasChildren,
  onBreakdown, 
  onToggleComplete 
}: {
  isBreakingDown: boolean;
  hasChildren?: boolean;
  onBreakdown: (e: React.MouseEvent) => void;
  onToggleComplete: (e: React.MouseEvent) => void;
}) {
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