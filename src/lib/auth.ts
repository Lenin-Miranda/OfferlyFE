import { api } from "./axios";

export const checkAuth = async (): Promise<boolean> => {
  try {
    await api.get("/auth/check-auth");
    return true;
  } catch (error) {
    return false;
  }
};

export async function login(email: string, password: string) {
  try {
    await api.post("/auth/login", { email, password });
  } catch (error) {
    console.error("Login failed", error);
  }
}

export async function register(name: string, email: string, password: string) {
  try {
    await api.post("/auth/login", { name, email, password });
  } catch (e) {
    console.error("Register failed", e);
  }
}

export async function logout() {
  try {
    await api.post("/auth/logout");
  } catch (e) {
    console.error("Logout failed", e);
  }
}
