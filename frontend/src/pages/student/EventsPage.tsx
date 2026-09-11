import { useMemo, useState } from "react";
import { useFetch } from "../../hooks";
import { listEvents } from "../../services/eventService";
import EventCard from "../../components/cards/EventCard";
import Loading from "../../components/common/Loading";
import StatusState from "../../components/common/StatusState";

const FILTERS = ["All", "Technology", "Competition", "Workshop", "Career"] as const;

export default function EventsPage() {
  const { data, loading, error, refetch } = useFetch(listEvents);
  const [filter, setFilter] = useState("All");

  const items = useMemo(
    () => filter === "All" ? (data || []) : (data || []).filter((e) => e.category === filter),
    [data, filter]
  );

  return (
    <div className="page">
      <p className="eyebrow">Discover</p>
      <h1 className="title mt-1">Campus events</h1>
      <p className="muted mt-2">Find activities, workshops and competitions worth your time.</p>

      {/* Filter buttons — dark-theme compatible */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((x) => (
          <button
            key={x}
            onClick={() => setFilter(x)}
            style={{
              padding: "8px 16px",
              borderRadius: "10px",
              border: `1px solid ${filter === x ? "rgba(245,245,243,0.18)" : "#2a2a2a"}`,
              background: filter === x ? "rgba(245,245,243,0.10)" : "transparent",
              color: filter === x ? "#f5f5f3" : "#a5a5a0",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s ease",
            }}
          >
            {x}
          </button>
        ))}
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <StatusState type="error" message={error} onRetry={() => void refetch()} />
      ) : items.length === 0 ? (
        <StatusState type="empty" message="No events match this filter." />
      ) : (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      )}
    </div>
  );
}