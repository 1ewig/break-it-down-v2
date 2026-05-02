import { TaskWithSteps, Step, Task } from '@/types';
import { useState, useEffect } from 'react';
import { supabase, hasSupabaseConfig } from '@/lib/supabase/client';

// Simple in-memory/localStorage fallback for AI Studio Preview without creds
function getLocalTasks(): TaskWithSteps[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('break_it_down_tasks');
  return stored ? JSON.parse(stored) : [];
}

function saveLocalTasks(tasks: TaskWithSteps[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('break_it_down_tasks', JSON.stringify(tasks));
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState<TaskWithSteps[]>(getLocalTasks());
  const [isLoading, setIsLoading] = useState(false);

  // Sync with Supabase on mount if configured
  useEffect(() => {
    async function fetchTasks() {
      if (!hasSupabaseConfig || !supabase) return;
      setIsLoading(true);
      try {
        const { data: dbTasks } = await supabase.from('tasks').select('*');
        const { data: dbSteps } = await supabase.from('steps').select('*');
        
        if (dbTasks && dbSteps) {
          const combined: TaskWithSteps[] = dbTasks.map(task => ({
            ...task,
            steps: dbSteps.filter(s => s.task_id === task.id).sort((a, b) => a.order_index - b.order_index)
          }));
          setTasks(combined);
          saveLocalTasks(combined);
        }
      } catch (err) {
        console.error('Failed fetching tasks from Supabase', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTasks();
  }, []);

  const addLocalTask = (taskWithSteps: TaskWithSteps) => {
    const newTasks = [taskWithSteps, ...tasks];
    setTasks(newTasks);
    saveLocalTasks(newTasks);
  };

  const updateStepCompletion = async (taskId: string, stepId: string, isCompleted: boolean) => {
    // Optimistic UI update
    let updatedTasks = tasks.map(t => {
      if (t.id !== taskId) return t;
      const updatedSteps = t.steps.map(s => s.id === stepId ? { ...s, is_completed: isCompleted } : s);
      const completedCount = updatedSteps.filter(s => s.is_completed).length;
      const progress = updatedSteps.length > 0 ? Math.round((completedCount / updatedSteps.length) * 100) : 0;
      return { ...t, steps: updatedSteps, progress_percentage: progress, is_completed: progress === 100 };
    });
    setTasks(updatedTasks);
    saveLocalTasks(updatedTasks);

    // Supabase Sync
    if (hasSupabaseConfig && supabase) {
      await supabase.from('steps').update({ is_completed: isCompleted }).eq('id', stepId);
      const t = updatedTasks.find(t => t.id === taskId);
      if (t) {
        await supabase.from('tasks').update({ progress_percentage: t.progress_percentage, is_completed: t.is_completed }).eq('id', taskId);
      }
    }
  };

  const addSubSteps = async (taskId: string, parentStepId: string, newSteps: Step[]) => {
    let updatedTasks = tasks.map(t => {
      if (t.id !== taskId) return t;
      return { ...t, steps: [...t.steps, ...newSteps] };
    });
    setTasks(updatedTasks);
    saveLocalTasks(updatedTasks);

    if (hasSupabaseConfig && supabase) {
      await supabase.from('steps').insert(newSteps);
    }
  };

  const breakdownTask = async (taskId: string, stepId: string, stepTitle: string) => {
    try {
      const res = await fetch('/api/tasks/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId, stepTitle, taskId })
      });
      const data = await res.json();
      if (data.steps) {
        addSubSteps(taskId, stepId, data.steps);
      }
      return data.steps;
    } catch (error) {
      console.error('Failed to break down task step', error);
      throw error;
    }
  };

  return {
    tasks,
    isLoading,
    addLocalTask,
    updateStepCompletion,
    addSubSteps,
    breakdownTask
  };
}
