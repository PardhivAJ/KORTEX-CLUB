import { api, isMockMode } from "./apiClient";
import type { AttendanceRequest, AuditLog, TimetableEntry } from "../types";

const requests: AttendanceRequest[] = [
  { id:"r1", student:"Vikram Kumar", rollNumber:"22CS104", subject:"Computer Networks", date:"2026-08-31", reason:"Medical appointment", status:"Pending" },
  { id:"r2", student:"Priya Sharma", rollNumber:"22IT087", subject:"Database Systems", date:"2026-08-30", reason:"Official college event", status:"Pending" },
  { id:"r3", student:"Arjun Rao", rollNumber:"22EC044", subject:"Digital Signal Processing", date:"2026-08-28", reason:"Approved participation", status:"Approved" }
];

const logs: AuditLog[] = [
  { id:"a1", action:"Timetable imported", actor:"Admin", timestamp:"2026-09-01T08:40:00", metadata:"420 records processed" },
  { id:"a2", action:"Attendance request approved", actor:"Dr. Meera", timestamp:"2026-09-01T09:10:00", metadata:"22EC044 / DSP" },
  { id:"a3", action:"Event published", actor:"Admin", timestamp:"2026-09-01T10:25:00", metadata:"Kortex Innovation Summit" }
];

export async function getRequests(): Promise<AttendanceRequest[]> {
  if (!isMockMode) return api<AttendanceRequest[]>("/admin/attendance-requests");
  return requests;
}
export async function updateRequest(id: string, status: "Approved" | "Rejected") {
  if (!isMockMode) return api(`/admin/attendance-requests/${id}`, { method:"PATCH", body:JSON.stringify({ status }) });
  const item = requests.find((x) => x.id === id);
  if (item) item.status = status;
}
export async function getAuditLogs(): Promise<AuditLog[]> {
  if (!isMockMode) return api<AuditLog[]>("/admin/audit-logs");
  return logs;
}
export async function importTimetable(rows: TimetableEntry[]): Promise<{ imported: number }> {
  if (!isMockMode) return api<{ imported: number }>("/admin/timetable/import", { method:"POST", body:JSON.stringify({ rows }) });
  return { imported: rows.length };
}