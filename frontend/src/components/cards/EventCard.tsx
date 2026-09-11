import { CalendarDays, MapPin, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Event } from "../../types";
import { formatShortDate, statusClass } from "../../utils/formatters";
import EventCountdown from "../common/EventCountdown";
export default function EventCard({ event }: { event:Event }) {
  const navigate=useNavigate();
  return <article className="group panel overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
    <div className="event-card-banner h-32 p-5"><div className="flex justify-between"><span className="event-card-chip rounded-full px-2.5 py-1 text-[11px]">{event.category}</span><span className={`rounded-full px-2.5 py-1 text-[11px] ${event.status==="Live"?"bg-rose-500 text-white":"event-card-chip"}`}>{event.status}</span></div><div className="mt-5 flex items-center justify-between gap-3"><p className="event-card-organizer text-xs">{event.organizer}</p><EventCountdown date={event.date} startTime={event.startTime} status={event.status} compact /></div></div>
    <div className="event-card-content p-6"><h3 className="event-card-title text-lg font-bold">{event.title}</h3><p className="event-card-description mt-3 line-clamp-2 text-base leading-6">{event.description}</p><div className="event-card-meta mt-5 space-y-3 text-sm"><div className="flex items-center gap-2"><CalendarDays size={16}/>{formatShortDate(event.date)} · {event.startTime}</div><div className="flex items-center gap-2"><MapPin size={16}/>{event.venue}</div></div><div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4"><span className="event-card-points text-base font-semibold">+{event.points} pts</span><button onClick={()=>navigate(`/student/events/${event.id}`)} className="event-card-action flex items-center gap-1 text-base font-semibold">View <ArrowUpRight size={17}/></button></div></div>
  </article>;
}