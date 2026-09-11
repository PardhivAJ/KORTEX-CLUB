import { CalendarDays, Clock, MapPin, Users, ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useFetch } from "../../hooks";
import { getEvent } from "../../services/eventService";
import Loading from "../../components/common/Loading";
import Card from "../../components/common/Card";
import EventCountdown from "../../components/common/EventCountdown";
import StatusState from "../../components/common/StatusState";

export default function EventDetailPage() {
  const { id } = useParams();
  const { data: event, loading, error, refetch } = useFetch(() => getEvent(id || ""), [id]);

  if (loading) return <div className="page"><Loading /></div>;

  if (error) return (
    <div className="page">
      <StatusState type="error" message={error} onRetry={() => void refetch()} />
    </div>
  );

  if (!event) return (
    <div className="page">
      <Link to="/student/events" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#a5a5a0] hover:text-[#f5f5f3]">
        <ArrowLeft size={16} /> Back to events
      </Link>
      <p className="text-[#a5a5a0] mt-4">Event not found.</p>
    </div>
  );

  return (
    <div className="page max-w-5xl">
      {/* Back navigation — dark theme compatible */}
      <Link
        to="/student/events"
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#a5a5a0] hover:text-[#f5f5f3] transition-colors"
      >
        <ArrowLeft size={16} /> Back to events
      </Link>

      <div className="overflow-hidden rounded-3xl bg-[#0d0d0d] border border-[#242424] p-7 text-[#f5f5f3] sm:p-10">
        <span className="rounded-full bg-[#f5f5f3]/10 px-3 py-1 text-xs font-semibold">{event.category}</span>
        <h1 className="mt-5 max-w-3xl text-3xl font-bold sm:text-5xl">{event.title}</h1>
        <p className="mt-4 max-w-2xl text-[#a5a5a0]">{event.description}</p>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
        <Card className="p-6">
          <p className="eyebrow">Event information</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="flex gap-3">
              <CalendarDays className="text-[#a5a5a0]" />
              <div>
                <p className="font-semibold">Date</p>
                <p className="text-sm text-[#a5a5a0]">{event.date}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="text-[#a5a5a0]" />
              <div>
                <p className="font-semibold">Time</p>
                <p className="text-sm text-[#a5a5a0]">{event.startTime} – {event.endTime}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="text-[#a5a5a0]" />
              <div>
                <p className="font-semibold">Venue</p>
                <p className="text-sm text-[#a5a5a0]">{event.venue}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Users className="text-[#a5a5a0]" />
              <div>
                <p className="font-semibold">Registrations</p>
                <p className="text-sm text-[#a5a5a0]">{event.registered}/{event.capacity}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <p className="eyebrow">Participation</p>
          <p className="mt-2 text-3xl font-bold">+{event.points}</p>
          <p className="text-sm text-[#a5a5a0]">Kortex points</p>
          <EventCountdown date={event.date} startTime={event.startTime} status={event.status} />
          <p className="mt-6 rounded-xl bg-[#141414] border border-[#242424] p-3 text-sm text-[#a5a5a0]">
            Attendance is recorded by the event coordinator.
          </p>
        </Card>
      </div>
    </div>
  );
}