import { useState } from "react";
import { QrCode, ShieldCheck } from "lucide-react";
import { checkIn } from "../../services/checkInService";
import Card from "../../components/common/Card";

export default function CheckInPage() {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!code.trim()) return;
    setBusy(true);
    setMsg("");
    try {
      const r = await checkIn("e1", code.trim());
      setMsg(r.message);
      setCode("");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Check-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page max-w-3xl">
      <p className="eyebrow">Attendance</p>
      <h1 className="title mt-1">Event check-in</h1>
      <p className="muted mt-2">Use the code displayed by the event coordinator.</p>

      <Card className="mt-7 p-7 text-center sm:p-10">
        <form onSubmit={submit}>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-[#242424] bg-[#141414] text-[#f5f5f3]">
            <QrCode size={40} />
          </div>
          <h2 className="mt-5 text-xl font-bold text-[#f5f5f3]">Enter event code</h2>
          <p className="mt-2 text-sm text-[#a5a5a0]">Your check-in is timestamped and linked to your student account.</p>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="input mx-auto mt-6 max-w-sm text-center text-lg tracking-[.2em]"
            placeholder="KTX-2026"
            required
          />
          <button
            type="submit"
            disabled={busy || !code.trim()}
            className="btn-primary mx-auto mt-4 w-full max-w-sm disabled:opacity-50"
          >
            {busy ? "Verifying..." : "Confirm check-in"}
          </button>
        </form>

        {msg && (
          <div className="mx-auto mt-5 flex max-w-sm items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-3 text-sm text-emerald-400">
            <ShieldCheck size={17} />
            {msg}
          </div>
        )}
      </Card>
    </div>
  );
}