from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from ..config.supabase_client import supabase
from ..repositories.subject_repository import SubjectRepository
from ..repositories.task_repository import TaskRepository
from ..repositories.user_repository import UserRepository
from .auth_service import AuthService
from .subject_service import SubjectService
from .task_service import TaskService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_user_repo() -> UserRepository:
    return UserRepository(supabase)


def get_subject_repo() -> SubjectRepository:
    return SubjectRepository(supabase)


def get_task_repo() -> TaskRepository:
    return TaskRepository(supabase)


def get_auth_service(user_repo: UserRepository = Depends(get_user_repo)) -> AuthService:
    return AuthService(user_repo)


def get_subject_service(repo: SubjectRepository = Depends(get_subject_repo)) -> SubjectService:
    return SubjectService(repo)


def get_task_service(repo: TaskRepository = Depends(get_task_repo)) -> TaskService:
    return TaskService(repo)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    service: AuthService = Depends(get_auth_service)
) -> dict:
    return service.get_current_user(token)
