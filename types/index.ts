export type Conversation = {
  id: string;
  user_id: string;
  title: string;
  messages: any;
  created_at: string;
};

export type Task = {
  id: string;
  user_id: string;
  title: string;
  affirmation?: string;
  is_completed: boolean;
  progress_percentage: number;
  created_at: string;
};

export type Step = {
  id: string;
  task_id: string;
  parent_step_id: string | null;
  title: string;
  subtitle?: string;
  time_estimate?: string;
  materials?: string;
  note?: string;
  why?: string;
  is_completed: boolean;
  order_index: number;
  created_at: string;
};

// Joined types for UI
export type TaskWithSteps = Task & { steps: Step[] };
