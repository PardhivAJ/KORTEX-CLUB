import { useState } from "react";
import { ClipboardCheck } from "lucide-react";
import Card from "../../components/common/Card";
import StatCard from "../../components/cards/StatCard";
import { statusClass } from "../../utils/formatters";
import type { AttendanceRecord } from "../../types";

const rows: AttendanceRecord[] = [
  { id: "1", date: "2026-09-01", subject: "Computer Networks", faculty: "Dr. Meera Rao", startTime: "09:00", endTime: "10:00", status: "Present", percentage: 91 },
  { id: "2", date: "2026-09-01", subject: "Database Systems", faculty: "Prof. Arun", startTime: "10:00", endTime: "11:00", status: "Present", percentage: 88 },
  { id: "3", date: "2026-08-31", subject: "Operating Systems", faculty: "Dr. Kavya", startTime: "11:00", endTime: "12:00", status: "Late", percentage: 79 },
  { id: "4", date: "2026-08-30", subject: "Software Engineering", faculty: "Prof. Ramesh", startTime: "14:00", endTime: "15:00", status: "Absent", percentage: 74 },
];

export default function AttendanceHistoryPage() {
  const [query, setQuery] = useState("");
  const data = rows.filter((x) => x.subject.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="page">
      <p className="eyebrow">Academic record</p>
      <h1 className="title mt-1">Attendance history</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Overall" value="86%" Icon={ClipboardCheck} />
        <StatCard label="Present" value="91%" Icon={ClipboardCheck} />
        <StatCard label="Subjects at risk" value="1" Icon={ClipboardCheck} />
      </div>

      <Card className="mt-6 overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[#242424] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <ClipboardCheck size={19} className="text-[#ff6b4a]" />
            <h2 className="font-bold text-[#f5f5f3]">Recent classes</h2>
          </div>
          <input
            className="input max-w-xs"
            placeholder="Search subject..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-[#a5a5a0] border-b border-[#242424]">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Subject</th>
                <th className="px-5 py-3">Faculty</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242424]">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-[#a5a5a0]">
                    No subjects match "{query}".
                  </td>
                </tr>
              ) : (
                data.map((r) => (
                  <tr key={r.id} className="hover:bg-[#121212] transition">
                    <td className="px-5 py-4 text-[#a5a5a0]">{r.date}</td>
                    <td className="px-5 py-4 font-semibold text-[#f5f5f3]">{r.subject}</td>
                    <td className="px-5 py-4 text-[#a5a5a0]">{r.faculty}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(r.status)}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-[#f5f5f3]">{r.percentage}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}