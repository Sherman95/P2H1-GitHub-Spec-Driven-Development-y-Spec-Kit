const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export const apiRequest = async (
  path: string,
  options?: RequestInit,
  token?: string
) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000); // 60 seconds timeout for Render cold starts
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_BASE}${path}`, {
      headers,
      signal: controller.signal,
      ...options
    });
    if (!response.ok) {
      throw new Error("Request failed");
    }
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
};
