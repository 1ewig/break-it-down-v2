import { createClient } from './client';

export function getTasksTable() {
  return createClient().from('tasks');
}

export function getStepsTable() {
  return createClient().from('steps');
}
