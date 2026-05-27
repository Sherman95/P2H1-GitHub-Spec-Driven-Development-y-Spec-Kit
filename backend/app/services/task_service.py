from datetime import date

from ..repositories.task_repository import TaskRepository


class TaskService:
    def __init__(self, repo: TaskRepository) -> None:
        self.repo = repo

    def list(self, user_id: str, filters: dict) -> list[dict]:
        self._sync_overdue(user_id)
        return self.repo.list(user_id, filters)

    def get(self, user_id: str, task_id: str) -> dict | None:
        return self.repo.get(user_id, task_id)

    def create(self, user_id: str, payload: dict) -> dict:
        return self.repo.create(user_id, payload)

    def update(self, user_id: str, task_id: str, payload: dict) -> dict | None:
        return self.repo.update(user_id, task_id, payload)

    def delete(self, user_id: str, task_id: str) -> bool:
        return self.repo.delete(user_id, task_id)

    def summary(self, user_id: str) -> dict:
        self._sync_overdue(user_id)
        return self.repo.summary(user_id)

    def _sync_overdue(self, user_id: str) -> None:
        today = date.today().isoformat()
        self.repo.mark_overdue(user_id, today)
