import { api } from "./apiClient";
export type Notification = { id: string; title: string; message: string; type?: string; isRead: boolean; createdAt: string };
export function listUnreadNotifications() { return api<Notification[]>("/notifications/unread"); }
export function markNotificationRead(id: string) { return api<Notification>(`/notifications/${id}/read`, { method: "PATCH" }); }
export function markAllNotificationsRead() { return api<void>("/notifications/read-all", { method: "PATCH" }); }
