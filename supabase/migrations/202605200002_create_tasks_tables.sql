-- Tasks table
CREATE TABLE public.tasks (
  id            TEXT PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  affirmation   TEXT,
  closing_tip   TEXT,
  is_completed  BOOLEAN NOT NULL DEFAULT FALSE,
  progress_percentage INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ
);

-- Steps table
CREATE TABLE public.steps (
  id               TEXT PRIMARY KEY,
  task_id          TEXT NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  parent_step_id   TEXT,
  title            TEXT NOT NULL,
  subtitle         TEXT,
  time_estimate    TEXT,
  materials        TEXT,
  note             TEXT,
  why              TEXT,
  is_completed     BOOLEAN NOT NULL DEFAULT FALSE,
  order_index      INTEGER NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_broken_down   BOOLEAN NOT NULL DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_deleted_at ON public.tasks(deleted_at);
CREATE INDEX idx_steps_task_id ON public.steps(task_id);
CREATE INDEX idx_steps_parent_step_id ON public.steps(parent_step_id);

-- Row Level Security
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their tasks" ON public.tasks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own their steps" ON public.steps
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tasks
      WHERE tasks.id = steps.task_id AND tasks.user_id = auth.uid()
    )
  );
