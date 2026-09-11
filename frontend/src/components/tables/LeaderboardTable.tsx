import type { LeaderboardEntry } from "../../types";

export default function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-wider text-[#a5a5a0] border-b border-[#242424]">
          <tr>
            <th className="px-5 py-3">Rank</th>
            <th className="px-5 py-3">Student</th>
            <th className="px-5 py-3">Department</th>
            <th className="px-5 py-3 text-right">Events</th>
            <th className="px-5 py-3 text-right">Points</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#242424]">
          {entries.map((e) => (
            <tr key={e.rank} className="hover:bg-[#121212] transition">
              <td className="px-5 py-4 font-extrabold text-[#ff9d4d]">#{e.rank}</td>
              <td className="px-5 py-4 font-semibold text-[#f5f5f3]">{e.name}</td>
              <td className="px-5 py-4 text-[#a5a5a0]">{e.department}</td>
              <td className="px-5 py-4 text-right text-[#a5a5a0]">{e.events}</td>
              <td className="px-5 py-4 text-right font-bold text-[#f5f5f3]">{e.points} pts</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}