import { useState } from "react";
import { useFetch } from "../../hooks";
import { getRequests, updateRequest } from "../../services/adminService";
import Card from "../../components/common/Card";
import Loading from "../../components/common/Loading";
import StatusState from "../../components/common/StatusState";

export default function PendingApprovalsPage() {
  const { data, loading, error, refetch } = useFetch(getRequests);
  const [busy, setBusy] = useState("");

  async function act(id: string, status: "Approved" | "Rejected") {
    setBusy(id);
    try {
      await updateRequest(id, status);
      await refetch();
    } catch {
      // Error handling
    } finally {
      setBusy("");
    }
  }

  const pending = (data || []).filter((x) => x.status === "Pending");

  return (
    <div className="page">
      <p className="eyebrow">Governance</p>
      <h1 className="title mt-1">Pending approvals</h1>
      <p className="muted mt-2">Central review queue for attendance and campus operations.</p>

      <Card className="mt-6 overflow-hidden">
        {loading ? (
          <Loading />
        ) : error ? (
          <StatusState type="error" message={error} onRetry={() => void refetch()} />
        ) : pending.length === 0 ? (
          <StatusState type="empty" message="All pending approvals have been reviewed." />
        ) : (
          <div className="divide-y divide-[#242424]">
            {pending.map((r) => (
              <div
                key={r.id}
                className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between hover:bg-[#121212] transition"
              >
                <div>
                  <p className="font-semibold text-[#f5f5f3]">
                    {r.student} <span className="font-normal text-[#a5a5a0]">· {r.rollNumber}</span>
                  </p>
                  <p className="mt-1 text-sm text-[#a5a5a0]">
                    {r.subject} · {r.date}
                  </p>
                  <p className="mt-2 text-sm text-[#f5f5f3]/80">{r.reason}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={busy === r.id}
                    onClick={() => void act(r.id, "Approved")}
                    className="rounded-xl bg-[#ff6b4a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#ff815e] disabled:opacity-50 transition"
                  >
                    Approve
                  </button>
                  <button
                    disabled={busy === r.id}
                    onClick={() => void act(r.id, "Rejected")}
                    className="btn-secondary px-4 py-2 text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}