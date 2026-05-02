import { useEffect } from 'react';
import { TaskWithSteps } from '@/types';

export function useChatTaskSync(messages: any[], tasks: TaskWithSteps[], addLocalTask: (task: TaskWithSteps) => void) {
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    const toolInvocations = lastMessage?.toolInvocations || lastMessage?.parts?.filter((p: any) => p.type === 'tool-invocation')?.map((p: any) => p.toolInvocation);
    
    if (toolInvocations) {
      toolInvocations.forEach((tool: any) => {
        if (tool.toolName === 'createTask' && tool.args) {
          const { taskTitle, steps } = tool.args;
          const taskId = tool.toolCallId || 'temp-id'; 
          
          if (!tasks.find(t => t.id === taskId)) {
            const stepsData = steps.map((stepTitle: string, idx: number) => ({
              id: `${taskId}-s-${idx}`,
              task_id: taskId,
              parent_step_id: null,
              title: stepTitle,
              is_completed: false,
              order_index: idx,
              created_at: new Date().toISOString()
            }));

            addLocalTask({
              id: taskId,
              user_id: 'anonymous',
              title: taskTitle,
              is_completed: false,
              progress_percentage: 0,
              created_at: new Date().toISOString(),
              steps: stepsData
            });
          }
        }
      });
    }
  }, [messages, tasks, addLocalTask]);
}
