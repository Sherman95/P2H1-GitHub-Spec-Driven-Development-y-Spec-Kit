from ..repositories.subject_repository import SubjectRepository


class SubjectService:
    def __init__(self, repo: SubjectRepository) -> None:
        self.repo = repo

    def list(self, user_id: str) -> list[dict]:
        return self.repo.list(user_id)

    def get(self, user_id: str, subject_id: str) -> dict | None:
        return self.repo.get(user_id, subject_id)

    def create(self, user_id: str, payload: dict) -> dict:
        return self.repo.create(user_id, payload)

    def update(self, user_id: str, subject_id: str, payload: dict) -> dict | None:
        return self.repo.update(user_id, subject_id, payload)

    def delete(self, user_id: str, subject_id: str) -> bool:
        return self.repo.delete(user_id, subject_id)
