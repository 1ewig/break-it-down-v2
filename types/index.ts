export type Task = {
  id: string;
  title: string;
  affirmation?: string;
  closing_tip?: string;
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
  is_broken_down?: boolean;
};

// Joined types for UI
export type TaskWithSteps = Task & { steps: Step[] };
