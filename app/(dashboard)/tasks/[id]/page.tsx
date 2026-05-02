'use client';

import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useParams, useRouter } from 'next/navigation';
import { StepItem } from '@/components/tasks/StepItem';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Step } from '@/types';
import { STAGGER_CONTAINER, FADE_IN_UP, SCALE_IN, FADE_IN } from '@/lib/animations';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { tasks, updateStepCompletion, breakdownTask } = useTasks();
  
  const id = params?.id as string;
  const task = tasks.find(t => t.id === id);
  const [breakingDownId, setBreakingDownId] = useState<string | null>(null);

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-text-secondary">
        <Loader2 className="w-8 h-8 animate-spin mb-4 opacity-20" />
        <p className="italic font-light">Retrieving your gentle plan...</p>
      </div>
    );
  }

  const handleBreakdown = async (stepId: string, stepTitle: string) => {
    setBreakingDownId(stepId);
    try {
      await breakdownTask(task.id, stepId, stepTitle);
    } catch (error) {
      console.error(error);
    } finally {
      setBreakingDownId(null);
    }
  };

  const buildStepTree = (parentId: string | null): React.ReactNode[] => {
    const children = task.steps.filter(s => s.parent_step_id === parentId);
    return children.map((step) => {
      const isBreakingDown = breakingDownId === step.id;
      const childElements = buildStepTree(step.id);
      
      return (
        <StepItem
          key={step.id}
          step={step}
          onToggle={(checked) => updateStepCompletion(task.id, step.id, checked)}
          onBreakdown={() => handleBreakdown(step.id, step.title)}
          isBreakingDown={isBreakingDown}
        >
          {childElements.length > 0 ? childElements : null}
        </StepItem>
      );
    });
  };

  const topLevelSteps = buildStepTree(null);

  return (
    <motion.div 
      variants={STAGGER_CONTAINER}
      initial="initial"
      animate="animate"
      className="flex flex-col h-full max-w-2xl mx-auto w-full p-6 md:p-12 gap-10"
    >
      {/* Navigation */}
      <motion.div variants={FADE_IN_UP}>
        <Link href="/tasks" className="flex items-center gap-2 text-text-secondary/60 hover:text-primary transition-all w-max group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs uppercase tracking-widest font-medium">My Tasks</span>
        </Link>
      </motion.div>

      {/* Header Section */}
      <motion.div variants={FADE_IN_UP} className="flex flex-col">
        <div className="flex items-center gap-2 mb-4">
           <span className="text-[10px] uppercase tracking-[0.2em] text-text-secondary/50 bg-surface-raised border border-text-secondary/10 px-3 py-1 rounded-full">Task Overview</span>
           <div className="w-1 h-1 rounded-full bg-primary/40" />
        </div>

        <motion.h1 
          layout 
          className="text-4xl md:text-5xl font-light text-text-primary mb-6 tracking-tight leading-tight italic"
          style={{ fontFamily: 'var(--font-serif), serif' }}
        >
          {task.title}
        </motion.h1>
        
        {task.affirmation && (
          <motion.div 
            variants={SCALE_IN}
            className="bg-primary/5 border border-primary/10 rounded-3xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 left-4 text-7xl text-primary/10 font-serif leading-none select-none">"</div>
            <p className="text-primary italic text-lg leading-relaxed relative z-10 pl-4">
              {task.affirmation}
            </p>
          </motion.div>
        )}
        
        {/* Progress Section */}
        <div className="">
          <div className="flex justify-between items-baseline mb-4">
            <span className="text-text-secondary/50 text-[11px] uppercase tracking-widest font-bold">Progress</span>
            <div className="flex items-center gap-3">
               <span className="text-text-secondary/40 text-xs">{task.steps.filter(s => s.is_completed).length} of {task.steps.length} completed</span>
               <span className="text-primary font-medium text-sm">{task.progress_percentage}%</span>
            </div>
          </div>
          <ProgressBar percentage={task.progress_percentage} />
          <p className="text-center text-[11px] text-text-secondary/30 mt-4 italic">Take a deep breath. You are doing enough.</p>
        </div>
      </motion.div>

      {/* Steps List */}
      <motion.div 
        variants={STAGGER_CONTAINER}
        className="flex flex-col gap-4"
      >
         {topLevelSteps}
      </motion.div>

      {/* Closing Reassurance */}
      {task.closing_tip && (
        <motion.div
          variants={FADE_IN_UP}
          className="mb-32 p-8 bg-surface-raised border border-text-secondary/5 rounded-[40px] text-center"
        >
          <motion.div 
            variants={SCALE_IN}
            className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
             <Sparkles className="w-6 h-6 text-primary" />
          </motion.div>
          <h3 className="text-text-primary font-medium mb-3">You've got this</h3>
          <p className="text-text-secondary/80 text-sm leading-relaxed italic">
            {task.closing_tip}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
