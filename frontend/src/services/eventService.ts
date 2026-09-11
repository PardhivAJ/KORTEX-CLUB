import { api, isMockMode } from "./apiClient";
import type { Event } from "../types";

const demoEvents: Event[] = [
  { id:"e1", title:"Kortex Innovation Summit", description:"A campus-wide innovation showcase featuring student projects, founders and technical workshops.", venue:"Main Auditorium", date:"2026-09-12", startTime:"10:00", endTime:"16:00", organizer:"Innovation Cell", category:"Technology", points:80, capacity:500, registered:342, status:"Upcoming" },
  { id:"e2", title:"CodeSprint 2026", description:"Competitive programming and problem-solving challenge for students across departments.", venue:"Block A Labs", date:"2026-09-18", startTime:"09:30", endTime:"18:00", organizer:"Coding Club", category:"Competition", points:120, capacity:250, registered:198, status:"Upcoming" },
  { id:"e3", title:"Design Thinking Workshop", description:"Hands-on workshop covering ideation, prototyping and user-centered problem solving.", venue:"Seminar Hall 2", date:"2026-09-05", startTime:"14:00", endTime:"17:00", organizer:"Design Society", category:"Workshop", points:50, capacity:120, registered:96, status:"Live" },
  { id:"e4", title:"Industry Connect: Product Careers", description:"Interactive industry session with product leaders and alumni.", venue:"MBA Block", date:"2026-08-24", startTime:"11:00", endTime:"13:00", organizer:"Career Services", category:"Career", points:40, capacity:180, registered:180, status:"Completed" }
];

export async function listEvents(): Promise<Event[]> {
  if (!isMockMode) { const response = await api<{ events: Array<Record<string, unknown>> }>("/events"); return response.events.map(mapEvent); }
  return new Promise((resolve) => setTimeout(() => resolve(demoEvents), 220));
}
export async function getEvent(id: string): Promise<Event | undefined> {
  if (!isMockMode) return mapEvent(await api<Record<string, unknown>>(`/events/${id}`));
  return demoEvents.find((e) => e.id === id);
}
export async function createEvent(payload: Partial<Event>) {
  if (!isMockMode) return mapEvent(await api<Record<string, unknown>>("/events", { method: "POST", body: JSON.stringify({ name: payload.title, description: payload.description, date: payload.date, startTime: payload.startTime, endTime: payload.endTime, location: payload.venue, category: payload.category, capacity: payload.capacity, basePoints: payload.points, registrationOpenDate: payload.date, registrationCloseDate: payload.date }) }));
  return { ...demoEvents[0], ...payload, id: crypto.randomUUID() } as Event;
}

function mapEvent(value: Record<string, unknown>): Event {
  return { id: String(value.id), title: String(value.name || value.title || "Untitled event"), description: String(value.description || ""), venue: String(value.location || value.venue || "TBA"), date: String(value.date), startTime: String(value.startTime), endTime: String(value.endTime), organizer: String(value.organizer || "Kortex"), category: String(value.category || "General"), points: Number(value.basePoints ?? value.points ?? 0), capacity: Number(value.capacity ?? 0), registered: Number(value.currentRegistrations ?? value.registered ?? 0), status: new Date(String(value.date)).getTime() > Date.now() ? "Upcoming" : "Completed" };
}

export async function registerForEvent(eventId: string) { return api(`/events/${eventId}/register`, { method: "POST" }); }
export async function cancelRegistration(eventId: string) { return api(`/events/${eventId}/register`, { method: "DELETE" }); }