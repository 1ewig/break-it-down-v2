'use client';

import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useParams, useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { GentleCheckbox } from '@/components/ui/GentleCheckbox';
import { Step } from '@/types';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { tasks, updateStepCompletion, addSubSteps } = useTasks();
  
  const id = params?.id as string;
  const task = tasks.find(t => t.id === id);
  const [breakingDownId, setBreakingDownId] = useState<string | null>(null);

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-text-secondary">
        <p>Loading your gentle plan...</p>
      </div>
    );
  }

  const handleBreakdown = async (stepId: string, stepTitle: string) => {
    setBreakingDownId(stepId);
    try {
      const res = await fetch('/api/tasks/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId, stepTitle, taskId: task.id })
      });
      const data = await res.json();
      if (data.steps) {
        addSubSteps(task.id, stepId, data.steps);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setBreakingDownId(null);
    }
  };

  // Organize steps recursively
  const buildStepTree = (parentId: string | null): React.ReactNode[] => {
    const children = task.steps.filter(s => s.parent_step_id === parentId);
    return children.map((step) => {
      const isBreakingDown = breakingDownId === step.id;
      const childElements = buildStepTree(step.id);
      
      return (
        <motion.div
          key={step.id}
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3 mt-4"
        >
          <div className="flex items-start gap-4 p-4 bg-surface rounded-2xl border border-text-secondary/5 shadow-sm group">
            <GentleCheckbox 
              checked={step.is_completed} 
              onChange={(checked) => updateStepCompletion(task.id, step.id, checked)}
              className="mt-1"
            />
            <div className="flex-1">
              <p className={`text-[15px] transition-all duration-300 ${step.is_completed ? 'text-text-secondary line-through opacity-50' : 'text-text-primary'}`}>
                {step.title}
              </p>
              
              <AnimatePresence>
                {!step.is_completed && childElements.length === 0 && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => handleBreakdown(step.id, step.title)}
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
          
          {childElements.length > 0 && (
            <div className="ml-6 pl-4 border-l-2 border-surface flex flex-col pt-1">
              {childElements}
            </div>
          )}
        </motion.div>
      );
    });
  };

  const topLevelSteps = buildStepTree(null);

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto w-full p-4 md:p-8">
      <Link href="/tasks" className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-8 w-max">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to My Tasks</span>
      </Link>

      <div className="mb-8">
        <motion.h1 layout className="text-3xl font-light text-text-primary mb-3">
          {task.title}
        </motion.h1>
        <p className="text-text-secondary text-sm mb-8">Take your time. There is no rush.</p>
        
        <div className="bg-surface/50 p-6 rounded-3xl border border-surface">
          <div className="flex justify-between items-end mb-3">
            <span className="text-text-primary text-sm font-medium">Progress</span>
            <span className="text-primary font-mono text-xl">{task.progress_percentage}%</span>
          </div>
          <ProgressBar percentage={task.progress_percentage} className="h-4" />
        </div>
      </div>

      <div className="flex-1 pb-20">
         {topLevelSteps}
      </div>
    </div>
  );
}
