from fastapi import APIRouter, Depends

from ..schemas.auth_schema import LoginInput, RegisterInput, TokenOut, UserOut
from ..services.auth_service import AuthService
from ..services.dependencies import get_auth_service, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenOut)
def register(
    payload: RegisterInput,
    service: AuthService = Depends(get_auth_service)
):
    return service.register(payload)


@router.post("/login", response_model=TokenOut)
def login(payload: LoginInput, service: AuthService = Depends(get_auth_service)):
    return service.login(payload)


@router.get("/me", response_model=UserOut)
def me(current_user: dict = Depends(get_current_user)):
    return current_user
