export type Subject = {
  id: string;
  user_id: string;
  name: string;
  teacher: string | null;
  color: string;
  created_at: string;
};

export type SubjectPayload = {
  name: string;
  teacher: string | null;
  color: string;
};
