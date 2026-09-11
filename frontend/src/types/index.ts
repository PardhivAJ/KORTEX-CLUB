export type Role = "student" | "faculty" | "admin";
export type AttendanceStatus = "Present" | "Late" | "Absent" | "Pending";
export type EventStatus = "Upcoming" | "Live" | "Completed";
export type RequestStatus = "Pending" | "Approved" | "Rejected";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  rollNumber?: string;
  department?: string;
  year?: string;
  section?: string;
  cluster?: string;
  phone?: string;
  avatar?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  venue: string;
  date: string;
  startTime: string;
  endTime: string;
  organizer: string;
  category: string;
  points: number;
  capacity: number;
  registered: number;
  status: EventStatus;
  banner?: string;
}

export interface Judge {
  id: string;
  name: string;
  expertise: string;
  handle: string;
  photo?: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface AdminChangeRequest {
  id: string;
  requesterRole: Role;
  message: string;
  status: RequestStatus;
  createdAt: string;
}

export interface TeamGenerationConfig {
  teamPoolName: string;
  teamSize: number;
  generatedAt?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  subject: string;
  faculty: string;
  startTime: string;
  endTime: string;
  status: AttendanceStatus;
  percentage: number;
}

export interface AttendanceRequest {
  id: string;
  student: string;
  rollNumber: string;
  subject: string;
  date: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  department: string;
  points: number;
  events: number;
}

export interface TimetableEntry {
  id: string;
  rollNumber: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  faculty: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  metadata: string;
}

export interface DashboardStats {
  attendance: number;
  points: number;
  events: number;
  rank: number;
}