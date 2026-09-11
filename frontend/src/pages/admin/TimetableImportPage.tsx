import { useState } from "react";
import { UploadCloud, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import Card from "../../components/common/Card";
import { importTimetable } from "../../services/adminService";

export default function TimetableImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!file) return;
    setBusy(true);
    try {
      const result = await importTimetable([]);
      setMsg(`Import complete. ${result.imported} records processed.`);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Import failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page max-w-4xl">
      <p className="eyebrow">Data operations</p>
      <h1 className="title mt-1">Timetable import</h1>
      <p className="muted mt-2">Upload the college timetable and prepare it for attendance conflict detection.</p>

      <Card className="mt-6 p-6">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#333333] bg-[#121212] px-6 py-14 text-center hover:border-[#ff6b4a] transition">
          <input
            className="hidden"
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <UploadCloud size={35} className="text-[#a5a5a0]" />
          <p className="mt-3 font-bold text-[#f5f5f3]">{file ? file.name : "Drop timetable here or browse"}</p>
          <p className="mt-1 text-sm text-[#a5a5a0]">Excel or CSV · Roll Number, Day, Start Time, End Time, Subject, Faculty</p>
        </label>

        {file && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#242424] bg-[#121212] p-4">
            <FileSpreadsheet size={20} className="text-[#ff6b4a]" />
            <span className="text-sm font-semibold text-[#f5f5f3]">{file.name}</span>
            <button type="button" onClick={() => setFile(null)} className="ml-auto text-xs text-[#a5a5a0] hover:text-[#f5f5f3]">
              Remove
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => void submit()}
          disabled={!file || busy}
          className="btn-primary mt-5 disabled:opacity-50"
        >
          {busy ? "Processing..." : "Process timetable"}
        </button>

        {msg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400">
            <CheckCircle2 size={17} />
            {msg}
          </div>
        )}
      </Card>
    </div>
  );
}