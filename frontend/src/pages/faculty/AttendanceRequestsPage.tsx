import { useState } from "react";
import { useFetch } from "../../hooks";
import { getRequests, updateRequest } from "../../services/adminService";
import Card from "../../components/common/Card";
import Loading from "../../components/common/Loading";
import StatusState from "../../components/common/StatusState";

export default function AttendanceRequestsPage() {
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

  return (
    <div className="page">
      <p className="eyebrow">Faculty workflow</p>
      <h1 className="title mt-1">Attendance requests</h1>
      <p className="muted mt-2">Review student-submitted attendance corrections.</p>

      <Card className="mt-6 overflow-hidden">
        {loading ? (
          <Loading />
        ) : error ? (
          <StatusState type="error" message={error} onRetry={() => void refetch()} />
        ) : !data || data.length === 0 ? (
          <StatusState type="empty" message="No attendance requests pending review." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-[#a5a5a0] border-b border-[#242424]">
                <tr>
                  <th className="px-5 py-3">Student</th>
                  <th className="px-5 py-3">Subject</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Reason</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242424]">
                {data.map((r) => (
                  <tr key={r.id} className="hover:bg-[#121212] transition">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#f5f5f3]">{r.student}</p>
                      <p className="text-xs text-[#a5a5a0]">{r.rollNumber}</p>
                    </td>
                    <td className="px-5 py-4 text-[#f5f5f3]">{r.subject}</td>
                    <td className="px-5 py-4 text-[#a5a5a0]">{r.date}</td>
                    <td className="max-w-xs px-5 py-4 text-[#a5a5a0]">{r.reason}</td>
                    <td className="px-5 py-4">
                      {r.status === "Pending" ? (
                        <div className="flex gap-2">
                          <button
                            disabled={busy === r.id}
                            onClick={() => void act(r.id, "Approved")}
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 transition"
                          >
                            Approve
                          </button>
                          <button
                            disabled={busy === r.id}
                            onClick={() => void act(r.id, "Rejected")}
                            className="btn-secondary px-3 py-1.5 text-xs"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            r.status === "Approved"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}
                        >
                          {r.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}