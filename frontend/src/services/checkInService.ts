import { api, isMockMode } from "./apiClient";

export async function checkIn(eventId: string, code: string) {
  if (!isMockMode) {
    const qr = await api<{ id: string; eventId: string }>(`/check-in/qr/${encodeURIComponent(code.trim())}`);
    if (qr.eventId !== eventId) throw new Error("This code belongs to a different event.");
    return api<{ success: boolean; message: string }>("/check-in/submit", { method: "POST", body: JSON.stringify({ eventId, qrCodeId: qr.id }) });
  }
  await new Promise((r) => setTimeout(r, 500));
  if (!code.trim()) throw new Error("Enter the event code.");
  return { success: true, message: "Check-in recorded successfully." };
}