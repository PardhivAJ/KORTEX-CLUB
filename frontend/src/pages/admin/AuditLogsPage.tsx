import { useFetch } from "../../hooks";
import { getAuditLogs } from "../../services/adminService";
import Card from "../../components/common/Card";
import Loading from "../../components/common/Loading";
import StatusState from "../../components/common/StatusState";

export default function AuditLogsPage() {
  const { data, loading, error, refetch } = useFetch(getAuditLogs);

  return (
    <div className="page">
      <p className="eyebrow">Security</p>
      <h1 className="title mt-1">Audit logs</h1>
      <p className="muted mt-2">Trace important changes across the Kortex platform.</p>

      <Card className="mt-6 overflow-hidden">
        {loading ? (
          <Loading />
        ) : error ? (
          <StatusState type="error" message={error} onRetry={() => void refetch()} />
        ) : !data || data.length === 0 ? (
          <StatusState type="empty" message="No audit logs recorded yet." />
        ) : (
          <div className="divide-y divide-[#242424]">
            {data.map((x) => (
              <div
                key={x.id}
                className="grid gap-2 p-5 md:grid-cols-[1fr_180px_220px] md:items-center hover:bg-[#121212] transition"
              >
                <div>
                  <p className="font-semibold text-[#f5f5f3]">{x.action}</p>
                  <p className="text-xs text-[#a5a5a0]">{x.metadata}</p>
                </div>
                <p className="text-sm text-[#a5a5a0]">{x.actor}</p>
                <p className="text-xs text-[#70706b]">
                  {new Date(x.timestamp).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}