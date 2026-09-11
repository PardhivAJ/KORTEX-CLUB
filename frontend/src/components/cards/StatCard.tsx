import type { LucideIcon } from "lucide-react";
import Card from "../common/Card";

export default function StatCard({
  label,
  value,
  delta,
  Icon,
}: {
  label: string;
  value: string | number;
  delta?: string;
  Icon: LucideIcon;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#a5a5a0]">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-[#f5f5f3]">{value}</p>
          {delta && <p className="mt-1 text-xs font-medium text-[#ff9d4d]">{delta}</p>}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#242424] bg-[#141414] text-[#f5f5f3]">
          <Icon size={19} />
        </div>
      </div>
    </Card>
  );
}