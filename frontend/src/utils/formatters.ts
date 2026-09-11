export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));

export const formatShortDate = (value: string) =>
  new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short" }).format(new Date(value));

export const formatNumber = (value: number) => new Intl.NumberFormat("en-IN").format(value);

export const initials = (name: string) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((x) => x[0].toUpperCase()).join("");

export const statusClass = (status: string) => {
  const map: Record<string, string> = {
    Present: "bg-emerald-50 text-emerald-700",
    Approved: "bg-emerald-50 text-emerald-700",
    Live: "bg-rose-50 text-rose-700",
    Upcoming: "bg-blue-50 text-blue-700",
    Completed: "bg-slate-100 text-slate-600",
    Late: "bg-amber-50 text-amber-700",
    Absent: "bg-red-50 text-red-700",
    Pending: "bg-amber-50 text-amber-700",
    Rejected: "bg-red-50 text-red-700"
  };
  return map[status] ?? "bg-slate-100 text-slate-600";
};