from dataclasses import dataclass


@dataclass
class Task:
    id: str
    user_id: str
    subject_id: str | None
    title: str
    description: str | None
    due_date: str
    priority: str
    status: str
    created_at: str
    updated_at: str
