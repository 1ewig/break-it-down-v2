'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTaskMutations } from '@/hooks/useTaskMutations';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeForm } from '@/components/home/HomeForm';
import { HomeFooter } from '@/components/home/HomeFooter';
import { EnergySelector } from '@/components/home/EnergySelector';
import { TaskLoadingOverlay } from '@/components/home/TaskLoadingOverlay';
import { AlertDialog } from '@/components/ui/AlertDialog';
import { AnimatePresence, motion } from 'motion/react';
import { STAGGER_CONTAINER } from '@/lib/animations';

const MIN_LOADING_MS = 3000;

export default function Home() {
  const [taskTitle, setTaskTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [creatingTask, setCreatingTask] = useState<string | null>(null);
  const { createTask } = useTaskMutations();
  const router = useRouter();
  const startedAt = useRef(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || createTask.isPending) return;

    const title = taskTitle;
    setCreatingTask(title);
    setTaskTitle('');
    startedAt.current = Date.now();

    try {
      const newTask = await createTask.mutateAsync({ taskTitle: title });
      const elapsed = Date.now() - startedAt.current;
      if (elapsed < MIN_LOADING_MS) {
        await new Promise(r => setTimeout(r, MIN_LOADING_MS - elapsed));
      }
      setCreatingTask(null);
      router.push(`/tasks/${newTask.id}`);
    } catch (error) {
      setCreatingTask(null);
      const msg = error instanceof Error ? error.message : "Something went wrong. Let's try again gently.";
      setErrorMessage(msg);
    }
  };

  return (
    <>
      <motion.div 
        variants={STAGGER_CONTAINER}
        initial="initial"
        animate="animate"
        className="flex flex-col items-center justify-center flex-1 max-w-2xl mx-auto w-full p-6 gap-4"
      >
        <HomeHeader />
        <EnergySelector />
        <HomeForm 
          taskTitle={taskTitle}
          onTitleChange={setTaskTitle}
          onSubmit={handleSubmit}
          isPending={!!creatingTask}
          canSubmit={taskTitle.trim().length > 0}
        />
        <HomeFooter />

        <AlertDialog
          open={!!errorMessage}
          message={errorMessage ?? ''}
          onClose={() => setErrorMessage(null)}
        />
      </motion.div>

      <AnimatePresence>
        {creatingTask && (
          <TaskLoadingOverlay taskTitle={creatingTask} />
        )}
      </AnimatePresence>
    </>
  );
}