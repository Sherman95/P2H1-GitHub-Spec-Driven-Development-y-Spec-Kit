export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "in_progress" | "completed" | "overdue";

export type Task = {
  id: string;
  user_id: string;
  subject_id: string | null;
  title: string;
  description: string | null;
  due_date: string;
  priority: TaskPriority;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
};

export type TaskPayload = {
  subject_id: string | null;
  title: string;
  description: string | null;
  due_date: string;
  priority: TaskPriority;
  status: TaskStatus;
};

export type Summary = {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
  overdue: number;
  high_priority: number;
};

export type Filters = {
  status?: TaskStatus | "";
  priority?: TaskPriority | "";
  subject_id?: string | "";
  search?: string;
  sort?: string;
};
