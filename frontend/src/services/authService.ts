import { api } from "./apiClient";
import type { Role, User } from "../types";

type BackendUser = { id: string; email: string; firstName: string; lastName: string; role: "STUDENT" | "FACULTY" | "MOD" | "ADMIN"; studentProfile?: { rollNumber?: string; department?: string; semester?: number } | null; phone?: string | null };
type LoginResponse = { user: BackendUser; accessToken: string; refreshToken: string };

function mapUser(user: BackendUser): User {
  const role: Role = user.role === "ADMIN" || user.role === "MOD" ? "admin" : user.role === "FACULTY" ? "faculty" : "student";
  return { id: user.id, email: user.email, name: `${user.firstName} ${user.lastName}`.trim(), role, phone: user.phone || undefined, rollNumber: user.studentProfile?.rollNumber, department: user.studentProfile?.department, year: user.studentProfile?.semester ? `Semester ${user.studentProfile.semester}` : undefined };
}

export async function login(email: string, password: string): Promise<User> {
  const result = await api<LoginResponse>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
  localStorage.setItem("kortex_token", result.accessToken);
  const user = mapUser(result.user);
  localStorage.setItem("kortex_refresh_token", result.refreshToken);
  return user;
}

export async function currentUser(): Promise<User> { return mapUser(await api<BackendUser>("/auth/me")); }
export { mapUser };