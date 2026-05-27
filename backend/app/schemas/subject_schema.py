from pydantic import BaseModel


class SubjectBase(BaseModel):
    name: str
    teacher: str | None = None
    color: str = "#3B82F6"


class SubjectCreate(SubjectBase):
    pass


class SubjectUpdate(SubjectBase):
    pass


class SubjectOut(SubjectBase):
    id: str
    user_id: str
    created_at: str
