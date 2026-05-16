import { useParams } from 'next/navigation';
import { useTaskQuery } from '@/hooks/useTasksQuery';
import { useTaskMutations } from '@/hooks/useTaskMutations';

export function useTaskDetail() {
  const params = useParams();
  const id = params?.id as string;

  const { data: task, isLoading } = useTaskQuery(id);
  const { updateStepCompletion, breakdownTask } = useTaskMutations();

  const breakingStepId = breakdownTask.isPending 
    ? (breakdownTask.variables as any)?.stepId ?? null 
    : null;

  const handleToggleComplete = (taskId: string, stepId: string, isCompleted: boolean) => {
    updateStepCompletion.mutate({ taskId, stepId, isCompleted });
  };

  const handleBreakdown = (taskId: string, stepId: string, stepTitle: string) => {
    breakdownTask.mutate({ taskId, stepId, stepTitle, taskTitle: task?.title });
  };

  return {
    task,
    isLoading,
    breakingStepId,
    breakdownError: breakdownTask.error,
    handleToggleComplete,
    handleBreakdown,
  };
}
