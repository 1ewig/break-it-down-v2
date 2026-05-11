'use client';

import { useHomeForm } from '@/hooks/useHomeForm';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeForm } from '@/components/home/HomeForm';
import { HomeFooter } from '@/components/home/HomeFooter';
import { motion } from 'motion/react';
import { STAGGER_CONTAINER } from '@/lib/animations';

export default function Home() {
  const { taskTitle, setTaskTitle, handleSubmit, isPending, canSubmit } = useHomeForm();

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
        isPending={isPending}
        canSubmit={canSubmit}
      />
      <HomeFooter />
    </motion.div>
  );
}