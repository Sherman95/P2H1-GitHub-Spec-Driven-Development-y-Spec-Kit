import { apiRequest } from "./api";
import {
  clearSession,
  loadLocalUsers,
  loadSession,
  saveLocalUsers,
  saveSession,
  type LocalUser
} from "./localStore";
import type { AuthResponse, User } from "../types/auth";

const createLocalUser = (full_name: string, email: string, password: string): LocalUser => ({
  id: crypto.randomUUID(),
  full_name,
  email,
  password,
  created_at: new Date().toISOString()
});

const createLocalToken = () => crypto.randomUUID();

type AuthHooks = {
  setLocalMode: (value: boolean) => void;
  setConnectionStatus: (mode: "api" | "local") => void;
};

export const createAuthService = ({ setLocalMode, setConnectionStatus }: AuthHooks) => {
  const initSession = () => loadSession();

  const registerLocal = (full_name: string, email: string, password: string): AuthResponse => {
    const users = loadLocalUsers();
    const exists = users.find((user) => user.email === email);
    if (exists) {
      throw new Error("Email already registered");
    }

    const user = createLocalUser(full_name, email, password);
    const next = [...users, user];
    saveLocalUsers(next);
    const token = createLocalToken();
    const sessionUser: User = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      created_at: user.created_at
    };
    saveSession(sessionUser, token);
    return { access_token: token, token_type: "bearer", user: sessionUser };
  };

  const loginLocal = (email: string, password: string): AuthResponse => {
    const users = loadLocalUsers();
    const user = users.find((item) => item.email === email);
    if (!user || user.password !== password) {
      throw new Error("Invalid credentials");
    }
    const token = createLocalToken();
    const sessionUser: User = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      created_at: user.created_at
    };
    saveSession(sessionUser, token);
    return { access_token: token, token_type: "bearer", user: sessionUser };
  };

  const register = async (full_name: string, email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = (await apiRequest(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify({ full_name, email, password })
        }
      )) as AuthResponse;
      setLocalMode(false);
      setConnectionStatus("api");
      saveSession(response.user, response.access_token);
      return response;
    } catch {
      setLocalMode(true);
      setConnectionStatus("local");
      return registerLocal(full_name, email, password);
    }
  };

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = (await apiRequest(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password })
        }
      )) as AuthResponse;
      setLocalMode(false);
      setConnectionStatus("api");
      saveSession(response.user, response.access_token);
      return response;
    } catch {
      setLocalMode(true);
      setConnectionStatus("local");
      return loginLocal(email, password);
    }
  };

  const logout = () => clearSession();

  return {
    initSession,
    register,
    login,
    logout
  };
};
