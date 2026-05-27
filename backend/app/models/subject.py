from dataclasses import dataclass


@dataclass
class Subject:
    id: str
    user_id: str
    name: str
    teacher: str | None
    color: str
    created_at: str
