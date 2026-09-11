import type { User } from "../types";
import { isRecord } from "./storage";

const KEY = "kortex_auth";

export const authStore = {
  get(): User | null {
    try {
      const value: unknown = JSON.parse(localStorage.getItem(KEY) || "null");
      if (!isRecord(value) || typeof value.id !== "string" || typeof value.name !== "string" || typeof value.email !== "string" || !["student", "faculty", "admin"].includes(String(value.role))) return null;
      return value as unknown as User;
    } catch { return null; }
  },
  set(user: User) { localStorage.setItem(KEY, JSON.stringify(user)); window.dispatchEvent(new CustomEvent("kortex:auth")); },
  clear() { localStorage.removeItem(KEY); localStorage.removeItem("kortex_token"); window.dispatchEvent(new CustomEvent("kortex:auth")); }
};