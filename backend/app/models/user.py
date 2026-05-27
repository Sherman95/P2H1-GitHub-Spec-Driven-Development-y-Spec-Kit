from dataclasses import dataclass


@dataclass
class User:
    id: str
    full_name: str
    email: str
    password_hash: str
    created_at: str
