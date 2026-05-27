from typing import Any

from supabase import Client


class UserRepository:
    def __init__(self, client: Client) -> None:
        self.client = client

    def get_by_email(self, email: str) -> dict | None:
        response = self.client.table("users").select("*").eq("email", email).execute()
        return response.data[0] if response.data else None

    def get_by_id(self, user_id: str) -> dict | None:
        response = self.client.table("users").select("*").eq("id", user_id).execute()
        return response.data[0] if response.data else None

    def create(self, payload: dict[str, Any]) -> dict:
        response = self.client.table("users").insert(payload).execute()
        return response.data[0]
