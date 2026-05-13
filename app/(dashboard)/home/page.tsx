'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTaskMutations } from '@/hooks/useTaskMutations';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeForm } from '@/components/home/HomeForm';
import { HomeFooter } from '@/components/home/HomeFooter';
import { AlertDialog } from '@/components/ui/AlertDialog';
import { motion } from 'motion/react';
import { STAGGER_CONTAINER } from '@/lib/animations';

export default function Home() {
  const [taskTitle, setTaskTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { createTask } = useTaskMutations();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || createTask.isPending) return;

    try {
      const newTask = await createTask.mutateAsync(taskTitle);
      router.push(`/tasks/${newTask.id}`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Something went wrong. Let's try again gently.";
      setErrorMessage(msg);
    }
  };

  return (
    <motion.div 
      variants={STAGGER_CONTAINER}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-center flex-1 max-w-2xl mx-auto w-full p-6 gap-4"
    >
      <HomeHeader />
      <HomeForm 
        taskTitle={taskTitle}
        onTitleChange={setTaskTitle}
        onSubmit={handleSubmit}
        isPending={createTask.isPending}
        canSubmit={taskTitle.trim().length > 0}
      />
      <HomeFooter />

      <AlertDialog
        open={!!errorMessage}
        message={errorMessage ?? ''}
        onClose={() => setErrorMessage(null)}
      />
    </motion.div>
  );
}