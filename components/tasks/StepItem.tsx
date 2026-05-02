import { useState } from 'react';
import { GentleCheckbox } from '@/components/ui/GentleCheckbox';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2, ChevronDown, Clock, Package, Info, Check, FastForward } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepItemProps {
  step: any;
  onToggle: (checked: boolean) => void;
  onBreakdown: () => void;
  isBreakingDown?: boolean;
  children?: React.ReactNode;
}

export function StepItem({ step, onToggle, onBreakdown, isBreakingDown, children }: StepItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-2"
    >
      <div className={cn(
        "flex flex-col bg-surface rounded-3xl border transition-all duration-300",
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
              onChange={onToggle}
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
            {step.subtitle && !step.is_completed && (
              <p className="text-text-secondary/70 text-sm mt-1">{step.subtitle}</p>
            )}
          </div>

          {!step.is_completed && (
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              className="text-text-secondary/40 mt-1"
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {isOpen && !step.is_completed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        onBreakdown();
                      }}
                      disabled={isBreakingDown}
                      className="flex items-center justify-center gap-2 py-3 bg-surface border border-text-secondary/10 hover:border-primary/30 rounded-2xl text-sm text-text-primary transition-all disabled:opacity-50"
                    >
                      {isBreakingDown ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Sparkles className="w-4 h-4 text-primary" />}
                      <span>{isBreakingDown ? 'Breaking...' : 'Break down further'}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggle(true);
                        setIsOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-2xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
                    >
                      <Check className="w-4 h-4" />
                      <span>Mark as done</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                      }}
                      className="col-span-2 flex items-center justify-center gap-2 py-3 bg-transparent border border-text-secondary/5 hover:bg-text-secondary/5 rounded-2xl text-xs text-text-secondary/60 transition-all"
                    >
                      <FastForward className="w-3.5 h-3.5" />
                      <span>Skip for now — come back later</span>
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
