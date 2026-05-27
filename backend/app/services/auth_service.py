from fastapi import HTTPException, status

from ..repositories.user_repository import UserRepository
from ..schemas.auth_schema import LoginInput, RegisterInput
from ..utils.security import (
    TokenError,
    create_access_token,
    hash_password,
    safe_decode_access_token,
    verify_password
)


class AuthService:
    def __init__(self, user_repo: UserRepository) -> None:
        self.user_repo = user_repo

    def register(self, payload: RegisterInput) -> dict:
        if self.user_repo.get_by_email(payload.email):
            raise HTTPException(status_code=400, detail="Email already registered")

        user = self.user_repo.create(
            {
                "full_name": payload.full_name,
                "email": payload.email,
                "password_hash": hash_password(payload.password)
            }
        )
        token = create_access_token({"sub": user["id"]})
        return {"access_token": token, "token_type": "bearer", "user": self._map_user(user)}

    def login(self, payload: LoginInput) -> dict:
        user = self.user_repo.get_by_email(payload.email)
        if not user or not verify_password(payload.password, user["password_hash"]):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        token = create_access_token({"sub": user["id"]})
        return {"access_token": token, "token_type": "bearer", "user": self._map_user(user)}

    def get_current_user(self, token: str) -> dict:
        try:
            payload = safe_decode_access_token(token)
        except TokenError:
            raise HTTPException(status_code=401, detail="Invalid token")

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return self._map_user(user)

    @staticmethod
    def _map_user(user: dict) -> dict:
        return {
            "id": user["id"],
            "full_name": user["full_name"],
            "email": user["email"],
            "created_at": user["created_at"]
        }
