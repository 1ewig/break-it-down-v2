import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTaskMutations } from './useTaskMutations';

export function useHomeForm() {
  const [taskTitle, setTaskTitle] = useState('');
  const { createTask } = useTaskMutations();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || createTask.isPending) return;

    try {
      const newTask = await createTask.mutateAsync(taskTitle);
      router.push(`/tasks/${newTask.id}`);
    } catch (error) {
      console.error('Error creating task:', error);
      alert("Something went wrong. Let's try again gently.");
    }
  };

  return {
    taskTitle,
    setTaskTitle,
    handleSubmit,
    isPending: createTask.isPending,
    canSubmit: taskTitle.trim().length > 0,
  };
}