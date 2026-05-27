from supabase import Client


class SubjectRepository:
    def __init__(self, client: Client) -> None:
        self.client = client

    def list(self, user_id: str) -> list[dict]:
        response = self.client.table("subjects").select("*").eq("user_id", user_id).execute()
        return response.data or []

    def get(self, user_id: str, subject_id: str) -> dict | None:
        response = (
            self.client.table("subjects")
            .select("*")
            .eq("id", subject_id)
            .eq("user_id", user_id)
            .execute()
        )
        return response.data[0] if response.data else None

    def create(self, user_id: str, payload: dict) -> dict:
        data = {**payload, "user_id": user_id}
        response = self.client.table("subjects").insert(data).execute()
        return response.data[0]

    def update(self, user_id: str, subject_id: str, payload: dict) -> dict | None:
        response = (
            self.client.table("subjects")
            .update(payload)
            .eq("id", subject_id)
            .eq("user_id", user_id)
            .execute()
        )
        return response.data[0] if response.data else None

    def delete(self, user_id: str, subject_id: str) -> bool:
        response = (
            self.client.table("subjects")
            .delete()
            .eq("id", subject_id)
            .eq("user_id", user_id)
            .execute()
        )
        return bool(response.data)
