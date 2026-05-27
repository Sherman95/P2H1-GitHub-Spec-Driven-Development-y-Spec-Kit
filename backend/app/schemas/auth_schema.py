from pydantic import BaseModel


class RegisterInput(BaseModel):
    full_name: str
    email: str
    password: str


class LoginInput(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: str
    full_name: str
    email: str
    created_at: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
