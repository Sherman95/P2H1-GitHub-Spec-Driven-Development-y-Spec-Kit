from pydantic import BaseModel
from typing import Literal

TaskPriority = Literal["low", "medium", "high"]
TaskStatus = Literal["pending", "in_progress", "completed", "overdue"]


class TaskBase(BaseModel):
    title: str
    description: str | None = None
    subject_id: str | None = None
    due_date: str
    priority: TaskPriority
    status: TaskStatus


class TaskCreate(TaskBase):
    pass


class TaskUpdate(TaskBase):
    pass


class TaskOut(TaskBase):
    id: str
    user_id: str
    created_at: str
    updated_at: str


class SummaryOut(BaseModel):
    total: int
    pending: int
    in_progress: int
    completed: int
    overdue: int
    high_priority: int
