from pydantic import BaseModel
from typing import Literal

TaskPriority = Literal["low", "medium", "high"]
TaskStatus = Literal["pending", "in_progress", "finished"]


class TaskBase(BaseModel):
    title: str
    description: str
    subject: str
    due_date: str
    priority: TaskPriority
    status: TaskStatus


class TaskCreate(TaskBase):
    pass


class TaskUpdate(TaskBase):
    pass


class TaskOut(TaskBase):
    id: str
    created_at: str
    updated_at: str
