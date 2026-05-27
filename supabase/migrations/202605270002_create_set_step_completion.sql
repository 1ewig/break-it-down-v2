CREATE OR REPLACE FUNCTION public.set_step_completion(
  p_step_id TEXT,
  p_is_completed BOOLEAN
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_task_id TEXT;
  v_progress NUMERIC;
  v_is_completed_task BOOLEAN;
  v_total_steps INT;
  v_completed_steps INT;
BEGIN
  UPDATE public.steps SET is_completed = p_is_completed WHERE id = p_step_id
  RETURNING task_id INTO v_task_id;

  IF v_task_id IS NULL THEN
    RAISE EXCEPTION 'Step not found or access denied';
  END IF;

  SELECT COUNT(*), COUNT(*) FILTER (WHERE is_completed)
  INTO v_total_steps, v_completed_steps
  FROM public.steps WHERE task_id = v_task_id;

  v_progress := CASE WHEN v_total_steps > 0
    THEN ROUND((v_completed_steps::NUMERIC / v_total_steps) * 100) ELSE 0 END;

  v_is_completed_task := (v_progress >= 100);

  UPDATE public.tasks
  SET progress_percentage = v_progress, is_completed = v_is_completed_task
  WHERE id = v_task_id;

  RETURN jsonb_build_object(
    'progress_percentage', v_progress,
    'is_completed', v_is_completed_task
  );
END;
$$;
